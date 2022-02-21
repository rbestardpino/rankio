import { UserContext } from "@lib/context";
import { auth } from "@lib/services/firebase";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import isotipo from "@public/isotipo.svg";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);
  const { asPath } = useRouter();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <Box component="div" sx={{ flexGrow: 1 }}>
              <Image src={isotipo} height={50} width={50} alt="logo" />
            </Box>
          </Link>
          {user && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                color="inherit"
              >
                <Avatar alt={user.displayName} src={user.photoURL} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{ onMouseLeave: handleClose }}
              >
                {/* <Link href={`/${username}`} passHref>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                <MenuItem onClick={handleClose}>{user.username}</MenuItem>
                <Divider></Divider>
                <MenuItem
                  onClick={async () => {
                    handleClose();
                    await signOut(auth);
                  }}
                  dense
                  sx={{ color: "#a2b223" }}
                >
                  Sign out
                </MenuItem>
              </Menu>
            </div>
          )}

          {/* user is not signed OR has not created username */}
          {!user && asPath !== "/login" && (
            <Link href="/login" passHref>
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
