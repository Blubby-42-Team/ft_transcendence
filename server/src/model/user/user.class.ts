import { Exclude } from "class-transformer";
import { Column, Entity, Exclusion, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsEnum, IsObject, ValidateNested} from 'class-validator';
import { UserRoleType } from "src/auth/auth.class";
import { User42 } from "./user42.class";

@Entity()
export class User {

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
	@OneToOne(type => User42,
	{
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	@Exclude({ toPlainOnly: true})
	@IsNotEmpty()
	@ValidateNested()
	user42: User42;
}
