import { Layout } from "../utils/layout";
export default function About({}) {
    return (
        <>
            <Layout pageName="About">
                <div className="p-6 gap-8 bg-gray-100 w-full flex justify-center">
                    <div className="bg-white border rounded-sm p-5 w-full max-w-5xl shadow-lg">
                        <h1 className="text-3xl font-racing text-gray-700">
                            How To Play
                        </h1>
                        <p>
                            For each race, set your driver roster to match your
                            prediction for the finishing ordering--thats it!
                            Only the top 10 finishers will be awarded points,
                            and points will be awarded how they are awarded in
                            the Driver's Championship. You will be able to make
                            changes to your roster up until the start time for
                            the race, after which point the roster will be
                            locked.
                        </p>
                        <br />
                        <h1 className="text-3xl font-racing text-gray-700">
                            Points Breakdown
                        </h1>
                        <p>
                            Points are awarded based on finishing position as
                            outline below:
                        </p>
                        <table className="table-auto w-36">
                            <thead className="border-b">
                                <th className="text-gray-700 px-3 py-2">
                                    Place
                                </th>
                                <th className="text-gray-700 px-3 py-2">
                                    Points
                                </th>
                            </thead>
                            <tbody>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        1st
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        25
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        2nd
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        18
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        3rd
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        15
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        4th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        12
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        5th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        10
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        6th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        8
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        7th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        6
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        8th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        4
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        9th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        2
                                    </td>
                                </tr>
                                <tr className="border-b odd:bg-gray-50 transition duration-150 hover:bg-red-50">
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        10th
                                    </td>
                                    <td className="px-3 py-1 text-gray-600 text-sm">
                                        1
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <h1 className="text-3xl font-racing text-gray-700">
                            Why We Play
                        </h1>
                        <p>
                            The official F1 Fantasy game is very complicated,
                            with budgets and turbo drivers, mega drivers,
                            streaks, teammate comparisons, etc., when really all
                            we want to do is root for our favorites and see if
                            we can predict a winner. Thats why I made this game
                            to be exactly that--and I sucked at the real one.
                        </p>
                        <br />
                        <h1 className="text-3xl font-racing text-gray-700">
                            Issues?
                        </h1>
                        <p>Deal with it--or call me</p>
                    </div>
                </div>
            </Layout>
        </>
    );
}
