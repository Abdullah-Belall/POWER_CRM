"use client";

import { useAppDispatch } from "@/store/hooks/dispatch";
import { useAppSelector } from "@/store/hooks/selector";
import { closeSnakeBar, snakeBarState } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import Slide, { SlideProps } from "@mui/material/Slide";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const Msg = ({ msg, type }: { msg: string; type: SnakeBarTypeEnum }) => {
  return (
    <Alert
      severity={type}
      dir="ltr"
      sx={{
        "& .MuiAlert-icon": {
          margin: "0 6px 0 0",
        },
      }}
      style={{ fontFamily: "poppins" }}
    >
      {msg}
    </Alert>
  );
};

export default function CustomSnackbar() {
  const { isOpen, message, type } = useAppSelector(snakeBarState());
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeSnakeBar());
  };

  return (
    <Snackbar
      open={isOpen}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      slots={{ transition: SlideTransition }}
      message={<Msg msg={message} type={type} />}
      key={message + Date.now()}
      autoHideDuration={3000}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
          justifyContent: "start",
        },
      }}
      className={"!z-[9999999]"}
    />
  );
}
