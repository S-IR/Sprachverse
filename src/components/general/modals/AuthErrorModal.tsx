import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { Fade, Modal, Typography } from "@mui/material";
import { generalModalBoxProps } from "./AllDialogBoxes";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const AuthErrorModal = ({
  title = "Authentication Error",
  text = "There was an error trying to authenticate your your given information. Make sure your email and password is correct try again later ",
  modalType,
  changeModalType,
}: generalModalBoxProps) => {
  return (
    <Modal
      open={modalType === "auth-error"}
      keepMounted
      onClose={() => changeModalType(null)}
      aria-describedby="alert-modal-slide-description"
      className="bg-gray-500/40"
    >
      <Fade in={modalType === "auth-error"}>
        <Box className="rounded-md !bg-black/20" sx={style}>
          <Typography
            // id="modal-modal-title"
            className="!font-Handwriting !text-center !text-4xl lg:!text-6xl"
            variant="h6"
            component="h2"
          >
            {title}
          </Typography>
          <Typography
            className="!text-center !font-serif !text-lg"
            id="modal-modal-description"
            sx={{ mt: 4 }}
          >
            {text}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AuthErrorModal;
