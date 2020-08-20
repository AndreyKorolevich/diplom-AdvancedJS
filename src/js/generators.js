/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team';

export function characterGenerator(allowedTypes, maxLevel) {
  const numberCharacter = Math.floor(Math.random() * allowedTypes.length);
  const level = Math.ceil(Math.random() * maxLevel);
  const Character = allowedTypes[numberCharacter];
  return (new Character(level));
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  for (let i = 1; i <= characterCount; i++) {
    const character = characterGenerator(allowedTypes, maxLevel);
    team.push(character);
  }
  return team;
}
