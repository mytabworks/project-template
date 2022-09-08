import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    @Column('bigint')
    created_at!: number;

    @Column('bigint')
    updated_at!: number;

}
