import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("user_wp_subscription")
export class UserWebPushSubscription {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("integer")
    user_id!: number;

    @Column()
    endpoint!: string;

    @Column({ nullable: true })
    expiration_time!: string;
    
    @Column({ type: "varchar", length: 50})
    key_auth!: string;

    @Column({ type: "varchar", length: 150})
    key_p256dh!: string;

    @UpdateDateColumn()
    updated_at!: Date;

    @CreateDateColumn()
    created_at!: Date;
}
