export enum RiskLevel {
  Low = 'Low',
  Moderate = 'Moderate',
  High = 'High',
  Critical = 'Critical',
}

export interface FuzzyRule {
  id: number;
  if: string[];
  then: string;
  explanation: string;
}

export interface DiagnosisResponse {
  disease: string;
  confidence: number;
  riskScore: number;
  riskLevel: RiskLevel;
  fuzzyRules: FuzzyRule[];
  recommendations: string[];
  summary: string;
}
