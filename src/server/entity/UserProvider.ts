import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("user_provider")
export class UserProvider {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;

    @Column('varchar')
    type!: 'google' | 'facebook' | 'twitter' | 'instagram';

    @Column('varchar')
    uid!: string;

    @UpdateDateColumn()
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;

    @DeleteDateColumn({nullable: true})
    deleted_at?: string;
}
