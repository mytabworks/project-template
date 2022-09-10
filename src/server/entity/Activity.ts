import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("activity")
export class Activity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;

    @Column()
    description!: string;

    @UpdateDateColumn()
    updated_at!: Date;
    
    @CreateDateColumn()
    created_at!: Date;

    @DeleteDateColumn({nullable: true})
    deleted_at?: Date

}
