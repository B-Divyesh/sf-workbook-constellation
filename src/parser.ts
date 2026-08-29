import * as XLSX from 'xlsx';
import type { Audit, FormulaRecord, SheetEdge, WarningKind } from './types';

// Excel quotes sheet names containing spaces or arithmetic punctuation. Keep
// the unquoted alternative token-shaped so operators such as the minus in
// `1-Inputs!A1` cannot be absorbed into a workbook reference.
const cellRef = /(?:(?:'((?:[^']|'')+)'|((?:\[[^\]\r\n]+\])?[\p{L}_][\p{L}\p{N}_.]*))!)?(\$?[A-Z]{1,3}\$?\d+)(?::(\$?[A-Z]{1,3}\$?\d+))?/gu;
const opaqueFunctions = /(?:\b(?:INDIRECT|OFFSET|WEBSERVICE|CUBE(?:VALUE|MEMBER)|RTD)\s*\(|(?:_xll\.|_xludf\.)[\p{L}_][\p{L}\p{N}_.]*\s*\()/iu;
const externalBook = /\[([^\]]+)\]/;
const excelAddress = /^(\$?)([A-Z]{1,3})(\$?)([1-9]\d*)$/;
const identifierPart = /[\p{L}\p{N}_.]/u;

// Excel escapes a quote inside a string by doubling it. Keep every character
// outside those strings at its original offset so the reference matcher can
// safely read sheet names from the original formula.
function maskStringLiterals(formula: string) {
  let quoted = false;
  let masked = '';
  for (let index = 0; index < formula.length; index += 1) {
    const char = formula[index];
    if (char === '"') {
      if (quoted && formula[index + 1] === '"') {
        masked += '  ';
        index += 1;
      } else {
        quoted = !quoted;
        masked += ' ';
      }
    } else {
      masked += quoted ? ' ' : char;
    }
  }
  return masked;
}

function cleanSheet(value: string | undefined, current: string) {
  return (value?.replace(/''/g, "'").replace(externalBook, '') || current).trim();
}

function isExcelAddress(value: string) {
  const match = value.match(excelAddress);
  if (!match) return false;
  let column = 0;
  for (const char of match[2]) column = column * 26 + char.charCodeAt(0) - 64;
  return column <= 16_384 && Number(match[4]) <= 1_048_576;
}

function isReferenceToken(searchable: string, match: RegExpExecArray) {
  const before = searchable[match.index - 1];
  const after = searchable[match.index + match[0].length];
  // A1 tokens cannot be embedded in literals, identifiers, structured
  // references, or a function call. This keeps 1E3 and LOG10(100) from
  // becoming E3 and LOG10 precedents while retaining normal operators,
  // ranges, and explicit sheet references.
  if ((before && identifierPart.test(before)) || (after && identifierPart.test(after)) || after === '(') return false;
  return isExcelAddress(match[3]) && (!match[4] || isExcelAddress(match[4]));
}

export function parseFormula(formula: string, currentSheet: string) {
  const precedents: FormulaRecord['precedents'] = [];
  const warnings = new Set<WarningKind>();
  const searchable = maskStringLiterals(formula);
  if (opaqueFunctions.test(searchable)) warnings.add('opaque');
  let match: RegExpExecArray | null;
  cellRef.lastIndex = 0;
  while ((match = cellRef.exec(searchable))) {
    if (!isReferenceToken(searchable, match)) continue;
    const rawSheet = match[1] || match[2];
    const external = rawSheet?.match(externalBook)?.[1];
    if (external) warnings.add('external');
    const sheet = cleanSheet(rawSheet, currentSheet);
    precedents.push({ sheet, ref: match[4] ? `${match[3]}:${match[4]}` : match[3], external });
  }
  return { precedents, warnings: [...warnings] };
}

export function auditWorkbook(buffer: ArrayBuffer, fileName: string): Audit {
  const signature = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 4));
  const compoundFileSignature = signature.length === 4 && signature[0] === 0xd0 && signature[1] === 0xcf && signature[2] === 0x11 && signature[3] === 0xe0;
  if (compoundFileSignature) throw new Error('Encrypted workbooks are not supported');
  const zipSignature = signature.length === 4 && signature[0] === 0x50 && signature[1] === 0x4b && (
    (signature[2] === 0x03 && signature[3] === 0x04) ||
    (signature[2] === 0x05 && signature[3] === 0x06) ||
    (signature[2] === 0x07 && signature[3] === 0x08)
  );
  if (!zipSignature) throw new Error('Workbook is not a valid XLSX container');
  const workbook = XLSX.read(buffer, { type: 'array', cellFormula: true, cellHTML: false, cellNF: false });
  if (!workbook.SheetNames.length) throw new Error('Workbook contains no sheets');
  const formulas: FormulaRecord[] = [];
  for (const sheet of workbook.SheetNames) {
    const data = workbook.Sheets[sheet];
    for (const [cell, value] of Object.entries(data)) {
      if (cell.startsWith('!') || !value || typeof value !== 'object' || !('f' in value) || typeof value.f !== 'string') continue;
      const parsed = parseFormula(value.f, sheet);
      formulas.push({ sheet, cell, formula: `=${value.f}`, ...parsed });
    }
  }
  return buildAudit(fileName, workbook.SheetNames, formulas);
}

export function buildAudit(fileName: string, sheetNames: string[], formulas: FormulaRecord[]): Audit {
  const edgeMap = new Map<string, SheetEdge>();
  const warnings: Audit['warnings'] = [];
  for (const formula of formulas) {
    formula.warnings.forEach(kind => warnings.push({ kind, sheet: formula.sheet, cell: formula.cell, detail: kind === 'opaque' ? formula.formula : 'References another workbook' }));
    for (const precedent of formula.precedents) {
      if (precedent.external) continue;
      if (precedent.sheet === formula.sheet) continue;
      const key = `${precedent.sheet}\u0000${formula.sheet}`;
      const edge = edgeMap.get(key) || { from: precedent.sheet, to: formula.sheet, count: 0, formulas: [] };
      edge.count += 1;
      edge.formulas.push({ destination: `${formula.sheet}!${formula.cell}`, source: `${precedent.sheet}!${precedent.ref}`, formula: formula.formula });
      edgeMap.set(key, edge);
    }
  }
  const edges = [...edgeMap.values()];
  const normalizeCell = (value: string) => value.replace(/\$/g, '').toUpperCase();
  const cellParts = (value: string) => {
    const match = normalizeCell(value).match(/^([A-Z]{1,3})(\d+)$/);
    if (!match) return null;
    let column = 0;
    for (const char of match[1]) column = column * 26 + char.charCodeAt(0) - 64;
    return { column, row: Number(match[2]) };
  };
  const refContains = (ref: string, cell: string) => {
    const [startValue, endValue = startValue] = ref.split(':');
    const start = cellParts(startValue), end = cellParts(endValue), target = cellParts(cell);
    if (!start || !end || !target) return false;
    return target.column >= Math.min(start.column, end.column) && target.column <= Math.max(start.column, end.column)
      && target.row >= Math.min(start.row, end.row) && target.row <= Math.max(start.row, end.row);
  };
  const nodeKey = (sheet: string, cell: string) => `${sheet}\u0000${normalizeCell(cell)}`;
  const formulaByNode = new Map(formulas.map(formula => [nodeKey(formula.sheet, formula.cell), formula]));
  const formulasBySheet = new Map<string, FormulaRecord[]>();
  for (const formula of formulas) formulasBySheet.set(formula.sheet, [...(formulasBySheet.get(formula.sheet) || []), formula]);
  const graph = new Map<string, Set<string>>();
  for (const destination of formulas) {
    const destinationNode = nodeKey(destination.sheet, destination.cell);
    for (const precedent of destination.precedents) {
      if (precedent.external) continue;
      for (const source of formulasBySheet.get(precedent.sheet) || []) {
        if (!refContains(precedent.ref, source.cell)) continue;
        const sourceNode = nodeKey(source.sheet, source.cell);
        graph.set(sourceNode, new Set([...(graph.get(sourceNode) || []), destinationNode]));
      }
    }
  }
  const circularCells = new Set<string>();
  const indices = new Map<string, number>(), lowLinks = new Map<string, number>(), stack: string[] = [], onStack = new Set<string>();
  let nextIndex = 0;
  const connect = (node: string) => {
    indices.set(node, nextIndex);
    lowLinks.set(node, nextIndex);
    nextIndex += 1;
    stack.push(node);
    onStack.add(node);
    for (const next of graph.get(node) || []) {
      if (!indices.has(next)) {
        connect(next);
        lowLinks.set(node, Math.min(lowLinks.get(node)!, lowLinks.get(next)!));
      } else if (onStack.has(next)) {
        lowLinks.set(node, Math.min(lowLinks.get(node)!, indices.get(next)!));
      }
    }
    if (lowLinks.get(node) !== indices.get(node)) return;
    const component: string[] = [];
    let member: string;
    do {
      member = stack.pop()!;
      onStack.delete(member);
      component.push(member);
    } while (member !== node);
    if (component.length > 1 || graph.get(node)?.has(node)) {
      component.forEach(cell => circularCells.add(cell));
    }
  };
  formulaByNode.forEach((_formula, node) => { if (!indices.has(node)) connect(node); });
  for (const formula of formulas) {
    if (circularCells.has(nodeKey(formula.sheet, formula.cell)) && !formula.warnings.includes('circular')) {
      formula.warnings.push('circular');
      warnings.push({ kind: 'circular', sheet: formula.sheet, cell: formula.cell, detail: 'This cell is in a formula dependency cycle' });
    }
  }
  const sheets = sheetNames.map(name => ({
    name,
    formulaCount: formulas.filter(f => f.sheet === name).length,
    inbound: edges.filter(e => e.to === name).reduce((sum, e) => sum + e.count, 0),
    outbound: edges.filter(e => e.from === name).reduce((sum, e) => sum + e.count, 0)
  }));
  return { fileName, createdAt: new Date().toISOString(), sheets, edges, formulas, warnings };
}
