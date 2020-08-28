import {findIndex, findRangeAttack, findRangeMove} from './createMatrix';
import attackFun from "./Attack";

const howToMove = (state, nearestUserChar, strongestChar) => {
  const posCompInMatr = findIndex(strongestChar.position, state.matrix, state.gamePlay.boardSize);
  const posUserInMatr = findIndex(nearestUserChar.position, state.matrix, state.gamePlay.boardSize);
  const attack = Math.floor(strongestChar.character.rangeAttack / 2);
  const move = Math.floor(strongestChar.character.rangeMove / 2);
  const distanceToUserH = posCompInMatr[1] - posUserInMatr[1];
  const distanceToUserV = posCompInMatr[0] - posUserInMatr[0];

  if (posCompInMatr[0] === posUserInMatr[0]) { // move to horizontal
    if (attack + move <= Math.abs(distanceToUserH - 1) && distanceToUserH > 0) {
      posCompInMatr[1] -= move;
    } else if (attack + move <= Math.abs(distanceToUserH - 1) && distanceToUserH < 0) {
      posCompInMatr[1] += move;
    } else if (attack + move > Math.abs(distanceToUserH - 1) && distanceToUserH > 0) {
      posCompInMatr[1] -= 1;
    } else if (attack + move > Math.abs(distanceToUserH - 1) && distanceToUserH < 0) {
      posCompInMatr[1] += 1;
    }
  } else if (posUserInMatr[1] === posCompInMatr[1]) { // move to vertical
    if (attack + move <= Math.abs(distanceToUserV - 1) && distanceToUserV > 0) {
      posCompInMatr[0] -= move;
    } else if (attack + move <= Math.abs(distanceToUserV - 1) && distanceToUserV < 0) {
      posCompInMatr[0] += move;
    } else if (attack + move > Math.abs(distanceToUserV - 1) && distanceToUserV > 0) {
      posCompInMatr[0] -= 1;
    } else if (attack + move > Math.abs(distanceToUserV - 1) && distanceToUserV < 0) {
      posCompInMatr[0] += 1;
    }
  } else { // move to diagonal
    const distanceToUser = Math.sqrt(Math.pow(distanceToUserV, 2) + Math.pow(distanceToUserH, 2));
    const maxDistance = Math.sqrt(Math.pow(move, 2) + Math.pow(move, 2));

    if (posCompInMatr[0] > posUserInMatr[0] && posCompInMatr[1] > posUserInMatr[1]) {
      if (distanceToUser > maxDistance) {
        posCompInMatr[0] -= move;
        posCompInMatr[1] -= move;
      } else {
        posCompInMatr[0] -= Math.floor(distanceToUser);
        posCompInMatr[1] -= Math.floor(distanceToUser);
      }
    } else if (posCompInMatr[0] < posUserInMatr[0] && posCompInMatr[1] > posUserInMatr[1]) {
      if (distanceToUser > maxDistance) {
        posCompInMatr[0] += move;
        posCompInMatr[1] -= move;
      } else {
        posCompInMatr[0] += Math.floor(distanceToUser);
        posCompInMatr[1] -= Math.floor(distanceToUser);
      }
    } else if (posCompInMatr[0] > posUserInMatr[0] && posCompInMatr[1] < posUserInMatr[1]) {
      if (distanceToUser > maxDistance) {
        posCompInMatr[0] -= move;
        posCompInMatr[1] += move;
      } else {
        posCompInMatr[0] -= Math.floor(distanceToUser);
        posCompInMatr[1] += Math.floor(distanceToUser);
      }
    } else if (posCompInMatr[0] < posUserInMatr[0] && posCompInMatr[1] < posUserInMatr[1]) {
      if (distanceToUser > maxDistance) {
        posCompInMatr[0] += move;
        posCompInMatr[1] += move;
      } else {
        posCompInMatr[0] += Math.floor(distanceToUser);
        posCompInMatr[1] += Math.floor(distanceToUser);
      }
    }

    if (posCompInMatr[0] < 0 || posCompInMatr[0] >= state.gamePlay.boardSize
      || posCompInMatr[1] < 0 || posCompInMatr[1] >= state.gamePlay.boardSize) {
      const index = findIndex(strongestChar.position, state.matrix, state.gamePlay.boardSize);
      const range = findRangeMove(index[0], index[1], state.matrix, strongestChar.character.rangeMove);
      const arrRange = Array.from(range);
      const randomIndex = Math.floor(Math.random() * range.size);
      strongestChar.position = arrRange[randomIndex];
      state.gamePlay.redrawPositions([...state.arrTeam()]);
      return;
    }
  }
  strongestChar.position = state.matrix[posCompInMatr[0]][posCompInMatr[1]];
  state.gamePlay.redrawPositions([...state.arrTeam()]);
};

const findNearestUserChar = (state, strongest) => {
  let minDistance = 100;
  let indexChar = 0;
  const posCompInMatr = findIndex(strongest.position, state.matrix, state.gamePlay.boardSize);
  state.UserTeam.team.forEach((elem, index) => {
    const posUserInMatr = findIndex(elem.position, state.matrix, state.gamePlay.boardSize);
    const width = posCompInMatr[0] - posUserInMatr[0];
    const length = posCompInMatr[1] - posUserInMatr[1];
    const distance = Math.sqrt(Math.pow(width, 2) + Math.pow(length, 2));
    if (distance < minDistance) {
      minDistance = distance;
      indexChar = index;
    }
  });
  return state.UserTeam.team[indexChar];
};

const stromgestChar = (state) => {
  let maxLevel = 0;
  let indElem = 0;
  state.CompTeam.team.forEach((elem, index) => {
    if (elem.character.level > maxLevel) {
      maxLevel = elem.character.level;
      indElem = index;
    }
  });
  return state.CompTeam.team[indElem];
};

const moveComp = (state) => {
  const strongestChar = stromgestChar(state);
  const nearestUserChar = findNearestUserChar(state, strongestChar);
  howToMove(state, nearestUserChar, strongestChar);
};

const searchCharacterForAttack = async (state) => {
  for (let i = 0; i < state.CompTeam.team.length; i++) {
    const char = state.CompTeam.team[i];
    const charPositionInMatrix = findIndex(char.position, state.matrix, state.gamePlay.boardSize);
    const rangeAttack = findRangeAttack(charPositionInMatrix[0], charPositionInMatrix[1], state.matrix, char.character.rangeAttack);
    const amountUser = state.UserTeam.team.length;
    for (let j = 0; j < amountUser; j++) {
      const user = state.UserTeam.team[j];
      if (rangeAttack.has(user.position)) {
        await attackFun(char, user, state);
        state.isMove = 'user';
        return new Promise((response) => {
          response('attack');
        });
      }
    }
  }
  return new Promise((response) => {
    response('move');
  });
};

export const compAction = async (state) => {
  const action = await searchCharacterForAttack(state);
  if (action === 'move') {
    moveComp(state);
  }
};
