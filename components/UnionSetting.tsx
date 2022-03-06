import { UserContext } from "@lib/context";
import { Preference } from "@lib/preferences";
import { db } from "@lib/services/firebase";
import { InfoOutlined } from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import { doc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

interface Props {
  preference: Preference;
}

export default function UnionSetting({ preference }: Props) {
  const { user } = useContext(UserContext);

  const [option, setOption] = useState(preference.default);
  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value);
    if (!user) return;

    let updateObject: any = {};
    updateObject[`preferences.${preference.key}`] = event.target.value;
    updateDoc(doc(db, `users/${user.uid}`), updateObject);
  };

  useEffect(() => {
    setOption(
      user?.preferences[preference.key as "ratingSystem"] || preference.default
    );
  }, [user]);

  return (
    <ListItemText
      primary={
        <>
          {preference.name}
          <Tooltip
            arrow
            title={preference.description}
            disableFocusListener
            enterTouchDelay={0}
            leaveTouchDelay={6000}
          >
            <InfoOutlined sx={{ fontSize: 13, ml: 1 }} color="disabled" />
          </Tooltip>
        </>
      }
      secondary={
        <Select
          sx={{ my: 1 }}
          fullWidth
          value={option}
          onChange={handleChange}
          color="secondary"
        >
          {preference.options?.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      }
    />
  );
}
