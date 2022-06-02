import { Equals } from 'class-validator';
import { BridgeType } from '../../common';
import { RawBridgeConfig } from './base';

/**
 * @class RawAxelarBridgeConfig
 * @extends RawBridgeConfig
 * @param {Object} rawConfig raw configuration object.
 * @desc configuration class for axelar cross-chain bridge.
 */
export class RawAxelarBridgeConfig extends RawBridgeConfig {
  @Equals(BridgeType.AXELAR)
  public type: BridgeType = BridgeType.AXELAR;
}
