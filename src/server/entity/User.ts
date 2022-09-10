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

    @UpdateDateColumn()
    updated_at!: Date;
    
    @CreateDateColumn()
    created_at!: Date;
    
    @DeleteDateColumn({nullable: true})
    deleted_at?: Date

}
