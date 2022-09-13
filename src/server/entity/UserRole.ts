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
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;

    @DeleteDateColumn({nullable: true})
    deleted_at?: string;
}
