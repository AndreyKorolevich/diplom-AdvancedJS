import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import {generateTeam} from './generators';
import {
  Bowman, Daemon, Magician, Swordsman, Undead, Vampire,
} from './Character';
import Team from './Team';
import GamePlay from './GamePlay';
import cursors from './cursors';
import GameState from './GameState';
import {compAction} from './compAction';
import attack from './Attack';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.UserTeam = new Team([]);
    this.CompTeam = new Team([]);
    this.gameState = new GameState(this.gamePlay, this.UserTeam, this.CompTeam);

    this.onCellClick = this.onCellClick.bind(this);
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.newGame = this.newGame.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.loadGame = this.loadGame.bind(this);
  }

  events() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addNewGameListener(this.newGame);
    this.gamePlay.addSaveGameListener(this.saveGame);
    this.gamePlay.addLoadGameListener(this.loadGame);
  }

  init() {
    this.events();
    this.gamePlay.drawUi(themes.item(this.gameState.level));
    this.displayCharacter();

    // TODO: load saved stated from stateService
  }

  saveGame() {
    this.stateService.save(this.gameState);
  }

  loadGame() {
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState) {
        this.UserTeam = loadGameState.UserTeam;
        this.CompTeam = loadGameState.CompTeam;
        this.gameState.isMove = loadGameState.isMove;
        this.gameState.block = loadGameState.block;
        this.gameState.level = loadGameState.level;
        this.gameState.point = loadGameState.point;
        this.gameState.history = loadGameState.history;
        this.gameState.UserTeam = loadGameState.UserTeam;
        this.gameState.CompTeam = loadGameState.CompTeam;
        this.gameState.currentIndex = loadGameState.currentIndex;
        this.gameState.currentMove = loadGameState.currentMove;
        this.gameState.currentAttack = loadGameState.currentAttack;
        this.gameState.currentCharacter = loadGameState.currentCharacter;
        this.gamePlay.drawUi(themes.item(this.gameState.level));
        this.gamePlay.redrawPositions([...this.gameState.arrTeam()]);
      }
    } catch (e) {
      console.err(e);
      GamePlay.showMessage('Не удалось загрузить игру');
      this.newGame();
    }
  }

  newGame() {
    this.gameState.block = false;
    this.gameState.history.push({
      level: this.gameState.level,
      points: this.gameState.point,
    });
    this.gameState.level = 1;
    this.gameState.point = 0;
    this.UserTeam.deleteCharacter();
    this.CompTeam.deleteCharacter();
    this.gameState.reset();
    this.gamePlay.drawUi(themes.item(this.gameState.level));
    this.displayCharacter();
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
      default:
        compTeam = generateTeam([Vampire, Undead, Daemon], 4, this.UserTeam.team.length);
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
    this.gameState.reset();
    this.gamePlay.drawUi(themes.item(this.gameState.level));
    this.gamePlay.redrawPositions([...this.gameState.arrTeam()]);
  }

  async onCellClick(index) {
    if (!this.gameState.block) {
      const indexInArr = this.gameState.arrUserPosition().indexOf(index);
      const indexInCompArr = this.gameState.arrCompPosition().indexOf(index);

      if (indexInArr !== -1) {
        if (index === this.gameState.currentIndex) {
          this.gamePlay.deselectCell(this.gameState.currentIndex); // delete old character
          this.gameState.reset();
          return;
        }
        if (this.gameState.currentIndex !== null) { // delete old and choose new character
          this.gamePlay.deselectCell(this.gameState.currentIndex);
          this.gameState.reset();
        }

        const item = [...this.gameState.UserTeam.team][indexInArr]; // choose character and add yellow circle
        this.gamePlay.selectCell(index);
        this.gameState.currentIndex = index;
        this.gameState.currentCharacter = item;
        this.gameState.currentAttack = item.character.rangeAttack;
        this.gameState.currentMove = item.character.rangeMove;
      } else if (this.gameState.currentRangeMove().has(index)
        && indexInCompArr === -1) { // move user character
        this.gamePlay.deselectCell(this.gameState.currentIndex);
        this.gamePlay.deselectCell(index);
        this.gameState.currentCharacter.position = index;
        this.gameState.reset();
        this.gameState.isMove = 'comp';
        this.gamePlay.redrawPositions(this.gameState.arrTeam());

        compAction(this.gameState);
      } else if (this.gameState.currentIndex !== null && indexInCompArr !== -1 // attack on computer
        && this.gameState.currentRange().has(index)) {
        const indexComp = this.gameState.arrCompPosition().indexOf(index);
        const compCharacter = this.CompTeam.team[indexComp];
        const response = await attack(this.gameState.currentCharacter, compCharacter, this.gameState);
        if (response === 'next') {
          this.gameState.level += 1;
          for (const item of this.UserTeam.team) {
            this.gameState.point += item.character.health;
          }
          if (this.gameState.level <= 4) {
            this.levelUp();
          }

          this.displayCharacter();
          this.gamePlay.showPoints(this.gameState.point);
          return;
        }
        compAction(this.gameState);
      } else if (indexInCompArr !== -1 && !this.gameState.currentRange().has(index)
        && this.gameState.currentIndex !== null) { // show error
        this.gamePlay.setCursor(cursors.notallowed);
        GamePlay.showError('This isn`t allowed action');
      } else if (indexInCompArr !== -1) { // show error
        GamePlay.showError('This isn`t your character');
      }
    }
  }

  onCellEnter(index) {
    if (!this.gameState.block) {
      const indexInArr = this.gameState.arrPositions().indexOf(index);
      const indexInCompArr = this.gameState.arrCompPosition().indexOf(index);
      const indexInUserArr = this.gameState.arrUserPosition().indexOf(index);

      if (indexInArr !== -1) {
        const item = this.gameState.arrTeam()[indexInArr];
        const message = `🎖${item.character.level}⚔${item.character.attack}🛡${item.character.defence}❤${item.character.health}`;
        this.gamePlay.showCellTooltip(message, index);
      }

      if (indexInUserArr !== -1) {
        this.gamePlay.setCursor(cursors.pointer);
      }

      if (this.gameState.currentIndex !== null) { // show place that character can attack
        if (this.gameState.currentRange().has(index) && indexInArr === -1) {
          this.gamePlay.selectCell(index, 'green');
        }

        // show place that character can move
        if (this.gameState.currentRangeMove().has(index) && this.gameState.arrPositions().indexOf(index) === -1) {
          this.gamePlay.setCursor(cursors.pointer);
        }
      }

      // add red circle and cursor crosshair on enemy if he`s in current range user character or add crosshair notallowed
      // if he`s not in current range.
      if (this.gameState.currentIndex !== null && !this.gameState.currentRange().has(index) && indexInCompArr !== -1) {
        this.gamePlay.setCursor(cursors.notallowed);
      } else if (this.gameState.currentIndex !== null && indexInCompArr !== -1) {
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      }
    }
  }

  onCellLeave(index) {
    if (!this.gameState.block) {
      const indexInArr = this.gameState.arrPositions().indexOf(index);
      const indexInCompArr = this.gameState.arrCompPosition().indexOf(index);
      const indexInUserArr = this.gameState.arrUserPosition().indexOf(index);

      if ((this.gameState.currentRange().has(index) && indexInArr === -1)
        || (this.gameState.currentRange().has(index) && indexInCompArr !== -1)) {
        this.gamePlay.setCursor(cursors.auto);
        this.gamePlay.deselectCell(index);
      }

      if ((this.gameState.currentRangeMove() !== null && this.gameState.currentRangeMove().has(index)
        && indexInArr === -1) || indexInUserArr !== -1) {
        this.gamePlay.setCursor(cursors.auto);
      }
    }
  }

  levelUp() {
    for (const item of this.UserTeam.team) {
      const current = item.character;
      current.level += 1;
      current.attack = this.upAttackDefence(current.attack, current.health);
      current.defence = this.upAttackDefence(current.defence, current.health);
      current.health = (current.health + 80) < 100 ? current.health + 80 : 100;
    }
  }

  upAttackDefence(attackBefore, life) {
    return Math.floor(Math.max(attackBefore, attackBefore * (1.8 - life / 100)));
  }

}

