import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("user")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column('bigint')
    created_at!: number;

    @Column('bigint')
    updated_at!: number;

}
