import { Color } from 'ng2-charts';

export interface DashboardStage {
  stageName: string;
  stageColor: string;
  number: number;
}

export interface DashboardStageVM {
  data: number[];
  colors: Color[];
  labels: string[];
}

export interface DashboardClient {
  actual: number;
  potential: number;
}

export interface DashboardOpportunity {
  name: string;
  color: string;
  percentage: number;
}

export interface DashboardStat {
  clients: number;
  contacts: number;
  opportunities: number;
  sales: number;
}

export interface DashboardSale {
  amount: number;
  client: string;
  date: Date;
  service: string;
}

export interface DashboardMonthSale {
  month: string;
  totalAmount: number;
}

export interface SalesStaff {
  name: string;
  staffId: string;
  target: number;
}
