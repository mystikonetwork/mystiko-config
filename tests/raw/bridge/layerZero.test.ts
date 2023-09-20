import { BridgeType, RawLayerZeroBridgeConfig, RawConfig } from '../../../src';

let config: RawLayerZeroBridgeConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawLayerZeroBridgeConfig, { name: 'LayerZero Bridge' });
});

test('test invalid type', async () => {
  config.type = BridgeType.TBRIDGE;
  await expect(config.validate()).rejects.toThrow();
});

test('test import json file', async () => {
  const fileConfig = await RawConfig.createFromFile(
    RawLayerZeroBridgeConfig,
    'tests/files/bridge/layerZero.valid.json',
  );
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawLayerZeroBridgeConfig, 'tests/files/bridge/layerZero.invalid.json'),
  ).rejects.toThrow();
});
