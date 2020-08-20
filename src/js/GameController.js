import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import {generateTeam} from './generators';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './Character';
import Team from './Team';
import GamePlay from './GamePlay';
import cursors from './cursors';
import createMatrix, {findIndex, findRange} from './createMatrix';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.level = 1;
    this.UserTeam = new Team([]);
    this.CompTeam = new Team([]);
    this.currentIndex = null;
    this.currentRangeAttack = null;
    this.arrPostions = [];
    this.currentRange = [];
    this.matrix = createMatrix(this.gamePlay.boardSize);
    this.currentIndexPosition = null;

    this.onCellClick = this.onCellClick.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
  }

  init() {
    this.events();
    this.gamePlay.drawUi(themes.item(this.level));
    this.displayCharacter();

    // TODO: load saved stated from stateService
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
    switch (this.level) {
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

    this.UserTeam.addCharacters(userTeamPosition);
    this.CompTeam.addCharacters(compTeamPosition);
    this.gamePlay.drawUi(themes.item(this.level));
    this.gamePlay.redrawPositions([...this.UserTeam.team, ...this.CompTeam.team]);
  }

  onCellClick(index) {
    for (const item of [...this.UserTeam.team]) {
      if (item.position === index && index !== this.currentIndex) {
        if (this.currentIndex !== null) {
          this.gamePlay.deselectCell(this.currentIndex);
        }
        this.gamePlay.selectCell(index);
        this.currentIndex = index;
        this.currentRangeAttack = item.character.rangeAttack;
        return;
      }
      if (item.position === index && index === this.currentIndex) {
        this.gamePlay.deselectCell(index);
        this.currentIndex = null;
        this.currentRangeAttack = null;
      }
    }

    for (const item of [...this.CompTeam.team]) {
      if (item.position === index) {
        GamePlay.showError('This isn`t your character');
        return;
      }
    }
  }

  onCellEnter(index) {
    this.arrPostions = [...this.UserTeam.team, ...this.CompTeam.team].map((elem) => elem.position);
    const arrCompPosition = [...this.CompTeam.team].map((elem) => elem.position);
    for (const item of [...this.UserTeam.team, ...this.CompTeam.team]) {
      if (item.position === index) {
        const message = `🎖${item.character.level}⚔${item.character.attack}🛡${item.character.defence}❤${item.character.health}`;
        this.gamePlay.showCellTooltip(message, index);
      }
    }

    for (const item of [...this.UserTeam.team]) {
      if (item.position === index) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }

    if (this.currentIndex !== null) {
      this.currentIndexPosition = findIndex(this.currentIndex, this.matrix, this.gamePlay.boardSize);
      this.currentRange = findRange(this.currentIndexPosition[0], this.currentIndexPosition[1], this.matrix, this.currentRangeAttack);
      for (const item of [...this.CompTeam.team]) {
        if (item.position === index) {
          this.gamePlay.setCursor(cursors.crosshair);
        }
      }

      if (this.currentRange.indexOf(index) !== -1 && this.arrPostions.indexOf(index) === -1) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
    }

    if (this.currentIndex !== null && this.currentRange.indexOf(index) === -1 && arrCompPosition.indexOf(index) !== -1) {
      this.gamePlay.setCursor(cursors.notallowed)
    } else if(this.currentIndex !== null && arrCompPosition.indexOf(index) !== -1) {
      this.gamePlay.selectCell(index, 'red');
    }
  }

  onCellLeave(index) {
    for (const item of [...this.UserTeam.team]) {
      if (item.position === index) {
        this.gamePlay.setCursor(cursors.auto);
      }
    }

    for (const item of [...this.CompTeam.team]) {
      if (item.position === index) {
        this.gamePlay.setCursor(cursors.auto);
      }
    }

    if (this.currentRange.indexOf(index) !== -1 && this.arrPostions.indexOf(index) === -1) {
      this.gamePlay.setCursor(cursors.auto);
      this.gamePlay.deselectCell(index);
    }
  }
}
