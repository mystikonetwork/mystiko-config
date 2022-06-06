import { IndexerConfig, RawConfig, RawIndexerConfig } from '../../src';

let rawConfig: RawIndexerConfig;
let config: IndexerConfig;

beforeEach(async () => {
  rawConfig = await RawConfig.createFromFile(RawIndexerConfig, 'tests/files/indexer.valid.json');
  config = new IndexerConfig(rawConfig);
});

test('test equality', () => {
  expect(config.url).toBe(rawConfig.url);
  expect(config.timeoutMs).toBe(rawConfig.timeoutMs);
});

test('test copy', () => {
  expect(new IndexerConfig(config.copyData())).toStrictEqual(config);
});

test('test mutate', () => {
  expect(config.mutate()).toStrictEqual(config);
  rawConfig.url = 'https://example1.com';
  const newConfig = config.mutate(rawConfig);
  expect(newConfig.url).toBe('https://example1.com');
});

test('test toJsonString', async () => {
  const jsonString = config.toJsonString();
  const loadedRawConfig = await RawConfig.createFromObject(RawIndexerConfig, JSON.parse(jsonString));
  expect(loadedRawConfig).toStrictEqual(rawConfig);
});
