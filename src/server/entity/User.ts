import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

@Entity("user")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 230, unique: true})
    email!: string;

    @Column({type: 'varchar', length: 230})
    name!: string;

    @Column('varchar', {
        nullable: true
    })
    password!: string;

    @Column('varchar', {
        nullable: true
    })
    profile_img!: string;

    @Column('boolean', {
        default: false
    })
    email_verified!: boolean;

    @Column('boolean', {
        default: true
    })
    active!: boolean;

    @Column('boolean', {
        default: false
    })
    interacting!: boolean;

    @Column('timestamp without time zone', {
        nullable: true
    })
    last_interaction!: string;

    @UpdateDateColumn()
    updated_at!: string;
    
    @CreateDateColumn()
    created_at!: string;
    
    @DeleteDateColumn({nullable: true})
    deleted_at?: string;

}
