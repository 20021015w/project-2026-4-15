export interface MaskProps {
  children: React.ReactNode;
  className?: string;
  customChangeOpacity?: boolean;
}
export interface MaskRef {
  setOpacity: (opacity: number) => void;
}
