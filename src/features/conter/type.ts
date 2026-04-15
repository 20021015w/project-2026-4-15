
export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}