import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty } from 'class-validator';

// export class

@Entity()
export class User {

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsNotEmpty()
	displayName: string;

	@Column()
	@Exclude({ toPlainOnly: true})
	@IsNotEmpty()
	passwordHash: string;

	@Column()
	@IsNotEmpty()
	role: number;
}
