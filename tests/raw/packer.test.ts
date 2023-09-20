import { RawConfig, RawPackerConfig } from '../../src';

let config: RawPackerConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawPackerConfig, {
    url: 'https://static.mystiko.network/packer/v2',
    clientTimeoutMs: 10000,
    version: 2,
    checksum: 'sha512',
    compression: 'zstd',
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
  const fileConfig = await RawConfig.createFromFile(RawPackerConfig, 'tests/files/packer.valid.json');
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawPackerConfig, 'tests/files/packer.invalid.json'),
  ).rejects.toThrow();
});
