import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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
}
