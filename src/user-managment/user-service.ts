import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/users.schema';
import { CreateUserdto } from './dtos/CreateUser.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Correctly inject the model
  ) {}
  CreateUser(CreateUserdto:CreateUserdto){
    const newUser=new this.userModel(CreateUserdto);
    return newUser.save();
  }
  
}

