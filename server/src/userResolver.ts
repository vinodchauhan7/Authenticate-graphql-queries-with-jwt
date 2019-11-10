import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  UseMiddleware,
  Ctx
} from "type-graphql";
import { sign } from "jsonwebtoken";
import { hash, compare } from "bcryptjs";
import { User } from "./entity/User";
import { isAuth } from "./isAuth";
import { MyContext } from "./MyContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async Me(@Ctx() { payload }: MyContext) {
    return `Your user id : ${payload!.userId}`;
  }

  @Mutation(() => Boolean)
  async Register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 13);
    // let user = null;
    try {
      await User.insert({
        name,
        email,
        password: hashedPassword
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async Login(@Arg("email") email: string, @Arg("password") password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Could not find user");
    }

    const verify = await compare(password, user.password);

    if (!verify) {
      throw new Error("Bad password");
    }

    return {
      accessToken: sign({ userId: user.id }, "MySecretKey", {
        expiresIn: "15m"
      })
    };
  }
}
