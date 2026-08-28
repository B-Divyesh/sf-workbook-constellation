export type WarningKind = 'external' | 'circular' | 'opaque';

export interface FormulaRecord {
  sheet: string;
  cell: string;
  formula: string;
  precedents: Array<{ sheet: string; ref: string; external?: string }>;
  warnings: WarningKind[];
}

export interface SheetNode {
  name: string;
  formulaCount: number;
  inbound: number;
  outbound: number;
}

export interface SheetEdge {
  from: string;
  to: string;
  count: number;
  formulas: Array<{ destination: string; source: string; formula: string }>;
}

export interface Audit {
  fileName: string;
  createdAt: string;
  sheets: SheetNode[];
  edges: SheetEdge[];
  formulas: FormulaRecord[];
  warnings: Array<{ kind: WarningKind; sheet: string; cell: string; detail: string }>;
}
