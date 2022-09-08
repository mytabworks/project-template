import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("user_role")
export class UserRole {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    user_id!: number;
    
    @Column('integer')
    role_id!: number;

}
