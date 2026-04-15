import { Tree, type TreeNode } from '@ui/components';
import { FC } from "react";
export const HasDone:FC = () => {
  const farkData:TreeNode[] =  [
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
  return <Tree data={farkData}></Tree>
}