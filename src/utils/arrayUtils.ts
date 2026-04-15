// ArrayUtil.ts
 type SortableValue = string | number | Date | null | undefined;
 class ArrayUtils {
  /**
   * 数组转Map
   * @param arr 原数组
   * @param keyField 作为key的字段名
   * @param valueField 作为value的字段名（可选，不传则返回整个item）
   * @returns Map对象
   */
    static arrayToMap<T, K extends keyof T>(
    arr: T[],
    keyField?: K,
    valueField?: keyof T
  ): Map<any, any> {
    const map = new Map();
    
    arr.forEach((item, index) => {
      // 默认使用下标作为key
      const key = keyField ? item[keyField] : index;
      
      if (valueField) {
        map.set(key, item[valueField]);
      } else {
        map.set(key, item);
      }
    });
    
    return map;
  }

  /**
   * 数组转对象（普通对象形式）
   * @param arr 原数组
   * @param keyField 作为key的字段名
   * @param valueField 作为value的字段名（可选）
   * @returns 对象
   */
  static arrayToObject<T, K extends keyof T, V extends keyof T>(
    arr: T[],
    keyField: K,
    valueField?: V
  ): Record<string | number | symbol, V extends undefined ? T : T[V]> {
    const obj: Record<string | number | symbol, any> = {};
    
    arr.forEach(item => {
      const key = item[keyField] as string | number | symbol;
      if (valueField) {
        obj[key] = item[valueField];
      } else {
        obj[key] = item;
      }
    });
    
    return obj;
  }

  /**
   * 数组排序
   * @param arr 原数组
   * @param field 排序字段
   * @param order 排序方式 'asc' 升序 | 'desc' 降序
   * @param type 排序类型 'string' | 'number' | 'date'
   * @returns 新排序数组
   */
  static sortByField<T>(
    arr: T[],
    field: keyof T,
    order: 'asc' | 'desc' = 'asc',
    type: 'string' | 'number' | 'date' = 'string'
  ): T[] {
    const sortedArr = [...arr];
    
    return sortedArr.sort((a, b) => {
      let valueA = a[field] as SortableValue;
    let valueB = b[field] as SortableValue;
      
      // 处理空值
      if (valueA === undefined || valueA === null) return 1;
      if (valueB === undefined || valueB === null) return -1;
      
      // 根据类型排序
      switch (type) {
        case 'number':
          valueA = Number(valueA);
          valueB = Number(valueB);
          break;
        case 'date':
          valueA = new Date(valueA as any).getTime();
          valueB = new Date(valueB as any).getTime();
          break;
        case 'string':
        default:
          valueA = String(valueA).toLowerCase();
          valueB = String(valueB).toLowerCase();
          break;
      }
      
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * 多字段排序
   * @param arr 原数组
   * @param fields 排序字段配置数组
   * @returns 新排序数组
   */
  static sortByFields<T>(
    arr: T[],
    fields: Array<{
      field: keyof T;
      order?: 'asc' | 'desc';
      type?: 'string' | 'number' | 'date';
    }>
  ): T[] {
   
    const sortedArr = [...arr];
    
    return sortedArr.sort((a, b) => {
      for (const { field, order = 'asc', type = 'string' } of fields) {
       let valueA = a[field] as SortableValue;
    let valueB = b[field] as SortableValue;
        
        // 处理空值
        if (valueA === undefined || valueA === null) return 1;
        if (valueB === undefined || valueB === null) return -1;
        
        // 根据类型转换
        switch (type) {
          case 'number':
            valueA = Number(valueA);
            valueB = Number(valueB);
            break;
          case 'date':
            valueA = new Date(valueA as any).getTime();
            valueB = new Date(valueB as any).getTime();
            break;
          case 'string':
          default:
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
            break;
        }
        
        if (valueA < valueB) return order === 'asc' ? -1 : 1;
        if (valueA > valueB) return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * 数组转树形结构
   * @param arr 原数组
   * @param options 配置项
   * @returns 树形结构数组
   */
  static arrayToTree<T extends Record<string, any>>(
    arr: T[],
    options: {
      idField?: string;        // ID字段名，默认 'id'
      parentIdField?: string;  // 父ID字段名，默认 'parentId'
      childrenField?: string;  // 子节点字段名，默认 'children'
      rootId?: any;           // 根节点ID，默认 null 或 0
    } = {}
  ): T[] {
    const {
      idField = 'id',
      parentIdField = 'parentId',
      childrenField = 'children',
      rootId = null
    } = options;

    // 创建ID到节点的映射
    const nodeMap = new Map<any, T>();
    const tree: T[] = [];

    // 初始化所有节点
    arr.forEach(item => {
      nodeMap.set(item[idField], { ...item, [childrenField]: [] });
    });

    // 构建树
    arr.forEach(item => {
      const node = nodeMap.get(item[idField]);
      const parentId = item[parentIdField];
      
      if (parentId === rootId || parentId === undefined || parentId === null) {
        // 根节点
        //@ts-ignore
        tree.push(node);
      } else {
        // 子节点
        const parent = nodeMap.get(parentId);
        if (parent) {
          if (!parent[childrenField]) {
            //@ts-ignore
            parent[childrenField] = [];
          }
          parent[childrenField].push(node);
        }
      }
    });

    return tree;
  }

  /**
   * 数组转扁平化树（带层级）
   * @param arr 原数组
   * @param options 配置项
   * @returns 带层级的扁平数组
   */
  static arrayToFlatTree<T extends Record<string, any>>(
    arr: T[],
    options: {
      idField?: string;
      parentIdField?: string;
      rootId?: any;
      levelField?: string;    // 层级字段名，默认 'level'
    } = {}
  ): (T & { level: number })[] {
    const {
      idField = 'id',
      parentIdField = 'parentId',
      rootId = null,
      levelField = 'level'
    } = options;

    const result: (T & { level: number })[] = [];
    
    // 创建映射
    const itemMap = new Map<any, T & { level: number }>();
    arr.forEach(item => {
      itemMap.set(item[idField], { ...item, level: 0 });
    });

    // 递归设置层级
    const setLevel = (item: any, level: number) => {
      item[levelField] = level;
      result.push(item);
      
      const children = arr.filter(child => child[parentIdField] === item[idField]);
      children.forEach(child => {
        const childItem = itemMap.get(child[idField]);
        if (childItem) {
          setLevel(childItem, level + 1);
        }
      });
    };

    // 处理根节点
    arr
      .filter(item => item[parentIdField] === rootId)
      .forEach(item => {
        const rootItem = itemMap.get(item[idField]);
        if (rootItem) {
          setLevel(rootItem, 0);
        }
      });

    return result;
  }

  /**
   * 树形结构转数组（扁平化）
   * @param tree 树形数组
   * @param childrenField 子节点字段名
   * @returns 扁平数组
   */
  static treeToArray<T extends Record<string, any>>(
    tree: T[],
    childrenField: string = 'children'
  ): T[] {
    const result: T[] = [];
    
    const flatten = (nodes: T[]) => {
      nodes.forEach(node => {
        const { [childrenField]: children, ...rest } = node;
        result.push(rest as T);
        if (children && Array.isArray(children)) {
          flatten(children);
        }
      });
    };
    
    flatten(tree);
    return result;
  }
}

export default ArrayUtils;