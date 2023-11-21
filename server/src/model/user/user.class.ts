import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsEnum, IsObject} from 'class-validator';
import { UserRoleType } from "src/auth/auth.class";
import { User42 } from "./user42.class";

@Entity()
export class User {

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@Column()
	@IsNotEmpty()
	displayName: string;

	@Column({type: 'enum', enum: UserRoleType, default: UserRoleType.User})
	@IsNotEmpty()
	@IsEnum(UserRoleType)
	role: UserRoleType;

	/**
	 * User42 data
	 */
	@OneToOne(type => User42)
	@JoinColumn()
	@Exclude({ toPlainOnly: true})
	@IsNotEmpty()
	user42: User42;
}

