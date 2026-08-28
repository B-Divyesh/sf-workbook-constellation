import { buildAudit } from './parser';
import type { FormulaRecord } from './types';

const formulas: FormulaRecord[] = [
  { sheet: 'Assumptions', cell: 'B4', formula: '=[FY24 actuals.xlsx]Sheet1!B8', precedents: [{ sheet: 'Sheet1', ref: 'B8', external: 'FY24 actuals.xlsx' }], warnings: ['external'] },
  { sheet: 'Payroll', cell: 'F18', formula: '=Headcount!F18*Assumptions!B7', precedents: [{ sheet: 'Headcount', ref: 'F18' }, { sheet: 'Assumptions', ref: 'B7' }], warnings: [] },
  { sheet: 'Revenue', cell: 'F22', formula: '=SUM(Orders!F4:F21)', precedents: [{ sheet: 'Orders', ref: 'F4:F21' }], warnings: [] },
  { sheet: 'Forecast', cell: 'F12', formula: '=Revenue!F22-Payroll!F18-Assumptions!B9', precedents: [{ sheet: 'Revenue', ref: 'F22' }, { sheet: 'Payroll', ref: 'F18' }, { sheet: 'Assumptions', ref: 'B9' }], warnings: [] },
  { sheet: 'Dashboard', cell: 'C7', formula: '=Forecast!F12', precedents: [{ sheet: 'Forecast', ref: 'F12' }], warnings: [] },
  { sheet: 'Dashboard', cell: 'C12', formula: '=INDIRECT(B12&"!F22")', precedents: [{ sheet: 'Dashboard', ref: 'B12' }], warnings: ['opaque'] },
  { sheet: 'Checks', cell: 'B6', formula: '=Dashboard!C7-Forecast!F12', precedents: [{ sheet: 'Dashboard', ref: 'C7' }, { sheet: 'Forecast', ref: 'F12' }], warnings: [] }
];

export const sampleAudit = buildAudit('Northstar-2026-plan.xlsx', ['Assumptions', 'Orders', 'Headcount', 'Payroll', 'Revenue', 'Forecast', 'Dashboard', 'Checks'], formulas);
