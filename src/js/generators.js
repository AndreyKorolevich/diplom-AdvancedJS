/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from "./Team";

export function* characterGenerator(allowedTypes, maxLevel,characterCount) {
  switch (maxLevel) {
    case 1:
      yield allowedTypes.userCharacters(('Bowman'),maxLevel);
      yield allowedTypes.userCharacters(('Swordsman'),maxLevel);
      yield allowedTypes.computerCharacters(('Any'),maxLevel);
      return allowedTypes.computerCharacters(('Any'),maxLevel);
    case 2:
      yield allowedTypes.userCharacters(('Any'),1);
      for(let i = 0; i <= characterCount; i++) {
        yield allowedTypes.computerCharacters(('Any'),Math.round(Math.random()*2));
      }
    case 3:
      yield allowedTypes.userCharacters(('Any'),Math.round(Math.random()*2));
      yield allowedTypes.userCharacters(('Any'),Math.round(Math.random()*2));
      for(let i = 0; i <= characterCount; i++) {
        yield allowedTypes.computerCharacters(('Any'),Math.round(Math.random()*3));
      }
    case 4:
      yield allowedTypes.userCharacters(('Any'),Math.round(Math.random()*3));
      yield allowedTypes.userCharacters(('Any'),Math.round(Math.random()*3));
      for(let i = 0; i <= characterCount; i++) {
        yield allowedTypes.computerCharacters(('Any'),Math.round(Math.random()*4));
      }
    default: return
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
    const team = new Team();
    const character = characterGenerator(allowedTypes, maxLevel, characterCount);
    for (let i = 0; i <= characterCount; i++) {
      let item = character.next();
      team[item.name] = item
    }
}
