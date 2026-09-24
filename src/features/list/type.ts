export interface ListBase {
  status: "PENDING" | "DONE" | "ARCHIVED";
  content: string;
  displayIndex: number;
  id: string;
  title: string;
  // 新增字段：任务创建时间
  createdAt: string;
  // 新增字段：任务完成时间
  updatedAt: string;
}
