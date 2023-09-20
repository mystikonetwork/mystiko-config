import { RawConfig, RawSequencerConfig } from '../../src';

let config: RawSequencerConfig;

beforeEach(async () => {
  config = await RawConfig.createFromObject(RawSequencerConfig, {
    host: 'example.com',
    port: 50051,
    isSsl: true,
  });
});

test('test invalid host', async () => {
  config.host = 'not a valid host';
  await expect(config.validate()).rejects.toThrow();
});

test('test import json file', async () => {
  const fileConfig = await RawConfig.createFromFile(RawSequencerConfig, 'tests/files/sequencer.valid.json');
  expect(fileConfig).toStrictEqual(config);
  await expect(
    RawConfig.createFromFile(RawSequencerConfig, 'tests/files/sequencer.invalid.json'),
  ).rejects.toThrow();
});
