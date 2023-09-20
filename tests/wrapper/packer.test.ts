import { PackerConfig, RawConfig, RawPackerConfig } from '../../src';

let rawConfig: RawPackerConfig;
let config: PackerConfig;

beforeEach(async () => {
  rawConfig = await RawPackerConfig.createFromFile(RawPackerConfig, 'tests/files/packer.valid.json');
  config = new PackerConfig(rawConfig);
});

test('test equality', () => {
  expect(config.url).toBe(rawConfig.url);
  expect(config.clientTimeoutMs).toBe(rawConfig.clientTimeoutMs);
  expect(config.version).toBe(rawConfig.version);
  expect(config.checksum).toBe(rawConfig.checksum);
  expect(config.compression).toBe(rawConfig.compression);
});

test('test copy', () => {
  expect(new PackerConfig(config.copyData())).toStrictEqual(config);
});

test('test mutate', () => {
  expect(config.mutate()).toStrictEqual(config);
  rawConfig.url = 'https://example1.com';
  const newConfig = config.mutate(rawConfig);
  expect(newConfig.url).toBe('https://example1.com');
});

test('test toJsonString', async () => {
  const jsonString = config.toJsonString();
  const loadedRawConfig = await RawConfig.createFromObject(RawPackerConfig, JSON.parse(jsonString));
  expect(loadedRawConfig).toStrictEqual(rawConfig);
});
