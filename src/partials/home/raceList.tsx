// import { API } from 'aws-amplify';
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
// import RaceCard from "./RaceCard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export default function RaceList({}) {
    const [expanded, setExpanded] = useState(true);
    const [raceData, setRaceData] = useState();

    useEffect(() => {
        getRaceData();
    }, []);

    const getRaceData = async () => {
        const result = await client.models.Race.list();
        console.log(result);
        // setRaceData(result.data.listRaces.items);
    };

    // Comparison date of today, but at midnight so we show
    // the correct next race
    let refDate = new Date();
    refDate.setHours(0);
    refDate.setMinutes(0);

    // return <>Dealing with something else</>;
    return (
        <>
            <Accordion
                expanded={expanded}
                onChange={() => setExpanded(!expanded)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="raceListAccordion"
                >
                    {/* <Typography>
                    Race List
                </Typography> */}
                    <h1 className="font-racing text-2xl text-gray-700">
                        Race List
                    </h1>
                </AccordionSummary>
                <AccordionDetails
                    sx={{ maxHeight: "700px", overflowY: "auto" }}
                >
                    {raceData == undefined ? (
                        <ReactLoading type="balls" color="red" />
                    ) : (
                        <div>
                            {raceData
                                .sort(
                                    (a, b) =>
                                        new Date(a.date) - new Date(b.date)
                                )
                                .filter((x) => new Date(x.date) >= refDate)
                                .filter((d, i) => i == 0)
                                .map((race, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="mb-2 border-2 p-4 border-yellow-500 rounded-lg shadow-lg"
                                        >
                                            <h2 className="font-bold text-gray-500">
                                                Next Race
                                            </h2>
                                            {/* <RaceCard data={race} key={0} /> */}
                                        </div>
                                    );
                                })}
                            <h2 className="font-bold text-gray-500">
                                All Races
                            </h2>
                            <div className="flex flex-col gap-2">
                                {/* {raceData
                                    .sort(
                                        (a, b) =>
                                            new Date(a.date) - new Date(b.date)
                                    )
                                    .map((race, i) => {
                                        return <RaceCard data={race} key={i} />;
                                    })} */}
                            </div>
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
        </>
    );
}
