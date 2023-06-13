import { Box } from "@mui/system";
import React from "react";
import { galleryImageDialog } from "../SiteGallery";
import { generalModalBoxProps } from "./AllDialogBoxes";

import { Fade, Modal, Typography } from "@mui/material";
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
const ServerErrorModal = ({
  title = "Internal server error",
  text = " An internal server error has occurred. Please try again later.",
  changeModalType,
  modalType,
  changeModalText,
}: generalModalBoxProps) => {
  return (
    <Modal
      open={modalType === "server-error"}
      keepMounted
      onClose={() => changeModalType(null)}
      aria-describedby="alert-dialog-slide-description"
    >
      <Fade in={modalType === "server-error"}>
        <Box
          sx={style}
          className="flex flex-col items-center justify-center rounded-md bg-red-600/40 bg-cover align-top"
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

export default ServerErrorModal;
