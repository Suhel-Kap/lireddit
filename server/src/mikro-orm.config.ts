import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"), // path to the folder with migrations
        glob: "!(*.d).{js,ts}",
        disableForeignKeys: false,
    },
    entities: [Post, User],
    dbName: "lireddit",
    user: "suhel",
    password: "8247",
    type: "postgresql",
    debug: !__prod__,
    allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
