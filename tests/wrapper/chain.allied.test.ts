import {
  BridgeType,
  ChainConfig,
  CircuitConfig,
  CircuitType,
  RawChainConfig,
  RawConfig,
  RawMystikoConfig,
} from '../../src';

let rawConfig: RawChainConfig;
let config: ChainConfig;
let rawMystikoConfig: RawMystikoConfig;
let defaultCircuitConfigs: Map<CircuitType, CircuitConfig>;
let circuitConfigsByName: Map<string, CircuitConfig>;

beforeEach(async () => {
  rawMystikoConfig = await RawConfig.createFromFile(
    RawMystikoConfig,
    'tests/files/mystiko.allied.valid.json',
  );
  circuitConfigsByName = new Map<string, CircuitConfig>();
  defaultCircuitConfigs = new Map<CircuitType, CircuitConfig>();
  rawMystikoConfig.circuits.forEach((rawCircuitConfig) => {
    const circuitConfig = new CircuitConfig(rawCircuitConfig);
    circuitConfigsByName.set(rawCircuitConfig.name, circuitConfig);
    if (rawCircuitConfig.isDefault) {
      defaultCircuitConfigs.set(rawCircuitConfig.type, circuitConfig);
    }
  });
  rawConfig = await RawConfig.createFromFile(RawChainConfig, 'tests/files/chain.allied.valid.json');
  expect(() => new ChainConfig(rawConfig)).toThrow(new Error('auxData has not been specified'));
  config = new ChainConfig(rawConfig, {
    defaultCircuitConfigs,
    circuitConfigsByName,
    depositContractGetter: () => undefined,
  });
});

test('test getPoolContract', () => {
  expect(config.getPoolContract('ETH', BridgeType.LOOP, 2)?.address).toBe(
    '0xBe2C9c8a00951662dF3a978b25F448968F0595AE',
  );
  expect(config.getPoolContract('wETH', BridgeType.LOOP, 2)?.address).toBe(
    '0xBe2C9c8a00951662dF3a978b25F448968F0595AE',
  );
  expect(config.getPoolContract('stETH', BridgeType.LOOP, 2)?.address).toBe(
    '0xBe2C9c8a00951662dF3a978b25F448968F0595AE',
  );
  expect(config.getPoolContract('ETH', BridgeType.LOOP, 3)?.address).toBe(
    '0xCFC94003081ce7EcdBc43f94A443Cf9fad0F8847',
  );
  expect(config.getPoolContract('wETH', BridgeType.LOOP, 3)?.address).toBe(
    '0xCFC94003081ce7EcdBc43f94A443Cf9fad0F8847',
  );
  expect(config.getPoolContract('stETH', BridgeType.LOOP, 3)?.address).toBe(
    '0xCFC94003081ce7EcdBc43f94A443Cf9fad0F8847',
  );
  expect(config.getPoolContract('MTT', BridgeType.TBRIDGE, 2)?.address).toBe(
    '0xF55Dbe8D71Df9Bbf5841052C75c6Ea9eA717fc6d',
  );
  expect(config.getPoolContract('wMTT', BridgeType.TBRIDGE, 2)?.address).toBe(
    '0xF55Dbe8D71Df9Bbf5841052C75c6Ea9eA717fc6d',
  );
  expect(config.getPoolContract('stMTT', BridgeType.TBRIDGE, 2)?.address).toBe(
    '0xF55Dbe8D71Df9Bbf5841052C75c6Ea9eA717fc6d',
  );
});
