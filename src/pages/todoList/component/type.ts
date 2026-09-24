// types.ts
export interface DragMeta<T = any> {
  item: T;
  sourceContainerKey: string;
}

export type OnContainerDrop<T> = (
  dragMeta: DragMeta<T>,
  targetContainerKey: string,
  insertBefore: boolean,
) => void;
