import { useState } from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

interface RaceEditorProps {
    raceData: Schema["Race"]["type"];
    getRaceData: () => void;
}

export default function RaceEditor({ raceData, getRaceData }: RaceEditorProps) {
    const apiClient = generateClient();

    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(dayjs(raceData.date));
    const [country, setCountry] = useState(raceData.country);
    const [city, setCity] = useState(raceData.city);
    const [raceName, setRaceName] = useState(raceData.name);

    const updateData = async () => {
        setLoading(true);

        const dateString = date.toISOString();

        await client.models.Race.update({
            id: raceData.id,
            date: dateString,
            country: country,
            city: city,
            name: raceName,
        });
        await getRaceData();

        setLoading(false);
    };

    const updateCountryText = (val) => {
        setCountry(val.target.value);
    };

    const updateCityText = (val) => {
        setCity(val.target.value);
    };

    const updateRaceNameText = (val) => {
        setRaceName(val.target.value);
    };

    const updateDate = (val) => {
        setDate(val);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="bg-white p-4 border shadow-lg">
                <h1 className="text-xl text-gray-500 font-racing pb-2">
                    Edit Race
                </h1>
                <div className="pb-4">
                    <TextField
                        fullWidth
                        id="newCountry"
                        variant="standard"
                        label="Country"
                        value={country}
                        disabled={loading}
                        onChange={updateCountryText}
                    />
                </div>
                <div className="pb-4">
                    <TextField
                        fullWidth
                        id="newCity"
                        variant="standard"
                        label="City"
                        value={city}
                        disabled={loading}
                        onChange={updateCityText}
                    />
                </div>
                <div className="pb-4">
                    <TextField
                        fullWidth
                        id="newRaceName"
                        variant="standard"
                        label="Date"
                        value={raceName}
                        disabled={loading}
                        onChange={updateRaceNameText}
                    />
                </div>
                <div className="pb-4">
                    <DateTimePicker
                        fullWidth
                        value={date}
                        onChange={updateDate}
                    />
                </div>
                <div className="max-w-xs">
                    <Button
                        loading={loading}
                        variant="outlined"
                        color="success"
                        onClick={updateData}
                    >
                        Update
                    </Button>
                </div>
            </div>
        </LocalizationProvider>
    );
}
