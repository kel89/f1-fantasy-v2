import { Schema } from "../../../amplify/data/resource";
import ImageComponent from "../../utils/imageComponent";
export default function ResultsPreview({
    results,
}: {
    results: { results: Schema["Result"]["type"][] };
}) {
    return (
        <div className="bg-white p-4 border shadow-lg">
            <h1 className="text-xl text-gray-500 font-racing">Race Results</h1>
            <table className="table-auto w-full">
                <thead className=" border-b">
                    <tr className="text-left">
                        <th className="text-gray-900 px-3 py-2">Place</th>
                        <th className="text-gray-900 px-3 py-2">Driver</th>
                        <th className="text-gray-900 px-3 py-2">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {(results as any)
                        .sort(
                            (
                                a: Schema["Result"]["type"],
                                b: Schema["Result"]["type"]
                            ) => (b.points || 0) - (a.points || 0)
                        )
                        .slice(0, 10)
                        .map((result: Schema["Result"]["type"], i: number) => {
                            return (
                                <tr
                                    key={i}
                                    className="border-b even:bg-gray-50 transition duration-150 hover:bg-red-100"
                                >
                                    <td className="px-3 py-2 text-gray-900">
                                        {i + 1}
                                    </td>
                                    <td className="sm:px-3 text-xs sm:text-base px-0 py-2 text-gray-900">
                                        <ImageComponent
                                            imageName={`../assets/drivers/${(
                                                result.driver as any
                                            )?.abbreviation?.toLowerCase()}.png`}
                                            imageClasses="inline-block h-8 w-8"
                                        />
                                        {(result.driver as any).first_name}{" "}
                                        {(result.driver as any).last_name}
                                    </td>
                                    <td className="px-3 py-2 text-gray-900">
                                        {result.points}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
