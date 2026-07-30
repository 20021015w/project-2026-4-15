---
title: NormalTable
order: 5
---

# NormalTable 表格

基于 [ali-react-table](https://github.com/alibaba/ali-react-table) 的 `BaseTable` 二次封装，提供默认主键、加载态、空数据展示等通用配置，同时保留原生 API 的完整透传能力。

## 基本用法

```jsx
import { NormalTable } from './index';

const dataSource = [
  { id: '1', name: '张三', age: 28, address: '北京市海淀区' },
  { id: '2', name: '李四', age: 32, address: '上海市浦东新区' },
  { id: '3', name: '王五', age: 25, address: '广州市天河区' },
];

const columns = [
  { code: 'name', name: 'name', title: '姓名', width: 120 },
  { code: 'age', name: 'age', title: '年龄', width: 100, align: 'right' },
  { code: 'address', name: 'address', title: '地址' },
];

export default () => (
  <NormalTable dataSource={dataSource} columns={columns} />
);
```

## 加载中与空数据

内置了加载图标与空数据展示，可直接通过 `isLoading` 控制；当 `dataSource` 为空数组时，会自动展示「暂无数据」。

```jsx
import { NormalTable } from './index';

const columns = [
  { code: 'name', name: 'name', title: '姓名', width: 120 },
  { code: 'age', name: 'age', title: '年龄', width: 100 },
];

export default () => (
  <div>
    <h4>加载中</h4>
    <NormalTable isLoading dataSource={[]} columns={columns} />

    <h4>空数据</h4>
    <NormalTable dataSource={[]} columns={columns} />
  </div>
);
```

## 自定义渲染

通过列配置的 `render` 方法自定义单元格内容。

```tsx
import { NormalTable } from './index';

const dataSource = [
  { id: '1', name: '张三', age: 28, status: 'active' },
  { id: '2', name: '李四', age: 32, status: 'disabled' },
];

const columns = [
  { code: 'name', name: 'name', title: '姓名', width: 120 },
  { code: 'age', name: 'age', title: '年龄', width: 100, align: 'right' },
  {
    code: 'status',
    name: 'status',
    title: '状态',
    width: 120,
    render: (value) => {
      const map = { active: '启用', disabled: '禁用' };
      const color = value === 'active' ? '#52c41a' : '#999';
      return <span style={{ color }}>{map[value] ?? value}</span>;
    },
  },
];

export default () => (
  <NormalTable dataSource={dataSource} columns={columns} />
);
```

## 行选择 - 单选

通过 `selection` 配置开启选择列。`type='single'` 为单选（默认），支持受控（`value` + `onChange`）与非受控（`defaultValue`）两种用法。

```jsx
import { NormalTable } from './index';
import { useState } from 'react';

const dataSource = [
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 32 },
  { id: '3', name: '王五', age: 25 },
];

const columns = [
  { code: 'name', name: 'name', title: '姓名', width: 120 },
  { code: 'age', name: 'age', title: '年龄', width: 100, align: 'right' },
];

export default () => {
  const [selected, setSelected] = useState('1');
  return (
    <div>
      <div style={{ marginBottom: 8 }}>当前选中: {selected}</div>
      <NormalTable
        dataSource={dataSource}
        columns={columns}
        selection={{
          type: 'single',
          value: selected,
          onChange: setSelected,
          highlightRowWhenSelected: true,
        }}
      />
    </div>
  );
};
```

## 行选择 - 多选

`type='multiple'` 为多选，`onChange` 回调签名为 `(next, key, keys, action)`。

```jsx
import { NormalTable } from './index';
import { useState } from 'react';

const dataSource = [
  { id: '1', name: '张三', age: 28 },
  { id: '2', name: '李四', age: 32 },
  { id: '3', name: '王五', age: 25 },
];

const columns = [
  { code: 'name', name: 'name', title: '姓名', width: 120 },
  { code: 'age', name: 'age', title: '年龄', width: 100, align: 'right' },
];

export default () => {
  const [selected, setSelected] = useState([]);
  return (
    <div>
      <div style={{ marginBottom: 8 }}>已选 {selected.length} 项: {selected.join(', ')}</div>
      <NormalTable
        dataSource={dataSource}
        columns={columns}
        selection={{
          type: 'multiple',
          value: selected,
          onChange: (next) => setSelected(next),
          highlightRowWhenSelected: true,
        }}
      />
    </div>
  );
};
```

## 自定义空数据 / 加载组件

通过 `components.EmptyContent` 与 `components.LoadingIcon` 可覆盖默认实现。

```jsx
import { NormalTable } from './index';

const columns = [
  { code: 'name', name: 'name', title: '姓名', width: 120 },
];

export default () => (
  <NormalTable
    dataSource={[]}
    columns={columns}
    components={{
      EmptyContent: () => (
        <div style={{ padding: 24, color: '#ff4d4f', textAlign: 'center' }}>
          🚫 暂无记录
        </div>
      ),
    }}
  />
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataSource | 表格展示的数据源 | `any[]` | `[]` |
| columns | 表格的列配置 | `ArtColumn[]` | - |
| primaryKey | 主键 | `string \| ((row: any) => string)` | `'id'` |
| defaultColumnWidth | 列的默认宽度 | `number` | `120` |
| isStickyHeader | 表格头部是否置顶 | `boolean` | `true` |
| hasStickyScroll | 是否具有横向的粘性滚动条 | `boolean` | `true` |
| isLoading | 表格是否在加载中 | `boolean` | - |
| className | 自定义类名（会与内置 `wsl-normal-table` 合并） | `string` | - |
| style | 自定义内联样式 | `CSSProperties` | `{ width: '100%' }` |
| components | 覆盖表格内部用到的组件 | `object` | 内置 `EmptyContent` / `LoadingIcon` |
| selection | 行选择配置，传入即开启选择列 | `INormalTableSelection` | - |
| ...rest | 其他 `BaseTableProps` 属性均原样透传 | [`BaseTableProps`][base-table-props] | - |

### INormalTableSelection

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 选择类型 | `'single' \| 'multiple'` | `'single'` |
| value | 受控选中值 | `string \| string[]` | - |
| defaultValue | 非受控默认值 | `string \| string[]` | - |
| onChange | 选中变化回调 | 单选: `(next: string) => void`<br/>多选: `(next: string[], key: string, keys: string[], action) => void` | - |
| highlightRowWhenSelected | 选中时高亮该行 | `boolean` | - |
| isDisabled | 判断行是否禁用 | `(row, rowIndex) => boolean` | - |
| clickArea | 点击响应区域 | `'radio' \| 'checkbox' \| 'cell' \| 'row'` | 单选 `'radio'` / 多选 `'checkbox'` |
| placement | 选择框列位置 | `'start' \| 'end'` | `'start'` |
| stopClickEventPropagation | 是否阻止点击事件冒泡 | `boolean` | - |

> `BaseTableProps` 完整定义见 [ali-react-table 文档][base-table-props]。

[base-table-props]: https://ali-react-table.js.org/components/base-table
