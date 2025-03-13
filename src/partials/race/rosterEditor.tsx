import { ReactSortable } from "react-sortablejs";
import { Schema } from "../../../amplify/data/resource";

interface RosterEditorProps {
    rosterData: Schema["Roster"]["type"];
    driverData: Schema["Driver"]["type"];
    driverOrder: string[];
    setDriverOrder: (order: string[]) => void;
}

export default function RosterEditor({
    rosterData,
    driverData,
    driverOrder,
    setDriverOrder,
}: RosterEditorProps) {
    // Any time an order changes, update the state
    // This will force a re-render

    /**
     * All this component has to do is render the drivers in order
     * allow the user to update that order with some interace
     * and save that order in setDriverOrder, then a re-render should be automatic
     */

    return (
        <div className="flex justify-center">
            <div>
                <div className="text-xl font-bold my-1 text-center">
                    Drag and Drop to reorder
                    <br />
                    (only top 10 count)
                </div>
                <ReactSortable
                    list={driverOrder as any}
                    setList={setDriverOrder as any}
                    className="w-56"
                >
                    {driverOrder.map((d, i) => {
                        let driver = driverData.find(
                            (x) => x.abbreviation === d.id
                        );
                        return (
                            <div
                                className={`w-full my-2 border border-gray-300 rounded-sm py-1 px-3 shadow-lg cursor-move
                                    ${i == 0 ? "bg-amber-200" : ""} 
                                    ${i == 1 ? "bg-gray-300" : ""} 
                                    ${i == 2 ? "bg-yellow-500" : ""}
                                    ${i > 2 ? "bg-white" : ""}`}
                                key={d.id}
                            >
                                <b>{i + 1}</b> {driver.first_name}{" "}
                                {driver.last_name}
                            </div>
                        );
                    })}
                </ReactSortable>
            </div>
        </div>
    );
}
