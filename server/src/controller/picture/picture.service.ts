import { Injectable } from '@nestjs/common';
import { ModelPictureService } from 'src/model/picture/picture.service';

@Injectable()
export class PictureService {

	constructor(
		private readonly modelPictureService: ModelPictureService,
	) {}

	async uploadPicture(pictureData: Buffer, filename: string) {
		return await this.modelPictureService.uploadPicture(pictureData, filename);
	}

	async getPicture(
		pictureId: number,
	) {
		return await this.modelPictureService.getPicture(pictureId)
	}
}
