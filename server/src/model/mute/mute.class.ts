import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { User } from "../user/user.class";
import { Chat } from "../chat/chat.class";
import { Type } from "class-transformer";

@Entity()
export class Mute {

    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ManyToOne(type => User)
    user: User;

    @ManyToOne(type => Chat)
    chat: Chat;

    @Column()
	@IsNotEmpty()
	@IsDate()
	@Type(() => Date)
	muteUntil: Date;
}