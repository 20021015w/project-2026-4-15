export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

export function frontTree(root: TreeNode | null): number[] {
  const res: number[] = [];
  // 递归函数参数要允许 null
  const go = (node: TreeNode | null) => {
    if (!node) return; // 空节点直接退出
    res.push(node.val); // 先访问根
    go(node.left); // 再左子树
    go(node.right); // 最后右子树
  };
  go(root);
  return res;
}
