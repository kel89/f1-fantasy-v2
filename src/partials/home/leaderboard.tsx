import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export default function LeaderBoard({}) {
    const [usersData, setUsersData] = useState<Schema["User"]["type"][]>();
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        getUsersData();
    }, []);

    const getUsersData = async () => {
        const result = await client.models.User.list();
        setUsersData(result.data);
    };

    return (
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="raceListAccordion"
            >
                <h1 className="font-racing text-2xl text-gray-700">
                    Leaderboard
                </h1>
            </AccordionSummary>
            <AccordionDetails>
                {usersData == undefined ? (
                    <ReactLoading type="balls" color="red" />
                ) : (
                    <table className="table-auto w-full">
                        <thead className="border-b">
                            <tr className="text-left bg-gray-100">
                                <th className="text-gray-900 px-3 py-2">
                                    User
                                </th>
                                <th className="text-gray-900 px-3 py-2">
                                    Points
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData
                                .sort((a, b) => b.total_points - a.total_points)
                                .map((u, i) => {
                                    return (
                                        <tr
                                            key={i}
                                            className="border-b even:bg-gray-50 transition duration-150 hover:bg-red-100"
                                        >
                                            <td className="px-3 py-2">
                                                {u.nickname}
                                            </td>
                                            <td className="px-3 py-2">
                                                {u.total_points}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                )}
            </AccordionDetails>
        </Accordion>
    );
}
