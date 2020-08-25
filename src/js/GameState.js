import createMatrix, { findIndex, findRangeAttack, findRangeMove } from './createMatrix';

export default class GameState {
  constructor(gamePlay, UserTeam, CompTeam) {
    this.gamePlay = gamePlay;
    this.isMove = 'user';
    this.block = false;
    this.level = 1;
    this.UserTeam = UserTeam;
    this.CompTeam = CompTeam;
    this.currentIndex = null;
    this.currentMove = null;
    this.currentAttack = null;
    this.currentCharacter = null;

    this.matrix = createMatrix(this.gamePlay.boardSize);
  }

  arrPositions() {
    return [...this.UserTeam.team, ...this.CompTeam.team].map((elem) => elem.position);
  }

  arrTeam() {
    return [...this.UserTeam.team, ...this.CompTeam.team];
  }

  arrCompPosition() {
    return [...this.CompTeam.team].map((elem) => elem.position);
  }

  arrUserPosition() {
    return [...this.UserTeam.team].map((elem) => elem.position);
  }

  currentIndexPosition() {
    if (this.currentIndex === null) {
      return [];
    }
    return findIndex(this.currentIndex, this.matrix, this.gamePlay.boardSize);
  }

  currentRange() {
    const currentIndexPosition = this.currentIndexPosition();
    return findRangeAttack(currentIndexPosition[0], currentIndexPosition[1], this.matrix, this.currentAttack);
  }

  currentRangeMove() {
    const currentIndexPosition = this.currentIndexPosition();
    return findRangeMove(currentIndexPosition[0], currentIndexPosition[1], this.matrix, this.currentMove);
  }

  reset() {
    this.currentIndex = null;
    this.currentAttack = null;
    this.currentCharacter = null;
    this.currentMove = null;
  }
}
