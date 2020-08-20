export default class Team {
  constructor(arrCharacters) {
    this.team = arrCharacters;
  }

  addCharacters(arrCharacters) {
    this.team = [...this.team, ...arrCharacters];
  }

  deleteCharacter() {

  }
}
