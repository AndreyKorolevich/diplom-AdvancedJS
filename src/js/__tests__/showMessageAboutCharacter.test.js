import { Vampire } from '../Character';

test('Check that messge show correct', () => {
  const vampire = new Vampire(1);
  const message = `🎖${vampire.level}⚔${vampire.attack}🛡${vampire.defence}❤${vampire.health}`;
  const expected = '🎖1⚔25🛡25❤50';

  expect(message).toBe(expected);
});
