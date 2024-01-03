import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity()
export class Picture {

    @PrimaryGeneratedColumn()
    id: number;
 
    @Column()
    filename: string;
 
    @Column({
    type: 'bytea',
    })
    data: Uint8Array;
}