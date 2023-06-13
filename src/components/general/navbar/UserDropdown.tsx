import useAuth from "@/hooks/useAuth";
import { Menu, MenuItem } from "@mui/material";
import React from "react";

interface props {
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const UserDropdown = ({ anchorEl, setAnchorEl }: props) => {
  const open = anchorEl !== null && anchorEl.id === "user-dropdown";
  const handleClose = () => setAnchorEl(null);
  const [signUp, signIn, logout, loading] = useAuth();
  return (
    <Menu
      aria-labelledby="user-dropdown"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <MenuItem onClick={handleClose}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          handleClose();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserDropdown;
