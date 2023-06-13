import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Modal, Typography } from "@mui/material";
import { generalModalBoxProps } from "./AllDialogBoxes";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  boxShadow: 24,
  p: 2,
};
const GenericErrorModal = ({
  title = "An error has occurred",
  text = "Please try again later. If the error persists then please contact us through a support ticket",
  modalType,
  changeModalType,
  changeModalText,
}: generalModalBoxProps) => {
  return (
    <Modal
      open={modalType === "generic-error"}
      keepMounted
      onClose={() => changeModalType(null)}
      aria-describedby="alert-dialog-slide-description"
    >
      <Fade in={modalType === "generic-error"}>
        <Box
          sx={style}
          className="flex flex-col items-center justify-center rounded-md bg-[url('/modals/ErrorModal.svg')] bg-cover align-top"
        >
          <Typography
            id="spring-modal-title"
            variant="h6"
            component="h2"
            className="font-Handwriting text-2xl text-orange-300 lg:text-6xl"
          >
            {title}
          </Typography>
          <Typography
            id="modal-modal-description"
            className="font-serif"
            sx={{ mt: 2 }}
          >
            {text}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default GenericErrorModal;
