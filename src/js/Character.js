export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if(new.target.name === 'Character'){
      throw new Error('Impossible create instance')
    }
  }
}

export class Bowman extends Character{
  constructor(level, type = 'generic') {
    super(level,type = 'generic');
    this.attack = 25;
    this.defence = 25;
  }
}

export class Swordsman extends Character{
  constructor(level, type = 'generic') {
    super(level,type = 'generic');
    this.attack = 40;
    this.defence = 10;
  }
}

export class Magician extends Character{
  constructor(level, type = 'generic') {
    super(level,type = 'generic');
    this.attack = 10;
    this.defence = 40;
  }
}

export class Vampire extends Character{
  constructor(level, type = 'generic') {
    super(level,type = 'generic');
    this.attack = 25;
    this.defence = 25;
  }
}

export class Undead extends Character{
  constructor(level, type = 'generic') {
    super(level,type = 'generic');
    this.attack = 40;
    this.defence = 10;
  }
}

export class Daemon extends Character{
  constructor(level, type = 'generic') {
    super(level,type = 'generic');
    this.attack = 10;
    this.defence = 40;
  }
}

