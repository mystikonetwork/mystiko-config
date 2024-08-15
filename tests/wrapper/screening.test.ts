import { ScreeningConfig, RawConfig, RawScreeningConfig } from '../../src';

let rawConfig: RawScreeningConfig;
let config: ScreeningConfig;

beforeEach(async () => {
  rawConfig = await RawScreeningConfig.createFromFile(RawScreeningConfig, 'tests/files/screening.valid.json');
  config = new ScreeningConfig(rawConfig);
});

test('test equality', () => {
  expect(config.url).toBe(rawConfig.url);
  expect(config.clientTimeoutMs).toBe(rawConfig.clientTimeoutMs);
  expect(config.version).toBe(rawConfig.version);
});

test('test copy', () => {
  expect(new ScreeningConfig(config.copyData())).toStrictEqual(config);
});

test('test mutate', () => {
  expect(config.mutate()).toStrictEqual(config);
  rawConfig.url = 'https://example1.com';
  const newConfig = config.mutate(rawConfig);
  expect(newConfig.url).toBe('https://example1.com');
});

test('test toJsonString', async () => {
  const jsonString = config.toJsonString();
  const loadedRawConfig = await RawConfig.createFromObject(RawScreeningConfig, JSON.parse(jsonString));
  expect(loadedRawConfig).toStrictEqual(rawConfig);
});
