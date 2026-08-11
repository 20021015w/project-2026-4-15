// 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
// 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
function exist(board: string[][], word: string): boolean {
  const rows = board.length; // 行数（y 方向）
  const cols = board[0].length; // 列数（x 方向）

  const dfs = (row: number, col: number, index: number): boolean => {
    // 1. 成功条件：已经匹配完所有字符
    if (index === word.length) return true;

    // 2. 边界检查：必须在网格内
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return false;
    }

    // 3. 字符匹配检查 + 已访问检查
    if (board[row][col] !== word[index]) {
      return false;
    }

    // 4. 标记当前单元格为已访问
    const temp = board[row][col];
    board[row][col] = "#";

    // 5. 四个方向探索
    const directions = [
      [-1, 0], // 上
      [1, 0], // 下
      [0, -1], // 左
      [0, 1], // 右
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (dfs(newRow, newCol, index + 1)) {
        return true;
      }
    }

    // 6. 回溯：恢复原值
    board[row][col] = temp;

    return false;
  };

  // 从每个格子出发尝试匹配
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col] === word[0] && dfs(row, col, 0)) {
        return true;
      }
    }
  }

  return false;
}
