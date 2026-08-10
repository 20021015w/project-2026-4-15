import { TreeNode } from "./199";

function diameterOfBinaryTree(root: TreeNode | null): number {
    let maxDiameter = 0;

    // 返回当前节点的最大深度
    const getDepth = (node: TreeNode | null): number => {
        if (node === null) return 0;
        // 左右子树深度
        const leftDepth = getDepth(node.left);
        const rightDepth = getDepth(node.right);
        // 更新全局最大直径：经过当前节点的路径长度=左+右
        maxDiameter = Math.max(maxDiameter, leftDepth + rightDepth);
        // 当前节点深度 = 子树最大深度 + 自身这一层
        return Math.max(leftDepth, rightDepth) + 1;
    };

    getDepth(root);
    return maxDiameter;
}