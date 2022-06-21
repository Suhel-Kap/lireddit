import { RequiredEntityData } from "@mikro-orm/core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export default class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext) {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("_id") _id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { _id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {
            title,
        } as RequiredEntityData<Post>);
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("_id") _id: number,
        @Arg("title", () => String) title: string, // @Arg("title", () => String, {nullable: true}) if you want to keep some itesms as optional
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { _id });
        if (!post) {
            return null;
        }
        if (typeof title !== undefined) {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("_id") _id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, { _id });
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }
}
