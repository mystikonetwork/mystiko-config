import { Equals } from 'class-validator';
import { BridgeType } from '../../common';
import { RawBridgeConfig } from './base';

export class RawTBridgeConfig extends RawBridgeConfig {
  @Equals(BridgeType.TBRIDGE)
  public type: BridgeType = BridgeType.TBRIDGE;
}
