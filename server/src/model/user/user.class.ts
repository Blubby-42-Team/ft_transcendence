import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsEnum} from 'class-validator';
import { UserRoleType } from "src/auth/auth.class";

@Entity()
export class User {

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}

	@PrimaryColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@Column()
	@IsNotEmpty()
	login: string;

	@Column()
	@IsNotEmpty()
	displayName: string;

	@Column({type: 'enum', enum: UserRoleType, default: UserRoleType.User})
	@IsNotEmpty()
	@IsEnum(UserRoleType)
	role: UserRoleType;

	@Column()
	@IsNotEmpty()
	@Exclude({ toPlainOnly: true})
	accessToken: string;

	@Column()
	@IsNotEmpty()
	@Exclude({ toPlainOnly: true})
	refreshToken: string;
}
