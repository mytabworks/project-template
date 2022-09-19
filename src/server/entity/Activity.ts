import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("activity")
export class ActivityEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;

    @Column()
    description!: string;

    @UpdateDateColumn()
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;

    @DeleteDateColumn({nullable: true})
    deleted_at?: string;

}
