import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@lib/context";
import { signOut } from "@lib/services/auth";
import {
  Badge,
  Avatar,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material/";
import { NotificationsActiveOutlined } from "@mui/icons-material/";
import Link from "next/link";
import Image from "next/image";
import isotipo from "../public/isotipo-inverted.png";

export default function Navbar() {
  const { user, username } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { asPath } = useRouter();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/">
            <Box component="div" sx={{ flexGrow: 1 }}>
              <Image src={isotipo} height={50} width={50} />
            </Box>
          </Link>
          {/* user is signed-in and has username */}
          {username && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt={user?.displayName} src={user?.photoURL} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link href={`/${username}`}>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <Divider></Divider>
                <MenuItem onClick={signOut} dense sx={{ color: "#a2b223" }}>
                  Sign out
                </MenuItem>
              </Menu>
            </div>
          )}

          {/* user is not signed OR has not created username */}
          {!username && asPath !== "/login" && (
            <Link href="/login">
              <Button variant="outlined" color="inherit">
                Login
              </Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
