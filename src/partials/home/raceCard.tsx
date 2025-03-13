import LockClockIcon from "@mui/icons-material/LockClock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import { Schema } from "../../../amplify/data/resource";

interface RaceCardProps {
    data: Schema["Race"]["type"];
}

export default function RaceCard({ data }: RaceCardProps) {
    const navigate = useNavigate();

    // Determine if this race is LOCKED
    let now = new Date();
    let locked = now > new Date(data.date);

    return (
        <div
            onClick={() => navigate(`/race/${data.id}`)}
            className="w-full border border-gray-200  shadow-lg p-3 flex justify-between cursor-pointer transition ease-in-out duration-300 hover:border-2 hover:border-red-500"
        >
            <div>
                <div className="text-lg">{data.name}</div>
                <div className="text-gray-500">
                    {new Date(data.date).toLocaleDateString()}
                </div>
            </div>
            <div>{locked ? <LockClockIcon /> : <LockOpenIcon />}</div>
        </div>
    );
}
