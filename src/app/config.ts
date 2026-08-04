export const EStoreSliceKey = {
  TODO : 'todo',
  USERINFO :'userInfo',
  LIST:'list',
  COUNTER : 'counter'
} as const

export type EStoreSliceKey = typeof EStoreSliceKey[keyof typeof EStoreSliceKey];