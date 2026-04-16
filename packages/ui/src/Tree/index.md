---
title: Tree
order: 2
---

# Tree组件

树形结构组件，支持搜索，拖曳，自定义树层内容结构

## 基本用法

```jsx
import { Tree } from './index';
// 最简单的树数据
const treeData = [
  {
    key: '1',
    title: '根节点 1',
    children: [
      { key: '1-1', title: '子节点 1-1', isLeaf: true },
      { key: '1-2', title: '子节点 1-2', isLeaf: true },
      { 
        key: '1-3', 
        title: '子节点 1-3',
        children: [
          { key: '1-3-1', title: '孙节点 1-3-1', isLeaf: true },
          { key: '1-3-2', title: '孙节点 1-3-2', isLeaf: true },
        ]
      }
    ]
  },
  {
    key: '2',
    title: '根节点 2',
    children: [
      { key: '2-1', title: '子节点 2-1', isLeaf: true }
    ]
  },
];
export default () => (
  <Tree data={treeData} defaultExpandAll={true} onSelect={(node) => {
    console.log("当前选中数据:", node)}}/>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| onSelect | 选中事件 | `() => void` | - |
| data | 树数据 | `TreeNode[]` | - |