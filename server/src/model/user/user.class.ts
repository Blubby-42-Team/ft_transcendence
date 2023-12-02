import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsEnum, ValidateNested} from 'class-validator';
import { UserRoleType } from "src/auth/auth.class";
import { User42 } from "./user42.class";
import { Settings } from "../settings/settings.class";
import { Stats } from "../stats/stats.class";
import { History } from "../history/history.class";

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@Column()
	@IsNotEmpty()
	display_name: string;

	@Column({type: 'enum', enum: UserRoleType, default: UserRoleType.User})
	@IsNotEmpty()
	@IsEnum(UserRoleType)
	role: UserRoleType;

	@Column()
	@IsNotEmpty()
	profile_picture: string;

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

	/**
	 * Settings data
	 */
	@OneToOne(type => Settings,
		{
			cascade: true,
			eager: true,
		})
		@JoinColumn()
		@Exclude({ toPlainOnly: true})
		@IsNotEmpty()
		@ValidateNested()
		settings: Settings;
	

	/**
	 * Stats data
	 */
	@OneToOne(type => Stats,
		{
			cascade: true,
			eager: true,
		})
		@JoinColumn()
		@Exclude({ toPlainOnly: true})
		@IsNotEmpty()
		@ValidateNested()
		stats: Stats;

	@OneToMany(type => History, (history) => history.player)
	history: History[];

	@OneToMany(type => History, (history) => history.opp)
	historyOpponent: History[];

	@ManyToMany(type => User, {cascade: true})
	@JoinTable({
		name: 'custom_user_friends',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' },
	})
  	friends: User[];

	@ManyToMany(type => User, {cascade: true})
	@JoinTable({
		name: 'custom_user_whitelist',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'whitelist_id', referencedColumnName: 'id' },
	})
	whitelist: User[];

	@ManyToMany(type => User, {cascade: true})
	@JoinTable({
		name: 'custom_user_blacklist',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'blacklist_id', referencedColumnName: 'id' },
	})
	blacklist: User[];
}
