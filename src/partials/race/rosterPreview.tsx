import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Schema } from "../../../amplify/data/resource";
import ImageComponent from "../../utils/imageComponent";

const client = generateClient<Schema>();

interface RosterPreviewProps {
    id: string;
    toggler: number;
}

export default function RosterPreview({ id, toggler }: RosterPreviewProps) {
    const [rosterData, setRosterData] = useState<Schema["Roster"]["type"]>();
    const [drivers, setDrivers] = useState<Schema["Driver"]["type"][]>();
    const [raceResults, setRaceResults] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setTimeout(getData, 500);
    }, [toggler]);

    // Sort the results if there are any?
    useEffect(() => {
        const fillRestults = async () => {
            const raceData = await rosterData?.race();
            const resultsData = await raceData?.data?.result();
            if (resultsData) {
                resultsData.data
                    .sort((a: any, b: any) => b.points - a.points)
                    .forEach((d: any, i: any) => (d["place"] = i + 1));
                setRaceResults(resultsData.data as any);
            }
        };
        fillRestults();
    }, [rosterData]);

    const getData = async () => {
        const result = await client.models.Roster.get({ id: id });
        setRosterData(result.data as any);

        const driverResult = await client.models.Driver.list();
        setDrivers(driverResult.data);
    };

    if (rosterData == undefined || drivers == undefined) {
        return <ReactLoading type="bars" color="red" />;
    }

    const getDriverImage = async (abbreviation: string) => {
        const imagePath = `../../assets/drivers/${abbreviation.toLowerCase()}.png`;
        console.log(imagePath);
        try {
            const image = await import(imagePath);
            return (
                <img
                    className="inline-block h-16 w-16"
                    src={image.default}
                    alt={abbreviation}
                />
            );
        } catch (error) {
            console.log("Caught error:", error);
            return null;
        }
    };

    const getBackgroundColor = (
        driver: Schema["Driver"]["type"],
        place: any
    ) => {
        let match: { place: number }[] = raceResults.filter(
            (x: any) => x?.driver_id === driver.id
        );
        if (match.length > 0) {
            let truePlace = match[0].place;
            if (truePlace == place + 1) {
                return "bg-green-200";
            } else {
                return "bg-red-200";
            }
        }
        return "bg-white";
    };

    return (
        <div className="flex flex-col w-full gap-1">
            {rosterData.driver_order?.slice(0, 10).map((d, i) => {
                let abbreviation = d?.split("-")[0];
                let driver = drivers.find(
                    (x) => x.abbreviation === abbreviation
                );
                if (!driver) {
                    return null;
                }
                const bgClassColor = getBackgroundColor(driver, i);
                return (
                    <div
                        key={i}
                        className={`flex gap-8 items-center border-t border-gray-200 transition duration-300 ease-in-out ${bgClassColor}`}
                    >
                        <div className="font-bold text-gray-800 text-xl pl-1">
                            {i + 1}
                        </div>
                        <ImageComponent
                            imageName={`../assets/drivers/${abbreviation?.toLowerCase()}.png`}
                        />
                        <div className="ml-4 flex flex-col">
                            <div className="text-lg text-gray-800">
                                {driver.first_name} {driver.last_name}
                            </div>
                            <div className="text-gray-500">{driver.team}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
