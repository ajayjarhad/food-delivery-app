import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/jwt/jwt.module';
import { Users } from './entities/users.entity';
import { UsersResolvers } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), ConfigService, JwtModule],
  providers: [UsersService, UsersResolvers],
  exports: [UsersService],
})
export class UsersModule {}
