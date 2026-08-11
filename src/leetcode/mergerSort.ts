class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeSort(head: ListNode | null): ListNode | null {
  // 基本情况：空链表或只有一个节点
  if (head === null || head.next === null) {
    return head;
  }

  // 使用快慢指针找到中间节点
  let slow: ListNode | null = head;
  let fast: ListNode | null = head.next;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  // 将链表从中间断开
  const mid: ListNode | null = slow!.next;
  slow!.next = null;

  // 递归排序左右两半
  const left = mergeSort(head);
  const right = mergeSort(mid);

  // 合并已排序的两半
  return mergeTwoLists(left, right);
}

function mergeTwoLists(
  L1: ListNode | null,
  L2: ListNode | null,
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (L1 !== null && L2 !== null) {
    if (L1.val <= L2.val) {
      current.next = L1;
      L1 = L1.next;
    } else {
      current.next = L2;
      L2 = L2.next;
    }
    current = current.next;
  }

  current.next = L1 !== null ? L1 : L2;
  return dummy.next;
}

// 辅助函数：创建测试链表
function createLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy = new ListNode(0);
  let current = dummy;
  for (const val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}

// 辅助函数：打印链表
function printLinkedList(head: ListNode | null): void {
  const result: number[] = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  console.log(result.join(" -> "));
}

// 测试
const head = createLinkedList([
  4, 9, 3, 2, 3, 4, 5, 6, 3, 4, 2, 3, 2345, 345, 2, 34, 2312, 34, 3, 2, 1, 10,
]);
console.dir(head, { depth: null });

const sorted = mergeSort(head);
console.dir(sorted, { depth: null });
