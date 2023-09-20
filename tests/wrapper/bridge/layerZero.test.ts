import { LayerZeroBridgeConfig, RawLayerZeroBridgeConfig, RawConfig } from '../../../src';

let rawConfig: RawLayerZeroBridgeConfig;
let config: LayerZeroBridgeConfig;

beforeEach(async () => {
  rawConfig = await RawConfig.createFromFile(
    RawLayerZeroBridgeConfig,
    'tests/files/bridge/layerZero.valid.json',
  );
  config = new LayerZeroBridgeConfig(rawConfig);
});

test('test equality', () => {
  expect(config.name).toBe(rawConfig.name);
  expect(config.type).toBe(rawConfig.type);
});

test('test copy', () => {
  expect(new LayerZeroBridgeConfig(config.copyData())).toStrictEqual(config);
});

test('test mutate', () => {
  expect(config.mutate()).toStrictEqual(config);
  rawConfig.name = 'another name';
  const newConfig = config.mutate(rawConfig);
  expect(newConfig.name).toBe('another name');
});

test('test toJsonString', async () => {
  const jsonString = config.toJsonString();
  const loadedRawConfig = await RawConfig.createFromObject(RawLayerZeroBridgeConfig, JSON.parse(jsonString));
  expect(loadedRawConfig).toStrictEqual(rawConfig);
});
