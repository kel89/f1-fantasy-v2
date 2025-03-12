import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
// import Button from '@mui/material/Button';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SettingsIcon from "@mui/icons-material/Settings";

import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { fetchUserAttributes } from "aws-amplify/auth";
import { signOut } from "aws-amplify/auth";

interface MainDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const client = generateClient<Schema>();

export default function MainDrawer({ open, setOpen }: MainDrawerProps) {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getAdmin = async () => {
            const userAttributes = await fetchUserAttributes();
            const user = await client.models.User.get({
                id: userAttributes.sub,
            });
            setIsAdmin(user.data?.admin || false);
        };
        getAdmin();
    }, []);

    interface ToggleDrawerEvent {
        type: string;
        key?: string;
    }

    const toggleDrawer =
        (openState: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setOpen(openState);
        };

    const list = () => (
        <Box
            sx={{
                width: "auto",
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/about")}>
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary={"How To Play"} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/settings")}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Settings"} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                {isAdmin ? (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/admin")}>
                            <ListItemIcon>
                                <SettingsSuggestIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Admin"} />
                        </ListItemButton>
                    </ListItem>
                ) : null}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => signOut()}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Sign Out"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Drawer anchor={"left"} open={open} onClose={() => setOpen(false)}>
            {list()}
        </Drawer>
    );
}
