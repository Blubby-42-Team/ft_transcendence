import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsEnum, IsObject} from 'class-validator';
import { UserRoleType } from "src/auth/auth.class";

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