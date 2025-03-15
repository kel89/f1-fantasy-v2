import { useState, useEffect } from "react";
import { Layout } from "../utils/layout";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import {
    fetchUserAttributes,
    updateUserAttribute,
    updateUserAttributes,
} from "aws-amplify/auth";

const client = generateClient<Schema>();

export default function Settings() {
    const [user, setUser] = useState<Schema["User"]["type"] | null>();
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const authUser = await fetchUserAttributes();
        const user = await client.models.User.get({ id: authUser.sub });
        setUser(user.data);
        setNewName(user.data?.nickname || "");
        setLoading(false);
    };

    const updateTextBox = (val: any) => {
        setNewName(val.target.value);
    };

    const changeName = async () => {
        setLoading(true);

        // Update AUTH
        await updateUserAttributes({
            userAttributes: {
                nickname: newName,
            },
        });

        // Update DB
        await client.models.User.update({
            id: user?.id,
            nickname: newName,
        });

        setLoading(false);
    };

    return (
        <>
            <Layout pageName="Settings">
                <div className="p-6 grid sm:grid-cols-2 grid-cols-1 gap-8 bg-gray-100">
                    <div className="border border-gray rounded-lg p-2 bg-white m-1 shadow-lg gap-2 grid grid-cols-1">
                        <h1 className="font-racing text-xl text-gray-700">
                            Change Nickname
                        </h1>
                        <TextField
                            id="newnickname"
                            variant="standard"
                            label="New Nickname"
                            value={newName}
                            disabled={loading}
                            onChange={updateTextBox}
                        />
                        <div className="max-w-xs">
                            <Button
                                loading={loading}
                                variant="outlined"
                                color="success"
                                onClick={changeName}
                            >
                                Change Name
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
