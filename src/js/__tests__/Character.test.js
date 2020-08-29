import {
  Bowman, Character, Daemon, Magician, Swordsman, Undead, Vampire,
} from '../Character';

test('should throw', () => {
  expect(() => {
    new Character(1);
  }).toThrow();
});

test('should Bowman', () => {
  const result = new Bowman(1);
  expect(result).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
    rangeAttack: 5,
    rangeMove: 5,
    name: 'Bowman',
  });
});

test('should Daemon', () => {
  const result = new Daemon(1);
  expect(result).toEqual({
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'daemon',
    rangeAttack: 9,
    rangeMove: 3,
    name: 'Daemon',
  });
});

test('should Swordsman', () => {
  const result = new Swordsman(1);
  expect(result).toEqual({
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'swordsman',
    rangeAttack: 3,
    rangeMove: 9,
    name: 'Swordsman',
  });
});

test('should Magician', () => {
  const result = new Magician(1);
  expect(result).toEqual({
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'magician',
    rangeAttack: 9,
    rangeMove: 3,
    name: 'Magician',
  });
});

test('should Vampire', () => {
  const result = new Vampire(1);
  expect(result).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'vampire',
    rangeAttack: 5,
    rangeMove: 5,
    name: 'Vampire',
  });
});

test('should Undead', () => {
  const result = new Undead(1);
  expect(result).toEqual({
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'undead',
    rangeAttack: 3,
    rangeMove: 9,
    name: 'Undead',
  });
});
