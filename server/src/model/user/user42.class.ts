import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IsNotEmpty, IsNumber} from 'class-validator';

@Entity()
export class User42 {
	@PrimaryColumn()
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