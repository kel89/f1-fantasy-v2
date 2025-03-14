import { useEffect, useState } from "react";
import { Schema } from "../../../amplify/data/resource";
import ReactLoading from "react-loading";
import PopUpRosterPreview from "./popupRosterPreview";
// import PopUpRosterPreview from './PopUpRosterPreview';

interface RosterList {
    rosters: Schema["Roster"]["type"][];
}

export default function RosterList({ rosters }: RosterList) {
    const [openPreview, setOpenPreview] = useState(false);
    const [toPreview, setToPreview] = useState<string>();
    const [rosterOwner, setRosterOwner] = useState<string>();

    useEffect(() => {}, [rosters]);

    const showPreview = async (roster: Schema["Roster"]["type"]) => {
        setRosterOwner((roster.user as any).nickname);
        setToPreview((roster as any).id);
        setOpenPreview(true);
    };

    if (!rosters) {
        return (
            <div className="p-4 bg-white border shadow-lg">
                <ReactLoading type="balls" color="red" />
            </div>
        );
    }

    return (
        <>
            <div className="p-4 bg-white border shadow-lg">
                <h2 className="font-racing text-xl text-gray-500">
                    Other Rosters
                </h2>
                <div>
                    {rosters
                        ?.sort(
                            (a, b) =>
                                (b?.total_points ?? 0) - (a?.total_points ?? 0)
                        )
                        .map((ros, i) => {
                            return (
                                <div
                                    className="w-full border-b border-gray-100 flex justify-between cursor-pointer"
                                    onClick={() => showPreview(ros)}
                                    key={i}
                                >
                                    <div>
                                        <div>{(ros.user as any).nickname}</div>
                                    </div>
                                    <div>{ros.total_points}</div>
                                </div>
                            );
                        })}
                </div>
            </div>

            <PopUpRosterPreview
                rosterId={toPreview}
                rosterOwner={rosterOwner}
                open={openPreview}
                setOpen={setOpenPreview}
            />
        </>
    );
}
