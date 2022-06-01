import {Equals} from 'class-validator';
import {BridgeType} from '../../common';
import {RawBridgeConfig} from './base';

/**
 * @class RawCelerBridgeConfig
 * @extends RawBridgeConfig
 * @param {Object} rawConfig raw configuration object.
 * @desc configuration class for Celer cross-chain bridge.
 */
export class RawCelerBridgeConfig extends RawBridgeConfig {
  @Equals(BridgeType.CELER)
  public type: BridgeType = BridgeType.CELER;
}
