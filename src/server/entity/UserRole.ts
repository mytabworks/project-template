import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("user_role")
export class UserRole {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;
    
    @Column('integer')
    role_id!: number;

    @UpdateDateColumn()
    updated_at!: Date;
    
    @CreateDateColumn()
    created_at!: Date;

    @DeleteDateColumn({nullable: true})
    deleted_at?: Date
}
