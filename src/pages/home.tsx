import { generateClient } from "aws-amplify/api";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { Layout } from "../utils/layout";
import RaceList from "../partials/home/raceList";

const client = generateClient<Schema>();

export function Home() {
    const [userData, setUserData] = useState<Schema["User"]["type"] | null>(
        null
    );

    useEffect(() => {
        initUser();
        // addRace(); // this was just to test
    }, []);

    const addRace = async () => {
        // Add a race just to test here
        const race = await client.models.Race.create({
            id: "1",
            date: new Date().toISOString(),
            country: "USA",
            city: "Austin",
            name: "US Grand Prix",
        });
        console.log(race);
    };

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

    return (
        <Layout pageName="Home">
            <div className="p-6 grid sm:grid-cols-2 grid-cols-1 gap-8 bg-gray-100">
                <div>
                    <RaceList />
                </div>
                <div className="flex flex-col gap-8 ">
                    <div>{/* <LeaderBoard /> */}</div>
                    <div>{/* <CommissionersCorner /> */}</div>
                </div>
            </div>
        </Layout>
    );
}
