import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { EChatType } from "@shared/types/chat";
import { User } from "../user/user.class";
import { Messages } from "../messages/messages.class";

@Entity()
export class Chat {

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@ManyToMany(type => User, {cascade: true})
	@JoinTable({
		name: 'custom_users_chat',
		joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
	})
  	users: User[];

	@ManyToMany(type => User, {cascade: true})
	@JoinTable({
		name: 'custom_admins_chat',
		joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'admin_id', referencedColumnName: 'id' },
	})
	admins: User[];

	@ManyToMany(type => User, {cascade: true})
	@JoinTable({
		name: 'custom_blacklist_chat',
		joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'blacklist_id', referencedColumnName: 'id' },
	})
	blacklist: User[];

	@ManyToOne(type => User, (user) => user.owned_chat)
	owner: User;
	  
	@Column({type: 'enum', enum: EChatType, default: EChatType.inactive})
	@IsNotEmpty()
	type: EChatType;

	@OneToMany(type => Messages, (messages) => messages.chat)
	messages: Messages[];

	@Column()
	@IsNotEmpty()
	chat_picture: string;

	@Column()
	@IsNotEmpty()
	@IsString()
	name: string;
}
