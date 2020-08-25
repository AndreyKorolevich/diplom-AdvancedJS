const createMatrix = (size) => {
  const matrixBoard = [];
  let count = 0;
  for (let i = 0; i < size; i++) {
    matrixBoard.push([]);
    for (let j = 0; j < size; j++) {
      matrixBoard[i].push(count);
      count++;
    }
  }
  return matrixBoard;
};

export const findIndex = (elem, matrix, size) => {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j] === elem) {
        return ([i, j]);
      }
    }
  }
};

export const findRangeAttack = (row, col, matrix, range) => { // find range for attack
  const arrRange = new Set();
  const rowStart = row - Math.floor(range / 2) >= 0 ? row - Math.floor(range / 2) : 0;
  const colStart = col > 0 ? col - Math.floor(range / 2) : 0;

  for (let i = 0; i < range; i++) {
    if ((rowStart + i) < matrix.length && i <= (row + Math.floor(range / 2))) {
      for (let j = colStart; j <= col + Math.floor(range / 2); j++) {
        arrRange.add(matrix[rowStart + i][j]);
      }
    }
  }
  return arrRange;
};

export const findRangeMove = (row, col, matrix, range) => { // find range for move
  const arrRangeMove = new Set();
  const startVertical = row - Math.floor(range / 2) >= 0 ? row - Math.floor(range / 2) : 0;
  const startHorizontal = col - Math.floor(range / 2) >= 0 ? col - Math.floor(range / 2) : 0;
  const startRightColDiagonal = col - Math.floor(range / 2);
  const startRightRowDiagonal = row - Math.floor(range / 2);
  const startLeftColDiagonal = col - Math.floor(range / 2);
  const startLeftRowDiagonal = row + Math.floor(range / 2);

  for (let i = 0; i < range; i++) {
    if ((startVertical + i) < matrix.length && i <= (row + Math.floor(range / 2))) {
      arrRangeMove.add(matrix[startVertical + i][col]);
    }
    if ((startHorizontal + i) < matrix.length && i <= (col + Math.floor(range / 2))) {
      arrRangeMove.add(matrix[row][startHorizontal + i]);
    }

    if (startLeftRowDiagonal - i >= 0 && startLeftColDiagonal + i >= 0 && startLeftColDiagonal + i < matrix.length
      && startLeftRowDiagonal - i < matrix.length) {
      arrRangeMove.add(matrix[startLeftRowDiagonal - i][startLeftColDiagonal + i]);
    }
    if (startRightRowDiagonal + i >= 0 && startRightColDiagonal + i >= 0 && startRightRowDiagonal + i < matrix.length
      && startRightColDiagonal + i < matrix.length) {
      arrRangeMove.add(matrix[startRightRowDiagonal + i][startRightColDiagonal + i]);
    }
  }
  return arrRangeMove;
};

export default createMatrix;
