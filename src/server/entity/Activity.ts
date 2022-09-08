import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("activity")
export class Activity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;

    @Column()
    description!: string;

    @Column('bigint')
    created_at!: number;

    @Column('bigint')
    updated_at!: number;

}
