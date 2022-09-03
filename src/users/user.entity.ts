import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Allow, IsEmail, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Status } from 'src/statuses/status.entity';
import { Password } from './password';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ nullable: true })
  @CreateDateColumn({ name: 'create_date' })
  createdDate: Date;

  @ApiProperty({ nullable: true })
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @ApiProperty({ nullable: true })
  @Column({ name: 'deletedDate' })
  @DeleteDateColumn()
  deletedDate: Date;

  @Exclude()
  get fullName(): string {
    return (
      `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim() ?? this.username
    );
  }

  @ApiProperty({ example: 'John', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'first_name' })
  firstName: string | null;

  @ApiProperty({ example: 'Doe', nullable: true })
  @IsOptional()
  @Column({ nullable: true, name: 'last_name' })
  lastName: string | null;

  @IsOptional()
  @ApiProperty({ example: '1999-12-12 11:11:11' })
  @Column({ type: 'timestamp', nullable: true })
  birthDate?: Date;

  @ApiProperty({ example: 'Male', nullable: true })
  @IsOptional()
  @Column({ nullable: true })
  gender: string | null;

  @Allow()
  @ApiProperty({ example: 'username' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['User'], {
    message: 'username already exists',
    groups: [CrudValidationGroups.CREATE],
  })
  @Column({ unique: true, nullable: true })
  username: string | null;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform((value: string | null) => value?.toLowerCase().trim())
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
    groups: [CrudValidationGroups.CREATE],
  })
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email: string | null;

  @Allow()
  @ApiProperty({ example: '+639506703401', nullable: true })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Column({ nullable: true })
  phoneNo: string | null;

  @ApiProperty({ example: 'Firebase img url' })
  @IsOptional({ groups: [CrudValidationGroups.UPDATE] })
  @IsNotEmpty({ groups: [CrudValidationGroups.CREATE] })
  @Column({
    type: 'text',
    nullable: true,
  })
  img_url: string | null;

  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
  })
  hash: string;

  @ApiHideProperty()
  @OneToOne(() => Status, { nullable: false, cascade: false })
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @ApiHideProperty()
  @OneToMany(() => Password, (p) => p.user)
  @Exclude()
  passwords: Password[];
}
