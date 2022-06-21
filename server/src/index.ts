import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import HelloResolver from "./resolvers/hello";
import PostResolver from "./resolvers/post";
import UserResolver from "./resolvers/user";
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";
import { MyContext } from "./types";
import cors from "cors";

const main = async () => {
    // setup database connection and perform migration
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up(); // runs migrations before doing anything else

    // Create a random post in the database
    // const post = orm.em.fork({}).create(Post, {title: "My first post"});
    // await orm.em.persistAndFlush(post);

    const app = express();
    const redisClient = createClient({ legacyMode: true });

    app.use(
        cors({
            origin: [
                "https://studio.apollographql.com",
                "http://localhost:4000",
                "http://localhost:3000",
                "http://localhost:4000/graphql",
            ],
            credentials: true,
        })
    );
    const RedisStore = connectRedis(session);
    //   const redis = new Redis(process.env.REDIS_URL);
    app.set("trust proxy", 1);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: "lax",
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: "aksdjfiqewuhsdzfkjdskfpq",
            resave: false,
        })
    );
    app.set("trust proxy", true); //process.env.NODE_ENV !== "production");
    app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    app.set("Access-Control-Allow-Credentials", true);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });
    await redisClient.connect();
    // starting server before applying middleware
    await apolloServer.start();

    //creates graphql endpoint
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    app.get("/", (_, res) => {
        res.send("Heloo there");
    });

    app.listen(4000, () => {
        console.log("server listening on localhost:4000");
    });
};

main().catch((err) => {
    console.error(err);
});
