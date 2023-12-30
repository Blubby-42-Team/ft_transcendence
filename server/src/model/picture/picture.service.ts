import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PostgresPictureService } from 'src/service/postgres/picture/picture.service';


@Injectable()
export class ModelPictureService {
	constructor (
		private readonly postgresPictureService: PostgresPictureService,
	) {}
	
	private readonly logger = new Logger(ModelPictureService.name);
	
	async uploadPicture(
		pictureData: Buffer,
		filename: string,
	) {
		if (!pictureData)
			throw new BadRequestException('The file is empty.')
		return await this.postgresPictureService.uploadPicture(pictureData, filename)
		.catch(err => {throw err})
	}

	async getPicture(
		pictureId: number,
	) {
		return this.postgresPictureService.getPicture(pictureId)
	}
}