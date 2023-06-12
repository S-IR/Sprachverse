import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { generalModalBoxProps } from "./AllDialogBoxes";
import { Modal, Typography } from "@mui/material";

const LoginFirstModal = ({
  title = "Login to Access this Feature",
  text = "Please login first in order to access this feature this feature",
  modalType,
  changeModalType,
  changeModalText,
}: generalModalBoxProps) => {
  return (
    <Modal
      open={modalType === "login-first"}
      keepMounted
      onClose={() => changeModalType(null)}
      aria-describedby="alert-dialog-slide-description"
      className="bg-gray-500/40"
    >
      <Box className="bg-gray-700/40 ">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {text}
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginFirstModal;
