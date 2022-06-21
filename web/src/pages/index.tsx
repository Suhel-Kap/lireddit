import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
    const [{ data }] = usePostsQuery();
    return (
        <div>
            <NavBar />
            Hello World
            <br />
            {!data ? (
                <div>Loading...</div>
            ) : (
                data.posts.map((p) => <div key={p._id}>{p.title}</div>)
            )}
        </div>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
