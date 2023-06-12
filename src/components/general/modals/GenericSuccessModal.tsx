import { Box } from "@mui/system";
import React, { useMemo } from "react";
import { generalModalBoxProps } from "./AllDialogBoxes";
import { Modal, Typography } from "@mui/material";
import Image from "next/image";

const GenericSuccessModal = ({
  title = "Changes made successfully",
  text = "Your changes have been made successfully",
  modalType,
  changeModalType,
  changeModalText,
}: generalModalBoxProps) => {
  //because I cannot save a p tag in the global state I've decided to hack it a little bit by providing a string that has <br></br> inside it to be able to split it correctly

  const splitTextArr = useMemo(() => {
    return text
      .split("<br></br>")
      .map((string) => string.replace("<br></br>", ""));
  }, [text]);

  return (
    <Modal
      open={modalType === "generic-success"}
      keepMounted
      onClose={() => changeModalType(null)}
      aria-describedby="alert-dialog-slide-description"
      className="bg-gray-500/40"
    >
      <Box className=" absolute top-1/2 left-1/2 flex h-3/4 w-3/4 translate-x-[-50%] translate-y-[-50%] flex-col space-y-20 rounded-2xl border-2 border-black ">
        <Image
          src={`/general/GenericSuccessModalBG1.png`}
          fill
          style={{ objectFit: "cover" }}
          className="-z-10 rounded-xl brightness-50 filter"
          alt={"Background image for generic success modal for Aftin"}
        />
        <Typography
          className="!mt-4 w-full text-center !font-Handwriting !text-4xl lg:!text-8xl"
          variant="h6"
          component="h2"
        >
          {title}
        </Typography>
        <Typography
          className=" !m-auto  !w-3/4 !text-center !text-xl !tracking-wider "
          id="modal-modal-description"
        >
          {splitTextArr.map((string) => (
            <>
              {string}
              <br></br>
            </>
          ))}
        </Typography>
      </Box>
    </Modal>
  );
};

export default GenericSuccessModal;
