export interface ListBase {
  status: "PENDING" | "DONE" | "ARCHIVED";
  content: string;
  displayIndex: number;
  id: string;
  title: string;
}
