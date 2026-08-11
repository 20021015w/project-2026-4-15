export const useCacheListItems = <T>(data: T[], itemHeight: number) => {
  const cache = new Map<number, { height: number; scrollTop: number }>();

  // 计算并缓存指定索引的元素
  const computeItem = (index: number) => {
    if (cache.has(index)) return cache.get(index)!;

    let height: number;
    let offset: number;

    if (index === 0) {
      height = itemHeight;
      offset = 0;
    } else {
      const prev = computeItem(index - 1);
      height = itemHeight;
      offset = prev.height + height;
    }

    cache.set(index, { height, scrollTop: offset });
    return { height, offset };
  };

  return {
    get cache() {
      return cache;
    },
    computeItem,
  };
};
