import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, JoinColumn, OneToOne, firstColumn, firstGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsEnum, IsObject} from 'class-validator';
import { UserRoleType } from "src/auth/auth.class";

@Entity()
export class User42 {

	constructor(partial: Partial<User42>) {
		Object.assign(this, partial);
	}

	@firstColumn()
	@IsNotEmpty()
	@IsNumber()
	@Exclude({ toPlainOnly: true})
	id: number;

	@Column()
	@IsNotEmpty()
	login: string;

	@Column()
	@IsNotEmpty()
	@Exclude({ toPlainOnly: true})
	accessToken: string;

	@Column()
	@IsNotEmpty()
	@Exclude({ toPlainOnly: true})
	refreshToken: string;
}