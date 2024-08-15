import { RawConfig, RawScreeningConfig } from '../../src';

let config: RawScreeningConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawScreeningConfig, {
    url: 'https://screening.mystiko.network',
    clientTimeoutMs: 20000,
    version: 1,
  });
});

test('test invalid url', async () => {
  config.url = 'not a valid url';
  await expect(config.validate()).rejects.toThrow();
});

test('test invalid clientTimeoutMs', async () => {
  config.clientTimeoutMs = -1;
  await expect(config.validate()).rejects.toThrow();
  config.clientTimeoutMs = 0;
  await expect(config.validate()).rejects.toThrow();
});

test('test invalid version', async () => {
  config.version = -1;
  await expect(config.validate()).rejects.toThrow();
  config.version = 0;
  await expect(config.validate()).rejects.toThrow();
  config.version = 1.2;
  await expect(config.validate()).rejects.toThrow();
});

test('test import json file', async () => {
  const fileConfig = await RawConfig.createFromFile(RawScreeningConfig, 'tests/files/screening.valid.json');
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawScreeningConfig, 'tests/files/screening.invalid.json'),
  ).rejects.toThrow();
});
