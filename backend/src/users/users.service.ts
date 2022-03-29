import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginInput } from 'src/common/dtos/login.dto';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
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

      //Generate a JWT and return it to the use
      const token = this.jwtService.sign(user.id);
      return { ok: true, token };
    } catch (error) {
      return { ok: false, error };
    }
  }
  async findById(id: number): Promise<Users> {
    return await this.users.findOne({ id });
  }
  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<Users> {
    const user = await this.users.findOne({ id: userId });
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    return await this.users.save(user);
  }
}
