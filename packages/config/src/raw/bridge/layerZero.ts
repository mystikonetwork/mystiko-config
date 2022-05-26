import { Equals } from 'class-validator';
import { RawBridgeConfig } from './base';
import { BridgeType } from '../../common';

/**
 * @class RawLayerZeroBridgeConfig
 * @extends RawBridgeConfig
 * @param {Object} rawConfig raw configuration object.
 * @desc configuration class for LayerZero cross-chain bridge.
 */
export class RawLayerZeroBridgeConfig extends RawBridgeConfig {
  @Equals(BridgeType.LAYER_ZERO)
  public type: BridgeType = BridgeType.LAYER_ZERO;
}
