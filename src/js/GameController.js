import themes from "./themes";
import PositionedCharacter from "./PositionedCharacter";
import {generateTeam} from "./generators";
import {Bowman, Daemon, Swordsman, Undead, Vampire} from "./Character";


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.level = 1;
  }

  createPosition(boardSize, range) {
    const arr = [];
    range.forEach(elem => {
      for(let i = elem; i < boardSize ** 2; i += boardSize) {
        arr.push(i)
      }
    })
    return arr
  }

  displayCharacter() {
    let userTeam = [];
    let compTeam = [];
    const compPositionArr = this.createPosition(this.gamePlay.boardSize, [6,7]);
    const userPositionArr = this.createPosition(this.gamePlay.boardSize, [0,1]);
    switch (this.level) {
      case 1:
        userTeam = generateTeam([Bowman, Swordsman], 1, 2);
        compTeam = generateTeam([Vampire, Undead, Daemon], 1, 2);
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
    }
    const userTeamPosition = userTeam.map(elem => {
      const userPosition = userPositionArr[Math.floor(Math.random() * userPositionArr.length)]
      return new PositionedCharacter(elem, userPosition);
    });
    const compTeamPosition = compTeam.map(elem => {
      const userPosition = compPositionArr[Math.floor(Math.random() * compPositionArr.length)]
      return new PositionedCharacter(elem, userPosition);
    });
    this.gamePlay.redrawPositions([...userTeamPosition, ...compTeamPosition])
  }

  init() {
    this.gamePlay.drawUi(themes.item(this.level));
    this.displayCharacter();

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
