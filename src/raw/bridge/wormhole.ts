import { Equals } from 'class-validator';
import { BridgeType } from '../../common';
import { RawBridgeConfig } from './base';

/**
 * @class RawWormholeBridgeConfig
 * @extends RawBridgeConfig
 * @param {Object} rawConfig raw configuration object.
 * @desc configuration class for wormhole cross-chain bridge.
 */
export class RawWormholeBridgeConfig extends RawBridgeConfig {
  @Equals(BridgeType.WORMHOLE)
  public type: BridgeType = BridgeType.WORMHOLE;
}
