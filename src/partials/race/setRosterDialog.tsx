import { forwardRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import { ReactNode } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import RosterEditor from "./rosterEditor";
import { fetchUserAttributes } from "aws-amplify/auth";

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

interface SetRosterDialogProps {
    drivers: any;
    open: boolean;
    setOpen: (open: boolean) => void;
    rosterId: string;
    raceId: string;
    refreshRaceData: () => void;
}

export default function SetRosterDialog({
    drivers,
    open,
    setOpen,
    rosterId,
    raceId,
    refreshRaceData,
}: SetRosterDialogProps) {
    const [rosterData, setRosterData] = useState<
        Schema["Roster"]["type"] | null
    >();
    const [driverOrder, setDriverOrder] = useState<string[] | undefined>(
        undefined
    );

    useEffect(() => {
        if (drivers) {
            getData();
        }
    }, [rosterId, drivers]);

    const getData = async () => {
        let _roster;
        if (rosterId) {
            const result = await client.models.Roster.get({ id: rosterId });
            _roster = result.data;
        } else {
            _roster = null;
        }
        setRosterData(_roster);

        // Define default driver order
        let _order = getDefaultOrder(drivers);
        // setDriverOrder(_order);
        if (_roster && hasValidDriverOrder(_roster)) {
            setDriverOrder(_roster?.driver_order || _order);
        } else {
            setDriverOrder(_order);
        }
    };

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

    const hasValidDriverOrder = (roster: Schema["Roster"]["type"]) => {
        if (!roster) {
            return false;
        } else if (!Object.keys(roster).includes("driver_order")) {
            return false;
        } else if (!roster.driver_order) {
            return false;
        } else if (roster?.driver_order.length < drivers.length) {
            return false;
        } else {
            return true;
        }
    };

    // const parseOrder = () => {
    //     if (!driverOrder) {
    //         return;
    //     }
    //     if (typeof driverOrder[0] == "object") {
    //         return driverOrder.map((x: any, i: any) => `${x.id}-${i + 1}`);
    //     }
    //     // else, no change, so just send it
    //     return driverOrder.map((x: any, i) => `${x.id}-${i + 1}`);
    // };

    /**
     * Create a new roster, for this user, this race, and with
     * the given driver order
     */
    const saveNewRoster = async () => {
        const user = await fetchUserAttributes();
        // let newOrder = parseOrder();
        const result = await client.models.Roster.create({
            driver_order: driverOrder,
            total_points: 0,
            user_id: user.sub,
            race_id: raceId,
        });
    };

    /**
     * Use the rosterId to update the roster, chaging only driver_order
     */
    const updateRoster = async () => {
        const user = await fetchUserAttributes();
        // let newOrder = parseOrder();
        const result = await client.models.Roster.update({
            id: rosterId,
            driver_order: driverOrder,
        });
    };

    const save = async () => {
        if (rosterId == undefined || rosterId == "") {
            await saveNewRoster();
        } else {
            await updateRoster();
        }

        refreshRaceData();
        setOpen(false);
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={() => setOpen(false)}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setOpen(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        Set Your Lineup
                    </Typography>
                    <Button autoFocus color="inherit" onClick={save}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            {drivers != undefined && driverOrder != undefined ? (
                <RosterEditor
                    driverData={drivers}
                    driverOrder={driverOrder}
                    setDriverOrder={setDriverOrder}
                />
            ) : null}
        </Dialog>
    );
}
