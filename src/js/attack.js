import GamePlay from './GamePlay';

export default async (attacker, target, state) => {
  const damage = Math.floor(Math.max(attacker.character.attack - target.character.defence, attacker.character.attack * 0.1));
  await state.gamePlay.showDamage(target.position, damage);
  target.character.health -= damage;
  state.isMove = state.isMove === 'comp' ? 'user' : 'comp';
  if (target.character.health <= 0) {
    state.CompTeam.team = state.CompTeam.team.filter((item) => item.position !== target.position);
    state.UserTeam.team = state.UserTeam.team.filter((item) => item.position !== target.position);
    if (state.arrUserPosition().length === 0) {
      GamePlay.showMessage('user Game over');
       state.block = true;
    } else if (state.arrCompPosition().length === 0) {
      return new Promise((res, rej) => {
        res('next');
      })
    }
  }
  state.gamePlay.redrawPositions([...state.arrTeam()]);
};
