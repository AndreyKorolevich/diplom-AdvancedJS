import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './Character';
import Team from './Team';
import GamePlay from './GamePlay';
import cursors from './cursors';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    // this.matrix = createMatrix(this.gamePlay.boardSize);
    this.UserTeam = new Team([]);
    this.CompTeam = new Team([]);
    this.gameState = new GameState(this.gamePlay, this.UserTeam, this.CompTeam);
    // this.level = 1;
    // this.currentMove = 'user';
    // this.UserTeam = new Team([]);
    // this.CompTeam = new Team([]);
    // this.currentIndex = null;
    // this.currentRangeAttack = null;
    // this.currentCharacter = null;
    // this.arrPostions = [];
    // this.currentRange = [];
    // this.currentRangeMove = new Set();
    // this.currentIndexPosition = null;

    this.onCellClick = this.onCellClick.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
  }

  init() {
    this.events();
    this.gamePlay.drawUi(themes.item(this.gameState.level));
    this.displayCharacter();

    // TODO: load saved stated from stateService
    // если загрузить нечего, то сохроняем стартовый стейт чтобы не терять его при перезагрузке страницы
  }

  events() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  createPosition(boardSize, range) {
    const arr = [];
    range.forEach((elem) => {
      for (let i = elem; i < boardSize ** 2; i += boardSize) {
        arr.push(i);
      }
    });
    return arr;
  }

  displayCharacter() {
    let userTeam = [];
    let compTeam = [];
    const compPositionArr = this.createPosition(this.gamePlay.boardSize, [6, 7]);
    const userPositionArr = this.createPosition(this.gamePlay.boardSize, [0, 1]);
    switch (this.gameState.level) {
      case 1:
        userTeam = generateTeam([Bowman, Swordsman], 1, 2);
        compTeam = generateTeam([Vampire, Undead, Daemon], 1, 2);
        break;
      case 2:
        userTeam = generateTeam([Bowman, Swordsman, Magician], 1, 1);
        compTeam = generateTeam([Vampire, Undead, Daemon], 2,
          (userTeam.length + this.UserTeam.team.length));
        break;
      case 3:
        userTeam = generateTeam([Bowman, Swordsman, Magician], 2, 2);
        compTeam = generateTeam([Vampire, Undead, Daemon], 3,
          (userTeam.length + this.UserTeam.team.length));
        break;
      case 4:
        userTeam = generateTeam([Bowman, Swordsman, Magician], 3, 2);
        compTeam = generateTeam([Vampire, Undead, Daemon], 4,
          (userTeam.length + this.UserTeam.team.length));
        break;
    }
    const userTeamPosition = userTeam.map((elem) => {
      const userPosition = userPositionArr[Math.floor(Math.random() * userPositionArr.length)];
      return new PositionedCharacter(elem, userPosition);
    });

    const compTeamPosition = compTeam.map((elem) => {
      const userPosition = compPositionArr[Math.floor(Math.random() * compPositionArr.length)];
      return new PositionedCharacter(elem, userPosition);
    });

    this.gameState.UserTeam.addCharacters(userTeamPosition);
    this.gameState.CompTeam.addCharacters(compTeamPosition);
    // this.gameState.arrPostions = [...this.gameState.UserTeam.team, ...this.gameState.CompTeam.team].map((elem) => elem.position);
    // this.gameState.arrCompPosition = [...this.gameState.CompTeam.team].map((elem) => elem.position);
    this.gamePlay.drawUi(themes.item(this.gameState.level));
    this.gamePlay.redrawPositions([...this.gameState.arrTeam()]);
  }

  onCellClick(index) {
    for (const item of [...this.gameState.UserTeam.team]) { // choose character and add yellow circle
      if (item.position === index && index !== this.gameState.currentIndex) {
        if (this.gameState.currentIndex !== null) {
          this.gamePlay.deselectCell(this.gameState.currentIndex);
        }
        this.gamePlay.selectCell(index);
        this.gameState.currentIndex = index;
        this.gameState.currentCharacter = item;
        this.gameState.currentRangeAttack = item.character.rangeAttack;
        this.gameState.currentMove = item.character.rangeMove;
        return;
      }
      if (item.position === index && index === this.gameState.currentIndex) {
        this.gamePlay.deselectCell(index);
        this.gameState.reset();
        // this.gameState.currentIndex = null;
        // this.gameState.currentRangeAttack = null;
        // this.gameState.currentMove = null;
        // this.gameState.currentCharacter = null;
        // this.gameState.currentRangeMove.clear();
      }
    }

    if (this.gameState.currentRangeMove().has(index)) { // move user character
      this.gamePlay.deselectCell(this.gameState.currentIndex);
      this.gamePlay.deselectCell(index);
      this.gameState.currentCharacter.position = index;
      this.gameState.reset();
      this.gameState.isMove = 'comp';
      // this.gameState.currentIndex = null;
      // this.gameState.currentIndexPosition = null;
      // this.gameState.currentRangeAttack = null;
      // this.gameState.currentCharacter = null;
      // this.gameState.currentRange = [];
      // this.gameState.arrPostions = [...this.gameState.UserTeam.team, ...this.gameState.CompTeam.team].map((elem) => elem.position);
      // this.gameState.currentRangeMove.clear();
      this.gamePlay.redrawPositions(this.gameState.arrTeam());
    }

    for (const item of [...this.gameState.CompTeam.team]) { // show error
      if (this.gameState.currentIndex !== null && this.gameState.currentRange().indexOf(index) === -1
        && this.gameState.arrCompPosition().indexOf(index) !== -1) {
        this.gamePlay.setCursor(cursors.notallowed);
        GamePlay.showError('This isn`t allowed action');
      } else if (item.position === index) {
        GamePlay.showError('This isn`t your character');
        return;
      }
    }
  }

  onCellEnter(index) {
    for (const item of this.gameState.arrTeam()) {
      if (item.position === index) {
        const message = `🎖${item.character.level}⚔${item.character.attack}🛡${item.character.defence}❤${item.character.health}`;
        this.gamePlay.showCellTooltip(message, index);
      }
    }

    for (const item of this.gameState.arrUserPosition()) {
      if (item.position === index) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }

    if (this.gameState.currentIndex !== null) {
      // find index current character in matrix
      // this.gameState.currentIndexPosition = findIndex(this.gameState.currentIndex, this.matrix, this.gamePlay.boardSize);

      // this.gameState.currentRange = findRange(this.gameState.currentIndexPosition[0], this.gameState.currentIndexPosition[1],
      //   this.matrix, this.gameState.currentRangeAttack); // find range for attack current character
      // this.gameState.currentRangeMove = findRangeMove(this.gameState.currentIndexPosition[0], this.gameState.currentIndexPosition[1],
      //   this.matrix, this.gameState.currentMove); // find range for move current character

      // show place that character can attack
      if (this.gameState.currentRange().indexOf(index) !== -1 && this.gameState.arrPositions().indexOf(index) === -1) {
        this.gamePlay.selectCell(index, 'green');
      }

      // show place that character can move
      if (this.gameState.currentRangeMove().has(index) && this.gameState.arrPositions().indexOf(index) === -1) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }

    // add red circle and cursor crosshair on enemy if he`s in current range user character or add crosshair notallowed
    // if he`s not in current range.
    if (this.gameState.currentIndex !== null && this.gameState.currentRange().indexOf(index) === -1
      && this.gameState.arrCompPosition().indexOf(index) !== -1) {
      this.gamePlay.setCursor(cursors.notallowed);
    } else if (this.gameState.currentIndex !== null && this.gameState.arrCompPosition().indexOf(index) !== -1) {
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.setCursor(cursors.crosshair);
    }
  }

  onCellLeave(index) {
    for (const item of this.gameState.arrUserPosition()) {
      if (item.position === index) {
        this.gamePlay.setCursor(cursors.auto);
      }
    }

    for (const item of this.gameState.arrCompPosition()) {
      if (item.position === index) {
        this.gamePlay.setCursor(cursors.auto);
      }
    }

    if ((this.gameState.currentRange().indexOf(index) !== -1 && this.gameState.arrPositions().indexOf(index) === -1)
      || (this.gameState.currentRange().indexOf(index) !== -1 && this.gameState.arrCompPosition().indexOf(index) !== -1)) {
      this.gamePlay.setCursor(cursors.auto);
      this.gamePlay.deselectCell(index);
    }

    if (this.gameState.currentRangeMove() !== null && this.gameState.currentRangeMove().has(index)
      && this.gameState.arrPositions().indexOf(index) === -1) {
      this.gamePlay.setCursor(cursors.auto);
    }
  }
}
