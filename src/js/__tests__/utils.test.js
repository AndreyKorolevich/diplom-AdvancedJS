import {calcTileType} from '../utils';

test('should top-left', () => {
  const result = calcTileType(0, 8);
  expect('top-left').toBe('top-left');
});
test('should top', () => {
  const result = calcTileType(2, 8);
  expect('top').toBe('top');
});
test('should top-right', () => {
  const result = calcTileType(7, 8);
  expect('top-right').toBe('top-right');
});
test('should bottom-left', () => {
  const result = calcTileType(56, 8);
  expect('bottom-left').toBe('bottom-left');
});
test('should bottom', () => {
  const result = calcTileType(58, 8);
  expect('bottom').toBe('bottom');
});
test('should bottom-right', () => {
  const result = calcTileType(63, 8);
  expect('bottom-right').toBe('bottom-right');
});
test('should left', () => {
  const result = calcTileType(8, 8);
  expect('left').toBe('left');
});
test('should right', () => {
  const result = calcTileType(15, 8);
  expect('bottom').toBe('bottom');
});
test('should center', () => {
  const result = calcTileType(33, 8);
  expect('bottom').toBe('bottom');
});
