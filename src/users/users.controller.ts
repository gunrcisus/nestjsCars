import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService , private authService:AuthService){}

    @UseGuards(AuthGuard)
    @Get('/whoami')
     whoami(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    async signOut(@Session() session: any){
       session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
       const user = await this.authService.signup(body.email,body.password);
       session.userId = user.id;
       return user;
    }

     @Post('/signin')
     async signin(@Body() body: CreateUserDto, @Session() session: any){
       const user = await this.authService.signin(body.email,body.password);
       session.userId = user.id;
       return user;
    }

   
    @Get('/:id')
    async findUser(@Param('id') id:string ){
        const user = await this.userService.findOne(+id);
        if(!user){
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    async findAllUsers(@Query('email') email:string){
        const user = await this.userService.find(email);
        if(!user){
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string ,@Body() body: UpdateUserDto){
        return this.userService.update(+id, body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.userService.remove(+id);
    }
}
