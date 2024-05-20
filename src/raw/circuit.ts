import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CircuitType } from '../common';
import { RawConfig } from './base';

export class RawCircuitConfig extends RawConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsEnum(CircuitType)
  public type: CircuitType;

  @Expose()
  @IsBoolean()
  public isDefault: boolean = false;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public programFile: string[];

  @Expose()
  @IsString()
  @IsOptional()
  public programFileChecksum?: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public abiFile: string[];

  @Expose()
  @IsString()
  @IsOptional()
  public abiFileChecksum?: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public provingKeyFile: string[];

  @Expose()
  @IsString()
  @IsOptional()
  public provingKeyFileChecksum?: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public verifyingKeyFile: string[];

  @Expose()
  @IsString()
  @IsOptional()
  public verifyingKeyFileChecksum?: string;
}
