import { useState, useEffect, forwardRef, ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import RosterEditor from "./rosterEditor";

interface TransitionProps {
    children: ReactNode;
}

const Transition = forwardRef<unknown, TransitionProps>(function Transition(
    props,
    ref
) {
    return (
        <Slide direction="up" ref={ref} {...props}>
            {props.children as React.ReactElement}
        </Slide>
    );
});

const client = generateClient<Schema>();

interface ScoreRaceProps {
    raceData: Schema["Race"]["type"];
    drivers: Schema["Driver"]["type"][];
    getRaceData: () => void;
    getDriverData: () => void;
}

export default function ScoreRace({
    raceData,
    drivers,
    getRaceData,
    getDriverData,
}: ScoreRaceProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [driverOrder, setDriverOrder] = useState<string[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set the default driver order
        if (drivers) {
            let _order = getDefaultOrder(
                drivers as unknown as Schema["Driver"]["type"]
            );
            setDriverOrder(_order);
        }
    }, [drivers]);

    const getDefaultOrder = (drivers: any) => {
        let TEAM_ORDER = [
            "Red Bull",
            "Ferrari",
            "McLaren",
            "Mercedes",
            "Aston Martin",
            "Williams",
            "Alpine",
            "Haas",
            "RB",
            "Kick",
        ];
        let _order = drivers
            .sort(
                (a: Schema["Driver"]["type"], b: Schema["Driver"]["type"]) => {
                    let t1 = TEAM_ORDER.indexOf(a.team || "");
                    let t2 = TEAM_ORDER.indexOf(b.team || "");
                    t1 = t1 == -1 ? 100 : t1;
                    t2 = t2 == -1 ? 100 : t2;
                    return t1 - t2;
                }
            )
            .map((dat: any, i: any) => {
                return `${dat.abbreviation}`;
            });
        return _order;
    };

    const saveResultsOrder = async () => {
        setLoading(true);
        const promises = driverOrder?.map(async (driver, i) => {
            let result = {
                id: driver,
                position: i + 1,
                points: mapPositionToPoints(i + 1),
            };
            console.log(result);
            let driverId = getDriverIdFromAbbreviation(driver);
            return client.models.Result.create({
                points: result.points,
                race_id: raceData.id,
                driver_id: driverId,
            });
        });
        if (promises) {
            await Promise.all(promises);
        } else {
            window.alert("there was an issue withe the promises");
            setLoading(false);
        }
        await getRaceData();
        await getDriverData();
        setLoading(false);
    };

    const getDriverIdFromAbbreviation = (abbreviation: string) => {
        let driver = drivers.find((x) => x.abbreviation === abbreviation);
        return driver?.id;
    };

    const mapPositionToPoints = (position: number) => {
        switch (position) {
            case 1:
                return 25;
            case 2:
                return 18;
            case 3:
                return 15;
            case 4:
                return 12;
            case 5:
                return 10;
            case 6:
                return 8;
            case 7:
                return 6;
            case 8:
                return 4;
            case 9:
                return 2;
            case 10:
                return 1;
            default:
                return 0;
        }
    };

    const scoreRosters = async () => {
        setLoading(true);
        const rosters = raceData.rosters.items;
        const promises = rosters.map(async (roster) => {
            let points = calculateRosterPoints(roster.driver_order);
            return client.graphql({
                query: updateRoster,
                variables: { input: { id: roster.id, total_points: points } },
            });
        });
        await Promise.all(promises);
        await getRaceData();
        setLoading(false);
    };

    const calculateRosterPoints = (rosterOrder) => {
        let points = 0;
        rosterOrder = JSON.parse(rosterOrder[0]);
        rosterOrder.forEach((driver) => {
            // Get predicted place
            let [abrev, place] = driver.split("-");
            place = parseInt(place);

            // Find match in results
            let res = driverOrder.findIndex((x) => x.id === abrev);
            let actualPlace = res + 1;
            if (actualPlace == place) {
                points += mapPositionToPoints(place);
            }
        });
        return points;
    };

    const updateUserScores = async () => {
        setLoading(true);
        const rosters = raceData.rosters.items;
        const promises = rosters.map(async (roster) => {
            let user = roster.user.id;
            let result = await client.graphql({
                query: getUser,
                variables: { id: user },
            });
            let totalPoints = result.data.getUser.total_points;
            let newPoints = totalPoints + roster.total_points;
            return client.graphql({
                query: updateUser,
                variables: { input: { id: user, total_points: newPoints } },
            });
        });
        await Promise.all(promises);
        setLoading(false);
    };

    return (
        <>
            <div className="bg-white p-4 border shadow-lg">
                <h1 className="text-xl text-gray-500 font-racing pb-2">
                    Score Race
                </h1>
                <div className="flex flex-row gap-4 pb-4">
                    <button
                        onClick={() => setDialogOpen(true)}
                        className={`bg-blue-500 ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-blue-700"
                        } text-white py-2 px-4 rounded w-1/2`}
                        disabled={loading}
                    >
                        Set Results
                    </button>
                    <button
                        onClick={saveResultsOrder}
                        className={`bg-green-500 ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-green-700"
                        } text-white py-2 px-4 rounded w-1/2`}
                        disabled={loading}
                    >
                        Save
                    </button>
                </div>
                <div className="pb-4">
                    <button
                        onClick={scoreRosters}
                        className={`bg-red-500 ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-red-700"
                        } text-white py-2 px-4 rounded w-full`}
                        disabled={loading}
                    >
                        Score Rosters
                    </button>
                </div>
                <div className="pb-4">
                    <button
                        onClick={updateUserScores}
                        className={`bg-yellow-500 ${
                            loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-yellow-700"
                        } text-white py-2 px-4 rounded w-full`}
                        disabled={loading}
                    >
                        Update User Total Scores
                    </button>
                </div>
            </div>

            <Dialog
                fullScreen
                TransitionComponent={Transition}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDialogOpen(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography
                            sx={{ ml: 2, flex: 1 }}
                            variant="h6"
                            component="div"
                        >
                            Set Winning Order
                        </Typography>
                    </Toolbar>
                </AppBar>
                <RosterEditor
                    driverData={drivers}
                    driverOrder={driverOrder}
                    setDriverOrder={setDriverOrder}
                />
            </Dialog>
        </>
    );
}
