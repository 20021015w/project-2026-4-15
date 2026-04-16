
export interface OpenModalOptions {
  title?: string;
  content: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
}