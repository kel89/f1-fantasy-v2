import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Layout } from "../utils/layout";
import ReactLoading from "react-loading";
// import SetRosterDialog from "../Partials/Race/SetRosterDialog";
// import RosterPreview from "../Partials/Race/RosterPreview";
// import RosterList from "../Partials/Race/RosterList";
// import YourRoster from "../Partials/Race/YourRoster";
// import ResultsPreview from "../Partials/Race/ResultsPreview";
// import RaceEditor from "../Partials/Race/RaceEditor";
// import { getRace, getUser, listDrivers } from "../graphql/queries";
// import { getRaceAndRosters } from "../graphql/customQueries";
// import ScoreRace from "../Partials/Race/ScoreRace";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { fetchUserAttributes } from "aws-amplify/auth";
import YourRoster from "../partials/race/yourRoster";
import SetRosterDialog from "../partials/race/setRosterDialog";
import RosterList from "../partials/race/rosterList";
import RaceEditor from "../partials/race/raceEditor";
import ScoreRace from "../partials/race/scoreRace";
import ResultsPreview from "../partials/race/resultsPreview";

const client = generateClient<Schema>();

export default function Race({}) {
    const [userId, setUserId] = useState<string>();
    const [raceData, setRaceData] = useState<Schema["Race"]["type"] | null>(
        null
    );
    const [drivers, setDrivers] = useState<Schema["Driver"]["type"][]>();
    const [openSetRoster, setOpenSetRoster] = useState(false);
    const [refreshState, setRefreshState] = useState(0);
    const [rosterId, setRosterId] = useState<string>();
    const [isAdmin, setIsAdmin] = useState(false);
    const { id } = useParams<{ id: string }>();

    let now = new Date();
    // let now = new Date(2023, 4, 15);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setRefreshState(refreshState + 1);
    }, [openSetRoster]);

    const loadData = async () => {
        await getUserData();
        await getRaceData();
        await getDriverData();
        await updateRosterId();
    };

    const getUserData = async () => {
        const user = await fetchUserAttributes();
        setUserId(user.sub);
        const userData = await client.models.User.get({ id: user.sub });
        setIsAdmin(userData.data?.admin || false);
    };

    const getRaceData = async () => {
        const result = await client.models.Race.get(
            { id: id },
            {
                selectionSet: [
                    "id",
                    "date",
                    "country",
                    "city",
                    "name",
                    "rosters.*",
                    "rosters.user.*",
                    "result.*",
                    "result.driver.*",
                ],
            }
        );
        console.log("Race Data", result.data);
        setRaceData(result.data as any);
    };

    const getDriverData = async () => {
        const result = await client.models.Driver.list();
        console.log("Drivers", result.data);
        setDrivers(result.data);
    };

    // If there is a roster, lets keep track of it
    const updateRosterId = async () => {
        (raceData?.rosters as any)?.find((roster: Schema["Roster"]["type"]) => {
            if (roster.user_id === userId) {
                if (roster.id) {
                    setRosterId(roster.id);
                }
            }
        });
    };

    return (
        <>
            <Layout pageName={raceData == undefined ? "Race" : raceData.city}>
                <div className="p-6 bg-gray-100">
                    {raceData == undefined ? (
                        <ReactLoading type="balls" color="red" />
                    ) : (
                        <>
                            <div className="mb-2">
                                <div className="text-3xl font-racing">
                                    {raceData.name}
                                </div>
                                <div>
                                    {raceData.city}, {raceData.country}
                                </div>
                                <div>
                                    {new Date(
                                        raceData.date
                                    ).toLocaleDateString()}{" "}
                                    {new Date(
                                        raceData.date
                                    ).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                                <div>
                                    <YourRoster
                                        userId={userId || ""}
                                        raceData={raceData}
                                        drivers={drivers || []}
                                        setOpenSetRoster={setOpenSetRoster}
                                        setRosterId={setRosterId}
                                        refreshState={refreshState}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <RosterList
                                        rosters={
                                            !raceData
                                                ? []
                                                : (raceData.rosters as unknown as Schema["Roster"]["type"][])
                                        }
                                    />
                                    {raceData.result?.length > 0 ? (
                                        <ResultsPreview
                                            results={raceData.result as any}
                                        />
                                    ) : null}
                                    {isAdmin ? (
                                        <>
                                            <RaceEditor
                                                raceData={raceData}
                                                getRaceData={getRaceData}
                                            />
                                            {/* <ScoreRace
                                                raceData={raceData}
                                                drivers={drivers}
                                                getRaceData={getRaceData}
                                                getDriverData={getDriverData}
                                            /> */}
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Layout>
            <SetRosterDialog
                drivers={drivers}
                open={openSetRoster}
                setOpen={setOpenSetRoster}
                rosterId={rosterId || ""}
                raceId={id || ""}
                refreshRaceData={getRaceData}
            />
        </>
    );
}
