import { UserContext } from "@lib/context";
import { Review } from "@lib/models";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import ForkRightOutlinedIcon from "@mui/icons-material/ForkRightOutlined";
import RateReview from "@mui/icons-material/RateReview";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import { MouseEvent, useContext, useState } from "react";

interface Props {
  review: Review;
}

export default function EditReviewButton({ review }: Props) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {(user?.username === review.author && (
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RateReview />}
          href={`/rate/${review.id}?from=${user.username}`}
        >
          {user?.username === review.author ? "Edit" : "Make your own review"}
        </Button>
      )) || (
        <>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RateReview />}
            endIcon={<ArrowDropDownOutlinedIcon />}
            id="button"
            aria-controls={open ? "menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {user?.username === review.author ? "Edit" : "Make one yourself"}
          </Button>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                router.push(`/rate/${review.id}`);
              }}
            >
              <ListItemIcon>
                <FiberNewOutlinedIcon />
              </ListItemIcon>
              <ListItemText>New review</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleClose();
                router.push(`/rate/${review.id}?from=${review.author}`);
              }}
            >
              <ListItemIcon>
                <ForkRightOutlinedIcon />
              </ListItemIcon>
              <ListItemText>Use this review as a base</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
}
