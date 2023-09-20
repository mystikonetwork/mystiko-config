import { SequencerConfig, RawConfig, RawSequencerConfig } from '../../src';

let rawConfig: RawSequencerConfig;
let config: SequencerConfig;

beforeEach(async () => {
  rawConfig = await RawConfig.createFromFile(RawSequencerConfig, 'tests/files/sequencer.valid.json');
  config = new SequencerConfig(rawConfig);
});

test('test equality', () => {
  expect(config.host).toBe(rawConfig.host);
  expect(config.port).toBe(rawConfig.port);
  expect(config.isSsl).toBe(rawConfig.isSsl);
});

test('test copy', () => {
  expect(new SequencerConfig(config.copyData())).toStrictEqual(config);
});

test('test mutate', () => {
  expect(config.mutate()).toStrictEqual(config);
  rawConfig.host = 'example1.com';
  const newConfig = config.mutate(rawConfig);
  expect(newConfig.host).toBe('example1.com');
});

test('test toJsonString', async () => {
  const jsonString = config.toJsonString();
  const loadedRawConfig = await RawConfig.createFromObject(RawSequencerConfig, JSON.parse(jsonString));
  expect(loadedRawConfig).toStrictEqual(rawConfig);
});
