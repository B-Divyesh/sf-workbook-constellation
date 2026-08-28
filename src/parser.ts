import * as XLSX from 'xlsx';
import type { Audit, FormulaRecord, SheetEdge, WarningKind } from './types';

const cellRef = /(?:(?:'((?:[^']|'')+)'|([A-Za-z0-9_. \[\]-]+))!)?(\$?[A-Z]{1,3}\$?\d+)(?::(\$?[A-Z]{1,3}\$?\d+))?/g;
const opaqueFunctions = /\b(?:INDIRECT|OFFSET|WEBSERVICE|CUBE(?:VALUE|MEMBER)|RTD)\s*\(/i;
const externalBook = /\[([^\]]+)\]/;

function cleanSheet(value: string | undefined, current: string) {
  return (value?.replace(/''/g, "'").replace(externalBook, '') || current).trim();
}

export function parseFormula(formula: string, currentSheet: string) {
  const precedents: FormulaRecord['precedents'] = [];
  const warnings = new Set<WarningKind>();
  if (opaqueFunctions.test(formula)) warnings.add('opaque');
  let match: RegExpExecArray | null;
  cellRef.lastIndex = 0;
  while ((match = cellRef.exec(formula))) {
    const rawSheet = match[1] || match[2];
    const external = rawSheet?.match(externalBook)?.[1];
    if (external) warnings.add('external');
    const sheet = cleanSheet(rawSheet, currentSheet);
    precedents.push({ sheet, ref: match[4] ? `${match[3]}:${match[4]}` : match[3], external });
  }
  return { precedents, warnings: [...warnings] };
}

export function auditWorkbook(buffer: ArrayBuffer, fileName: string): Audit {
  const workbook = XLSX.read(buffer, { type: 'array', cellFormula: true, cellHTML: false, cellNF: false });
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
  const graph = new Map<string, string[]>();
  edges.forEach(edge => graph.set(edge.from, [...(graph.get(edge.from) || []), edge.to]));
  const circularSheets = new Set<string>();
  const visit = (start: string, node: string, seen: Set<string>) => {
    for (const next of graph.get(node) || []) {
      if (next === start) circularSheets.add(start);
      else if (!seen.has(next)) visit(start, next, new Set([...seen, next]));
    }
  };
  sheetNames.forEach(sheet => visit(sheet, sheet, new Set([sheet])));
  for (const formula of formulas) {
    if (circularSheets.has(formula.sheet) && !formula.warnings.includes('circular')) {
      formula.warnings.push('circular');
      warnings.push({ kind: 'circular', sheet: formula.sheet, cell: formula.cell, detail: 'This sheet is in a cross-sheet cycle' });
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
