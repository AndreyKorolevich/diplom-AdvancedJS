import GameStateService from '../GameStateService';

const stateService = new GameStateService({});

jest.mock('../GameStateService');
beforeEach(() => {
  jest.resetAllMocks();
});

test('Check load', () => {
  const expected = { point: 10, maxPoint: 10, level: 1 };
  stateService.load.mockReturnValue(expected);
  const recived = stateService.load();
  expect(recived).toBe(expected);
});

test('Check load on error', () => {
  const expected = new Error();
  stateService.load.mockReturnValue(expected);

  expect(() => {
    stateService.load();
  }).toThrow();
});
