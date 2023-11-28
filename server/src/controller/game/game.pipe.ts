/*
https://docs.nestjs.com/pipes
*/

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class GamePipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		log('GamePipe.transform', value, JSON.stringify(metadata))
		return value;
	}
}
