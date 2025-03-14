import React, { forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import RosterPreview from "./rosterPreview";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef<unknown, TransitionProps>(function Transition(
    props,
    ref
) {
    return (
        <Slide direction="up" ref={ref} {...props}>
            {props.children as React.ReactElement}
        </Slide>
    );
});

interface PopUpRosterPreviewProps {
    rosterId: string | undefined;
    rosterOwner: string | undefined;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function PopUpRosterPreview({
    rosterId,
    rosterOwner,
    open,
    setOpen,
}: PopUpRosterPreviewProps) {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            fullWidth={true}
            maxWidth={"xs"}
            onClose={() => setOpen(false)}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                <span className="font-racing">{rosterOwner}</span>
            </DialogTitle>
            <DialogContent>
                <RosterPreview id={rosterId} toggler={rosterId as any} />
            </DialogContent>
        </Dialog>
    );
}
