import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("user_chat")
export class UserChatEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;
    
    @Column('integer')
    chat_id!: number;

    @UpdateDateColumn()
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;
}
