import { Field, InputType, Mutation, Query, Resolver, Arg, Ctx, ObjectType } from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { RequiredEntityData, t } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@Resolver(() => User)
export default class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { em, req }: MyContext
    ) {
        //if you aren't logged in
        if (!req.session.userId) {
            return null
        }

        const user = await em.findOne(User, { _id: req.session.userId })
        return user
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "username length less that 3 digits invalid"
                }]
            }
        }

        if (options.password.length <= 6) {
            return {
                errors: [{
                    field: "password",
                    message: "password length less that 6 digits invalid"
                }]
            }
        }

        const hashPw = await argon2.hash(options.password);
        let user
        // When using mikroOrm to insert
        // const user = em.create(User, {
        //     username: options.username,
        //     password: hashPw
        // } as RequiredEntityData<User>);
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                username: options.username,
                password: hashPw,
                created_at: new Date(),
                updated_at: new Date()
            }).returning("*")
            user = result[0]
            // await em.persistAndFlush(user)
        } catch (err) {
            // username exists
            if (err.code === '23505' || err.detail.includes("already exists.")) {
                return {
                    errors: [{
                        field: "username",
                        message: "Username already exists"
                    }]
                }
            }
        }

        req.session.userId = user._id
        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "Username does not exist"
                }]
            }
        }
        const valid = await argon2.verify(user.password, options.password)
        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "Incorrect password"
                }]
            }
        }

        req.session.userId = user._id;

        return {
            user,
        }
    }

}