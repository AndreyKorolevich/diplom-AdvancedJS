import {Bowman, Character, Daemon, Magician, Swordsman, Undead, Vampire} from '../Character';
test('should throw', () => {
  expect(() => {
    const result = new Character(1);
  }).toThrow();
});

test('should Bowman', () => {
  const result = new Bowman(1)
  expect(result).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'generic'
  });
});

test('should Daemon', () => {
  const result = new Daemon(1)
  expect(result).toEqual({
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'generic'
  });
});

test('should Swordsman', () => {
  const result = new Swordsman(1)
  expect(result).toEqual({
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'generic'
  });
});

test('should Magician', () => {
  const result = new Magician(1)
  expect(result).toEqual({
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'generic'
  });
});

test('should Vampire', () => {
  const result = new Vampire(1)
  expect(result).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'generic'
  });
});

test('should Undead', () => {
  const result = new Undead(1)
  expect(result).toEqual({
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'generic'
  });
});

