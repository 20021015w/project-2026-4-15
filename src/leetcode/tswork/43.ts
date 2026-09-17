// 实现二叉树有序遍历的类型版本。
// 例如：
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null,
    },
    right: null,
  },
} as const
type AT = InorderTraversal<typeof tree1> // [1, 3, 2]
// 中序遍历：左 -> val -> 右
type TreeNode = {
  val: number,
  left: TreeNode | null,
  right: TreeNode | null
}
type InorderTraversal<T extends TreeNode | null> =
  T extends null
  ? [] // 叶子子节点为null，返回空数组
  : [
    ...InorderTraversal<T["left"] & (TreeNode | null)>,   // 递归左子树
    T["val"],                          // 当前节点值
    ...InorderTraversal<T["right"]>    // 递归右子树
  ]