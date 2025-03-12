import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AppBar,
    Box,
    Toolbar,
    Button,
    IconButton,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

/**
 * Render Heading and Drawer for any page to use
 * @param {*} param0
 * @returns
 */
import { ReactNode } from "react";
import MainDrawer from "./mainDrawer";

interface LayoutProps {
    children: ReactNode;
    pageName: string;
}

export function Layout({ children, pageName }: LayoutProps) {
    const naviage = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <>
            <MainDrawer open={open} setOpen={setOpen} />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: "red" }}>
                    <Toolbar>
                        <IconButton
                            onClick={() => setOpen(true)}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            {pageName}
                        </Typography>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => naviage(-1)}
                        >
                            Back
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {children}
        </>
    );
}
