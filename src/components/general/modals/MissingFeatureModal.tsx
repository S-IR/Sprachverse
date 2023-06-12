import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React from "react";
import { generalModalBoxProps } from "./AllDialogBoxes";
import { Fade } from "@mui/material";

interface props {
  text: JSX.Element | null;
  setModalText: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
}
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
const MissingFeatureModal = ({
  title = "Feature not yet available",
  text = "This feature is not yet available. We are sorry for the inconvenience",
  modalType,
  changeModalType,
}: generalModalBoxProps) => {
  return (
    <Modal
      open={modalType === "missing-feature"}
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      onClose={() => changeModalType(null)}
    >
      <Fade in={modalType === "missing-feature"}>
        <Box
          sx={style}
          className={
            "flex flex-col items-center justify-center  rounded-md bg-[url('/modals/MissingFeatureBG.png')] bg-cover text-center align-top "
          }
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
            className="font-serif"
            id="spring-modal-description"
            sx={{ mt: 2 }}
          >
            {text}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MissingFeatureModal;
