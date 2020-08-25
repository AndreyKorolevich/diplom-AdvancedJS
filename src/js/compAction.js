import {findIndex, findRangeAttack, findRangeMove} from './createMatrix';
import attack from "./attack";

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
    for (let j = 0; j < state.UserTeam.team.length; j++) {
      const user = state.UserTeam.team[j];
      if (rangeAttack.has(user.position)) {
        await attack(char, user, state)
        state.isMove = 'user';
        return new Promise((res, rej) => {
          res('attack');
        })
      }
    }
  }
  return new Promise((res, rej) => {
    res('move');
  })
};

export const compAction = async (state) => {
  // 1) Определить есть ли персонаж юзера в обасти для атаки либого из персонажей
  // 1.1) если есть то атаковать. Передать ход юзеру.
  // 2) Если нету выбрать сильнейшого героя по леволу
  // 3) сделать ход на встречу ближайшему герою юзера
  // 3.1) Определить расстояние до всех героев, и ыбрать ближайшего
  // 3.2) У ближайшего определить на одной ли линии по вериткали или горизонтали
  // находится
  // 3.2.1) если да двигаться по прямой на минимальное достаточное для атаки расстояние
  // 3.2.2) если нет то двигаться по диоганали пока не выйдет на одну линию

  const action = await searchCharacterForAttack(state);
  if (action === 'move') {
    moveComp(state);
  }
};
