import { configureStore } from '@reduxjs/toolkit';

// 使用require.context动态导入features下的slice文件
const reducer: Record<string, any> = {};

// 创建一个context来获取所有的slice文件
const sliceContext = (require as any).context('../features', true, /Slice\.ts$/);
console.log(sliceContext,'ad')
// 遍历所有的slice文件
sliceContext.keys().forEach((key:string) => {
  const sliceModule = sliceContext(key);
  
  // 尝试获取slice对象（可能是命名导出）
  let sliceObject = null;
  let sliceReducer = null;
  
  // 检查模块中是否有命名导出的slice对象
  for (const exportName in sliceModule) {
    const exportValue = sliceModule[exportName];
    // 检查是否是slice对象（有name和reducer属性）
    if (exportValue && typeof exportValue === 'object' && exportValue.name && exportValue.reducer) {
      sliceObject = exportValue;
      sliceReducer = exportValue.reducer;
      break;
    }
  }
  
  // 如果没有找到slice对象，使用默认导出作为reducer
  if (!sliceReducer) {
    sliceReducer = sliceModule.default || sliceModule;
  }
  
  // 确定slice key
  let sliceKey: string;
  if (sliceObject && sliceObject.name) {
    // 使用slice对象的name属性作为key
    sliceKey = sliceObject.name;
  } else {
    // 作为后备，使用文件名作为key
    const pathParts = key.split('/');
    const fileName = pathParts[pathParts.length - 1];
    sliceKey = fileName.replace('Slice.ts', '');
  }
  
  if (sliceReducer) {
    reducer[sliceKey] = sliceReducer;
  }
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
