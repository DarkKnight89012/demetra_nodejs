import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { BaseUsersRepository } from './repository/users.repository.abstract.js';
import { UsersRepository } from './repository/users.repository.js';

@Module({
  imports: [
    PassportModule.register({}),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    UsersService,
    {
      provide: BaseUsersRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
