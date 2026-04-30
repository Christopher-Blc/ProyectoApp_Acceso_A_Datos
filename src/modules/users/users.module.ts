import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Membership } from '../membership/entities/membership.entity';
import { Reservation } from '../reservationtiontion/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Membership, Reserva]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}



