import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from '../../../model/picture/picture.class';
import { ModelPictureService } from 'src/model/picture/picture.service';


@Injectable()
export class PostgresPictureService {

	constructor (
		@InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
	) {}
	
	private readonly logger = new Logger(ModelPictureService.name);

	async uploadPicture(
		pictureData: Buffer,
		filename: string
	) {
		const newFile = await this.pictureRepository.create({
			data: pictureData,
			filename: filename,
		})
		return await this.pictureRepository.save(newFile).then(res => {return res.id})
	}
	
	async getPicture(
		pictureId: number
	) {
		const file = await this.pictureRepository.findOne({
			where: {
				id: pictureId
			}
		});
    	if (!file) {
      		throw new NotFoundException();
		}
		return file;
	}
}

