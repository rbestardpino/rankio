import { Preference } from "@lib/preferences";
import { db } from "@lib/services/firebase";
import { InfoOutlined } from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { doc, updateDoc } from "firebase/firestore";
import { useUserData } from "providers/UserProvider";
import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  preference: Preference;
}

export default function StringSetting({ preference }: Props) {
  const { user } = useUserData();

  const [value, setValue] = useState(preference.default);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.value);
    if (!user) return;

    let updateObject: any = {};
    updateObject[`preferences.${preference.key}`] = event.target.value;
    updateDoc(doc(db, `users/${user.uid}`), updateObject);
  };

  useEffect(() => {
    setValue(
      user?.preferences[
        preference.key as
          | "label1"
          | "label2"
          | "label3"
          | "label4"
          | "label5"
          | "label6"
          | "label7"
      ] || preference.default
    );
  }, [user, preference.default, preference.key]);

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
        <TextField
          sx={{ my: 1 }}
          fullWidth
          variant="outlined"
          color="secondary"
          value={value}
          onChange={handleChange}
        />
      }
    />
  );
}
