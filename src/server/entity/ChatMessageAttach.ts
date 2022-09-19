import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn} from "typeorm";

@Entity("chat_message_attach")
export class ChatMessageAttachEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    chat_message_id!: number;

    @Column({ type: 'varchar', length: 300 })
    file_url!: string;
    
    @UpdateDateColumn()
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;
}
