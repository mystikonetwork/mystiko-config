import { Equals } from 'class-validator';
import { RawBridgeConfig } from './base';
import { BridgeType } from '../../common';

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
