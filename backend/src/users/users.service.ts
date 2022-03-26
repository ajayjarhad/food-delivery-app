import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginInput } from 'src/common/dtos/login.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      //Authentication Guideline//
      //Check if user already exists
      const exists = await this.users.findOne({ email });
      //Return an error
      if (exists) return { ok: false, error: 'The email already exists' };

      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (error) {
      //Return an error
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      //Find the user with email
      const user = await this.users.findOne({ email });
      if (!user) return { ok: false, error: 'User not found' };

      //Check if password is correct
      const correctCredentials = await bcrypt.compare(password, user.password);
      if (!correctCredentials)
        return { ok: false, error: 'Credentials invalid' };
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
    //Generate a JWT and return it to the use
  }
}
