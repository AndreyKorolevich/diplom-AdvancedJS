export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error('Impossible create instance');
    }
  }
}

export class Bowman extends Character {
  constructor(level, type = 'bowman') {
    super(level, type = 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.rangeAttack = 5;
    this.rangeMove = 5;
    this.name = 'Bowman';
  }
}

export class Swordsman extends Character {
  constructor(level, type = 'swordsman') {
    super(level, type = 'swordsman');
    this.attack = 40;
    this.defence = 10;
    this.rangeAttack = 3;
    this.rangeMove = 9;
    this.name = 'Swordsman';
  }
}

export class Magician extends Character {
  constructor(level, type = 'magician') {
    super(level, type = 'magician');
    this.attack = 10;
    this.defence = 40;
    this.rangeAttack = 9;
    this.rangeMove = 3;
    this.name = 'Magician';
  }
}

export class Vampire extends Character {
  constructor(level, type = 'vampire') {
    super(level, type = 'vampire');
    this.attack = Math.ceil(25 * Math.max(1, 0.7 + (level + 2) / 10));
    this.defence = Math.ceil(25 * Math.max(1, 0.7 + (level + 2) / 10));
    this.rangeAttack = 5;
    this.rangeMove = 5;
    this.name = 'Vampire';
  }
}

export class Undead extends Character {
  constructor(level, type = 'undead') {
    super(level, type = 'undead');
    this.attack = Math.ceil(40 * Math.max(1, 0.7 + (level + 2) / 10));
    this.defence = Math.ceil(10 * Math.max(1, 0.7 + (level + 2) / 10));
    this.rangeAttack = 3;
    this.rangeMove = 9;
    this.name = 'Undead';
  }
}

export class Daemon extends Character {
  constructor(level, type = 'daemon') {
    super(level, type = 'daemon');
    this.attack = Math.ceil(10 * Math.max(1, 0.7 + (level + 2) / 10));
    this.defence = Math.ceil(40 * Math.max(1, 0.7 + (level + 2) / 10));
    this.rangeAttack = 9;
    this.rangeMove = 3;
    this.name = 'Daemon';
  }
}
