import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  users() {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  createUser(@Args('userInput') userInput: CreateUserInput) {
    return this.usersService.createUser(userInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: number,
    @Args('userInput') userInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.updateUser(id, userInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    return this.usersService.deleteUser(id);
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
