import { RawConfig, RawIndexerConfig } from '../../src';

let config: RawIndexerConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawIndexerConfig, {
    url: 'https://example.com',
    timeoutMs: 1000,
  });
});

test('test invalid url', async () => {
  config.url = 'not a valid url';
  await expect(config.validate()).rejects.toThrow();
});

test('test invalid timeOutMs', async () => {
  config.timeoutMs = -1;
  await expect(config.validate()).rejects.toThrow();
  config.timeoutMs = 0;
  await expect(config.validate()).rejects.toThrow();
});

test('test import json file', async () => {
  const fileConfig = await RawConfig.createFromFile(RawIndexerConfig, 'tests/files/indexer.valid.json');
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawIndexerConfig, 'tests/files/indexer.invalid.json'),
  ).rejects.toThrow();
});
