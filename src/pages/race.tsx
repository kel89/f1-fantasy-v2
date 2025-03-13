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

const client = generateClient<Schema>();

export default function Race({}) {
    const [raceData, setRaceData] = useState<Schema["Race"]["type"]>();
    const [drivers, setDrivers] = useState<Schema["Driver"]["type"][]>();
    const [openSetRoster, setOpenSetRoster] = useState(false);
    const [refreshState, setRefreshState] = useState(0);
    const [rosterId, setRosterId] = useState();
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
    };

    const getUserData = async () => {
        const user = await fetchUserAttributes();
        const userData = await client.models.User.get({ id: user.sub });
        setIsAdmin(userData.data?.admin || false);
    };

    const getRaceData = async () => {
        const result = await client.models.Race.get({ id: id });
        console.log(result);
        setRaceData(result.data);
    };

    const getDriverData = async () => {
        const result = await client.models.Driver.list();
        console.log(result);
        setDrivers(result.data);
    };

    // const getDriverData = async () => {
    //     const result = await apiClient.graphql({
    //         query: listDrivers,
    //     });
    //     setDrivers(result.data.listDrivers.items);
    // };

    // const getRaceData = async () => {
    //     const result = await apiClient.graphql({
    //         query: getRaceAndRosters,
    //         variables: { id: id },
    //     });
    //     console.log(result);
    //     setRaceData(result.data.getRace);
    // };

    // const getAdminStatus = async () => {
    //     const result = await apiClient.graphql({
    //         query: getUser,
    //         variables: { id: user.username },
    //     });
    //     setIsAdmin(result.data.getUser.admin);
    // };

    /**
     * Decides if should show a button to create your roster,
     * or, if you already have one, lets show that
     */
    const renderYourRoster = () => {
        if (!raceData) {
            return;
        }
        const setButton = (
            <button
                onClick={() => setOpenSetRoster(true)}
                className="btn w-full text-center py-2 border-2 rounded-lg border-dashed border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
                Set Your Roster!
            </button>
        );

        // No rosters at all, so show button
        if (raceData.rosters.length == 0) {
            return setButton;
        }

        // Rosters, but not one for this user, show button
        let userRoster = raceData.rosters.find(
            (x) => x.user.id == user.username
        );
        if (userRoster == undefined) {
            return setButton;
        }

        // This use has a roster, so show the preview
        const click = () => {
            setRosterId(userRoster.id);
            setOpenSetRoster(true);
        };
        return (
            <div className="p-4 bg-white border rounded-lg">
                <button
                    onClick={click}
                    className="btn w-full py-2 mb-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
                >
                    Edit Roster
                </button>
                <RosterPreview id={userRoster.id} toggler={refreshState} />
            </div>
        );
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
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                                <div>
                                    {/* <YourRoster
                                        raceData={raceData}
                                        drivers={drivers}
                                        setOpenSetRoster={setOpenSetRoster}
                                        setRosterId={setRosterId}
                                        refreshState={refreshState}
                                    /> */}
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* <RosterList
                                        rosters={
                                            !raceData
                                                ? []
                                                : raceData.rosters?.items
                                        }
                                    /> */}
                                    {/* {raceData.result?.items.length > 0 ? (
                                        <ResultsPreview
                                            results={raceData.result?.items}
                                        />
                                    ) : null} */}
                                    {isAdmin ? (
                                        <>
                                            {/* <RaceEditor
                                                raceData={raceData}
                                                getRaceData={getRaceData}
                                            /> */}
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
            {/* <SetRosterDialog
                drivers={drivers}
                open={openSetRoster}
                setOpen={setOpenSetRoster}
                rosterId={rosterId}
                raceId={id}
                refreshRaceData={getRaceData}
            /> */}
        </>
    );
}
