import { AxelarBridgeConfig, RawAxelarBridgeConfig, RawConfig } from '../../../src';

let rawConfig: RawAxelarBridgeConfig;
let config: AxelarBridgeConfig;

beforeEach(async () => {
  rawConfig = await RawConfig.createFromFile(
    RawAxelarBridgeConfig,
    'tests/files/bridge/axelar.valid.json',
  );
  config = new AxelarBridgeConfig(rawConfig);
});

test('test equality', () => {
  expect(config.name).toBe(rawConfig.name);
  expect(config.type).toBe(rawConfig.type);
});

test('test copy', () => {
  expect(new AxelarBridgeConfig(config.copyData())).toStrictEqual(config);
});

test('test mutate', () => {
  expect(config.mutate()).toStrictEqual(config);
  rawConfig.name = 'another name';
  const newConfig = config.mutate(rawConfig);
  expect(newConfig.name).toBe('another name');
});

test('test toJsonString', async () => {
  const jsonString = config.toJsonString();
  const loadedRawConfig = await RawConfig.createFromObject(RawAxelarBridgeConfig, JSON.parse(jsonString));
  expect(loadedRawConfig).toStrictEqual(rawConfig);
});
