import { generateClient } from "aws-amplify/api";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { Layout } from "../utils/layout";

const client = generateClient<Schema>();

export function Home() {
    const [userData, setUserData] = useState<Schema["User"]["type"] | null>(
        null
    );

    useEffect(() => {
        initUser();
    }, []);

    const initUser = async () => {
        await checkUserAndAdd();
    };

    const checkUserAndAdd = async () => {
        const userAttributes = await fetchUserAttributes();
        console.log(userAttributes);
        const user = await client.models.User.get({ id: userAttributes.sub });

        if (user.data === null) {
            // user is not in DB, add them
            let addedUser = await client.models.User.create({
                id: userAttributes.sub,
                email: userAttributes.email,
                givenName: userAttributes.given_name,
                familyName: userAttributes.family_name,
                nickname: userAttributes.nickname,
                total_points: 0,
                admin: false,
            });
            setUserData(addedUser.data);
        } else {
            // User is in DB, just save the data
            setUserData(user.data);
        }
    };

    return <Layout pageName="Home">Home</Layout>;
}
