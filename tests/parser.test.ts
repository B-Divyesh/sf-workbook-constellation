import { describe, expect, it, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { auditWorkbook, buildAudit, parseFormula } from '../src/parser';

describe('formula parser', () => {
  it('extracts quoted sheets, ranges, and external links', () => {
    const parsed = parseFormula("SUM('Sales plan'!$B$2:$B$9)+[old.xlsx]Inputs!C4", 'Summary');
    expect(parsed.precedents).toEqual([
      { sheet: 'Sales plan', ref: '$B$2:$B$9', external: undefined },
      { sheet: 'Inputs', ref: 'C4', external: 'old.xlsx' }
    ]);
    expect(parsed.warnings).toContain('external');
  });

  it('flags opaque formulas', () => {
    expect(parseFormula('INDIRECT(A1&"!B2")', 'Summary').warnings).toContain('opaque');
  });

  it('@claim:formula-syntax parses supported A1 references', () => {
    expect(parseFormula("SUM('Sales plan'!$B$2:$B$9)+Inputs!C4", 'Summary').precedents).toEqual([
      { sheet: 'Sales plan', ref: '$B$2:$B$9', external: undefined },
      { sheet: 'Inputs', ref: 'C4', external: undefined }
    ]);
    expect(parseFormula('IF(1=1,"Inputs!A1","")', 'Output').precedents).toEqual([]);
  });

  it('ignores cell-looking text inside Excel string literals', () => {
    expect(parseFormula('IF(1=1,"Inputs!A1","")', 'Output').precedents).toEqual([]);
  });

  it('@claim:read-only-boundaries reports formulas without evaluating macro content', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([[''], ['macro-like text: Shell("bad")']]);
    sheet.A1 = { t: 'n', f: 'Input!A1' };
    XLSX.utils.book_append_sheet(book, sheet, 'Summary');
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([[42]]), 'Input');
    const bytes = XLSX.write(book, { type: 'array', bookType: 'xlsx' });
    const result = auditWorkbook(bytes, 'safe.xlsx');
    expect(result.formulas[0].formula).toBe('=Input!A1');
    expect(result).not.toHaveProperty('calculatedValues');
    expect(JSON.stringify(result)).not.toContain('Shell("bad")');
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('detects a cross-sheet cycle', () => {
    const result = buildAudit('cycle.xlsx', ['A', 'B'], [
      { sheet: 'A', cell: 'A1', formula: '=B!A1', precedents: [{ sheet: 'B', ref: 'A1' }], warnings: [] },
      { sheet: 'B', cell: 'A1', formula: '=A!A1', precedents: [{ sheet: 'A', ref: 'A1' }], warnings: [] }
    ]);
    expect(result.warnings.filter(w => w.kind === 'circular')).toHaveLength(2);
  });

  it('does not report independent bidirectional sheet references as a cell cycle', () => {
    const result = buildAudit('back-links.xlsx', ['A', 'B'], [
      { sheet: 'A', cell: 'B1', formula: '=B!A1', precedents: [{ sheet: 'B', ref: 'A1' }], warnings: [] },
      { sheet: 'B', cell: 'B1', formula: '=A!A1', precedents: [{ sheet: 'A', ref: 'A1' }], warnings: [] }
    ]);
    expect(result.warnings.filter(warning => warning.kind === 'circular')).toEqual([]);
  });

  it('@claim:warning-types identifies external, opaque, and circular formulas', () => {
    const external = parseFormula('[old.xlsx]Inputs!A1', 'A');
    const opaque = parseFormula('OFFSET(A1,1,0)', 'A');
    const cycle = buildAudit('warnings.xlsx', ['A', 'B'], [
      { sheet: 'A', cell: 'A1', formula: '=B!A1', precedents: [{ sheet: 'B', ref: 'A1' }], warnings: external.warnings },
      { sheet: 'B', cell: 'A1', formula: '=A!A1', precedents: [{ sheet: 'A', ref: 'A1' }], warnings: opaque.warnings }
    ]);
    expect(new Set(cycle.warnings.map(warning => warning.kind))).toEqual(new Set(['external', 'opaque', 'circular']));
  });

  it('rejects non-ZIP bytes instead of treating them as an empty workbook', () => {
    const bytes = new TextEncoder().encode('not a workbook');
    expect(() => auditWorkbook(bytes.buffer, 'damaged.xlsx')).toThrow('not a valid XLSX container');
  });
});
