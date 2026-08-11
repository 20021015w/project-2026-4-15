// 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */
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

function rightSideView(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (!root) return res;

  // 队列存储树节点
  const queue: TreeNode[] = [root];

  while (queue.length) {
    // 当前层节点数量
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      // 弹出队首节点
      const node = queue.shift()!;
      // 当前层最后一个节点，加入结果
      if (i === levelSize - 1) {
        res.push(node.val);
      }
      // 左子树先入队，再右子树
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
}
