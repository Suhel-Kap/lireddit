import { Query, Resolver } from "type-graphql";

@Resolver(() => String)
export default class HelloResolver {
    @Query(() => String)
    hello() {
        return "bye graphql";
    }
}