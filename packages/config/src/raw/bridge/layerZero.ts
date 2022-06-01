import {Equals} from 'class-validator';
import {BridgeType} from '../../common';
import {RawBridgeConfig} from './base';

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
