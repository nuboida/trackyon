export interface ExcelRequest<T> {
  title: string;
  data: T[];
  headers: string[];
  deptMemo?: string;
  coreTotal?: string;
  kpiTotal?: string;
  percentageTotal?: string;
  startDate?: string;
  endDate?: string;
}
