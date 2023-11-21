import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../model/user/user.class';
import { Repository } from 'typeorm';

@Injectable()
export class PostgresUserService {
	constructor (
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}
	
	async getUserById(id: number): Promise<User> {
		return this.userRepository.findOne({ where: { id } });
	}

	async addUser(user: User): Promise<User> {
		const userDto = this.userRepository.create(user);
		return this.userRepository.save(userDto);
	}

	async updateUser(user: User) {
		const userDto = this.userRepository.create(user);
		return this.userRepository.update(userDto.id, userDto);
	}
}

