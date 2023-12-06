import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
