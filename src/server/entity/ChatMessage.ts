import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("chat_message")
export class ChatMessageEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;
    
    @Column('integer')
    chat_id!: number;

    @Column('text')
    description!: string;

    @Column('boolean', { default: false })
    seen!: boolean;
    
    @UpdateDateColumn()
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;
}
