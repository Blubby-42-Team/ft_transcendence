import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsBoolean} from 'class-validator';
import { ETheme } from "@shared/types/settings";

@Entity()
export class Settings {

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@Column({type: 'enum', enum: ETheme, default: ETheme.Light})
	@IsNotEmpty()
	theme: ETheme;

	@Column()
	@IsNotEmpty()
	@IsBoolean()
	sound: boolean;
}
