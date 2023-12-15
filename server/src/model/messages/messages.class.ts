import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { EMsgType } from "@shared/types/messages";
import { Chat } from "../chat/chat.class";
import { User } from "../user/user.class";

@Entity()
export class Messages {

	@PrimaryGeneratedColumn()
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@ManyToOne(type => User, (user) => user.messages)
	user: User;

	@ManyToOne(type => Chat, (chat) => chat.messages)
	chat: Chat;
	
	@Column({type: 'enum', enum: EMsgType, default: EMsgType.user})
	@IsNotEmpty()
	type: EMsgType;

	@Column()
	@IsNotEmpty()
	@IsString()
	content: string;
}
