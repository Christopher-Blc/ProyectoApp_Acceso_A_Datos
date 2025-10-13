import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './user.entity';

// Define la ruta base para este controller: /users
@Controller('users')
export class UsersController {}
  
