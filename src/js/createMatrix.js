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

export const findRange = (row, col, matrix, range) => {
  const arrRange = [];
  const rowStart = row - Math.floor(range / 2) >= 0 ? row - Math.floor(range / 2) : 0;
  const colStart = col > 0 ? col - Math.floor(range / 2) : 0;

  for (let i = 0; i < range; i++) {
    if ((rowStart + i) < matrix.length && i <= (row + Math.floor(range / 2))) {
      for (let j = colStart; j <= col + Math.floor(range / 2); j++) {
        arrRange.push(matrix[rowStart + i][j]);
      }
    }
  }
  return arrRange;
};

export default createMatrix;
