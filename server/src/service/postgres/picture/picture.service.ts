import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from '../../../model/picture/picture.class';
import { ModelPictureService } from 'src/model/picture/picture.service';
import { User } from 'src/model/user/user.class';
import { Chat } from 'src/model/chat/chat.class';


@Injectable()
export class PostgresPictureService {

	constructor (
		@InjectRepository(Picture) private readonly pictureRepository: Repository<Picture>,
	) {}
	
	private readonly logger = new Logger(ModelPictureService.name);

	async uploadPicture(
		pictureData: Buffer,
	) {
		const picture = new Picture;
		picture.imageData = pictureData;
		this.pictureRepository.save(picture)
		.catch(err => {throw err})
		.then(res => {
			return 'ok'
		})
	}
	
	async getPicture(
		pictureId: number
	): Promise<string> {
		return this.pictureRepository.query(`
			SELECT "imageData"
			FROM picture
			WHERE picture.id = $1`,
			[pictureId]
		)
		.catch(err => {
			throw err
		})
		.then(res => {
			if (!res[0])
				throw new NotFoundException("There is no picture with this ID.")
			else
				return res[0].imageData
		})
	}
}

