export interface ExcelRequest<T> {
  title: string;
  data: T[];
  headers: string[];
  deptMemo?: string;
  coreTotal?: string;
  totalWtScore?: number;
  totalCoreWtSum?: number;
  possibleWtScore?: number;
  possibleCoreWtScore?: number;
  kpiTotal?: string;
  percentageTotal?: string;
  startDate?: string;
  endDate?: string;
}
