import { BridgeType, RawWormholeBridgeConfig, RawConfig } from '../../../src';

let config: RawWormholeBridgeConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawWormholeBridgeConfig, { name: 'Wormhole Bridge' });
});

test('test invalid type', async () => {
  config.type = BridgeType.TBRIDGE;
  await expect(config.validate()).rejects.toThrow();
});

test('test import json file', async () => {
  const fileConfig = await RawConfig.createFromFile(
    RawWormholeBridgeConfig,
    'tests/files/bridge/wormhole.valid.json',
  );
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawWormholeBridgeConfig, 'tests/files/bridge/wormhole.invalid.json'),
  ).rejects.toThrow();
});
