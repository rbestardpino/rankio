import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { ChangeEvent } from "react";

interface Props {
  checked: boolean;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export default function PersonalFav({ checked, readOnly, onChange }: Props) {
  return (
    <Tooltip
      arrow
      title="Personal favorite"
      disableFocusListener
      enterTouchDelay={0}
    >
      <Checkbox
        readOnly={readOnly}
        disableRipple={readOnly}
        sx={readOnly ? { cursor: "default" } : { cursor: "pointer" }}
        icon={<FavoriteBorder sx={{ color: "yellow" }} />}
        checkedIcon={<Favorite sx={{ color: "yellow" }} />}
        inputProps={{ "aria-label": "controlled" }}
        checked={checked}
        onChange={onChange}
      />
    </Tooltip>
  );
}
