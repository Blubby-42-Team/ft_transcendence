import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber} from 'class-validator';

@Entity()
export class Stats {

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	played_matchs: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	classic_match_won: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	classic_match_lost: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	classic_match_points_won: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	classic_match_points_lost: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	classic_mmr: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	random_match_won: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	random_match_lost: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	random_match_points_won: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	random_match_points_lost: number;

	@Column()
	@IsNotEmpty()
	@IsNumber()
	random_mmr: number;
}