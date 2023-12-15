import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsBoolean, IsDate, MATCHES} from 'class-validator';
import { EGameType } from "@shared/types/history";
import { Type } from "class-transformer";
import { User } from "../user/user.class";

@Entity()
export class History {

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@ManyToOne(type => User, (user) => user.history)
	player: User;

	@ManyToOne(type => User, (user) => user.historyOpponent)
	opp: User;

	@Column({type: 'enum', enum: EGameType, default: EGameType.Classic})
	@IsNotEmpty()
	game_type: EGameType;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	player_score: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	opp_score: number;

	@Column()
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	date: Date;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	duration: number;

}





