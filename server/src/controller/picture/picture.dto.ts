import dto from '@shared/types/dto';
import { EGameType } from '@shared/types/history';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class DTO_addPicture {

	@IsNotEmpty()
	@Type(() => Buffer)
	pictureData: Buffer;
}