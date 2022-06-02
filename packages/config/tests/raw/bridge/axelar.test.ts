import { BridgeType, RawAxelarBridgeConfig, RawConfig } from '../../../src';

let config: RawAxelarBridgeConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawAxelarBridgeConfig, { name: 'Axelar Bridge' });
});

test('test invalid type', async () => {
  config.type = BridgeType.TBRIDGE;
  await expect(config.validate()).rejects.toThrow();
});

test('test import json file', async () => {
  const fileConfig = await RawConfig.createFromFile(
    RawAxelarBridgeConfig,
    'tests/files/bridge/axelar.valid.json',
  );
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawAxelarBridgeConfig, 'tests/files/bridge/axelar.invalid.json'),
  ).rejects.toThrow();
});
