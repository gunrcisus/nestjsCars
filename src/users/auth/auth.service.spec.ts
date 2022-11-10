import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { BadRequestException ,NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService:Partial<UsersService> ;

  beforeEach(async () => {
    const users : User[] =[];
    fakeUsersService = {
      find: (email :string)=> {
        const filteredUsers = users.filter(user=> user.email === email);
        return Promise.resolve(filteredUsers)
      },
      create:(email:string , password:string)=> {
        const user = {
          id: Math.floor(Math.random()*999999) ,
            email ,
            password
          } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide : UsersService , // if any one is asking for the user service
          useValue:fakeUsersService // we provide them the fakeUsersService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user aith a salted and hashed password',async()=>{
    const user = await service.signup('test@test.com' , '1234');
    expect(user.password).not.toEqual('1234');
    const [salt , hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });


  it('should throw an error if user signs up with existing email' , async()=>{
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException,);
  });

  it('should throw an error if signin is called with an unused email' , async()=>{
     await expect(service.signin('omer123@omer.com', '123456')).rejects.toThrow(NotFoundException);

  });
  it('should throw an error if an invalid password is provided' , async()=>{
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(service.signin('laskdjf@alskdfj.com', 'passowrd1')).rejects.toThrow(BadRequestException);

  });

  it('should return a user  if a correct password is provided' , async()=>{
      await  service.signup('asdf@asdf.com', 'mypassowrd');
      const user = await  service.signin('asdf@asdf.com', 'mypassowrd');
      expect(user).toBeDefined();
  });


});
