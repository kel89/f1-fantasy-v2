import { generateClient } from "aws-amplify/api";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { Layout } from "../utils/layout";
import RaceList from "../partials/home/raceList";
import LeaderBoard from "../partials/home/leaderboard";

const client = generateClient<Schema>();

export function Home() {
    const [userData, setUserData] = useState<Schema["User"]["type"] | null>(
        null
    );

    useEffect(() => {
        initUser();
        // addRace(); // this was just to test
        // addDrivers();git com
    }, []);

    const addRace = async () => {
        // Add a race just to test here
        const race = await client.models.Race.create({
            id: "2",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            country: "USA",
            city: "Miain",
            name: "Miami Grand Prix",
        });
        console.log(race);
    };

    const addDrivers = async () => {
        // Just for testing setup
        const drivers = [
            // {
            //     id: "1",
            //     first_name: "Lewis",
            //     last_name: "Hamilton",
            //     abbreviation: "HAM",
            //     number: "44",
            //     team: "Ferrari",
            // },
            // {
            //     id: "2",
            //     first_name: "Charles",
            //     last_name: "Leclerc",
            //     abbreviation: "LEC",
            //     number: "16",
            //     team: "Ferrari",
            // },
            // {
            //     id: "3",
            //     first_name: "Max",
            //     last_name: "Verstappen",
            //     abbreviation: "VER",
            //     number: "33",
            //     team: "Red Bull",
            // },
            // {
            //     id: "4",
            //     first_name: "Valtteri",
            //     last_name: "Bottas",
            //     abbreviation: "BOT",
            //     number: "77",
            //     team: "Mercedes",
            // },
            {
                id: "5",
                first_name: "Lando",
                last_name: "Norris",
                abbreviation: "NOR",
                number: "4",
                team: "McLaren",
            },
            {
                id: "6",
                first_name: "Daniel",
                last_name: "Ricciardo",
                abbreviation: "RIC",
                number: "3",
                team: "McLaren",
            },
            {
                id: "7",
                first_name: "Sebastian",
                last_name: "Vettel",
                abbreviation: "VET",
                number: "5",
                team: "Aston Martin",
            },
            {
                id: "8",
                first_name: "Lance",
                last_name: "Stroll",
                abbreviation: "STR",
                number: "18",
                team: "Aston Martin",
            },
            {
                id: "9",
                first_name: "George",
                last_name: "Russell",
                abbreviation: "RUS",
                number: "63",
                team: "Williams",
            },
            {
                id: 10,
                first_name: "Nicholas",
                last_name: "Latifi",
                abbreviation: "LAT",
                number: "6",
                team: "Williams",
            },
            {
                id: 11,
                first_name: "Fernando",
                last_name: "Alonso",
                abbreviation: "ALO",
                number: "14",
                team: "Alpine",
            },
            {
                id: 12,
                first_name: "Esteban",
                last_name: "Ocon",
                abbreviation: "OCO",
                number: "31",
                team: "Alpine",
            },
        ];
        for (let driver of drivers) {
            const result = await client.models.Driver.create(driver as any);
            console.log(result);
        }
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
                email: userAttributes.email || "",
                givenName: userAttributes.given_name || "",
                familyName: userAttributes.family_name || "",
                nickname: userAttributes.nickname || "",
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
                    <div>
                        <LeaderBoard />
                    </div>
                    <div>{/* <CommissionersCorner /> */}</div>
                </div>
            </div>
        </Layout>
    );
}
