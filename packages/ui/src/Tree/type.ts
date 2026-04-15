export interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  isLeaf?: boolean;
}

export interface TreeListProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  defaultExpandAll?: boolean;
}