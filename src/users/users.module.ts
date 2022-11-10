import { Module , MiddlewareConsumer} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth/auth.service';
import { CurrentUserMiddleWare } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService,
    AuthService,
  ]
})
export class UsersModule { 
  configure(consumer : MiddlewareConsumer){
    consumer.apply(CurrentUserMiddleWare).forRoutes('*');
  }
}
