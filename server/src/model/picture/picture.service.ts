import { Injectable, Logger } from '@nestjs/common';
import { PostgresPictureService } from 'src/service/postgres/picture/picture.service';
import * as FS from 'fs';


@Injectable()
export class ModelPictureService {
	constructor (
		private readonly postgresPictureService: PostgresPictureService,
	) {}
	
	private readonly logger = new Logger(ModelPictureService.name);
	
	async uploadPicture(
		pictureData: Buffer,
	) {
		return await this.postgresPictureService.uploadPicture(pictureData)
	}

	async getPicture(
		pictureId: number,
	) {
		const str = await this.postgresPictureService.getPicture(pictureId)
		return str
	}
}