import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity()
export class Picture {

    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @Column('bytea', { nullable: false })
    imageData: Buffer;
}