import { UserContext } from "@lib/context";
import { userFromFirestore } from "@lib/models";
import { defaultPreferences } from "@lib/preferences";
import { db } from "@lib/services/firebase";
import Box from "@mui/material/Box";
import MRating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

interface Props {
  value: number;
  onChange?: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  readOnly?: boolean;
  author?: string;
}

export default function Rating({ value, onChange, readOnly, author }: Props) {
  const { user } = useContext(UserContext);
  const [userPreferences, setUserPreferences] = useState(
    JSON.parse(JSON.stringify(defaultPreferences))
  );

  function getValueLabel(val: number) {
    return userPreferences[`label${val as 1 | 2 | 3 | 4 | 5 | 6 | 7}`];
  }

  useEffect(() => {
    getDoc(doc(db, `usernames/${author}`)).then((_doc) => {
      if (_doc.exists()) {
        getDoc(doc(db, `users/${_doc.data().uid}`)).then((__doc) => {
          setUserPreferences(
            userFromFirestore(__doc)?.preferences || defaultPreferences
          );
        });
      }
    });
  }, [author, user]);

  return (
    <>
      {(userPreferences.ratingSystem === "tierlist" && (
        <Slider
          track={false}
          disabled={readOnly}
          aria-label="Rating"
          defaultValue={4}
          value={value}
          valueLabelDisplay="on"
          valueLabelFormat={getValueLabel}
          marks
          min={1}
          sx={{
            ".Mui-disabled": {
              color: "yellow",
            },
            ".MuiSlider-rail": {
              color: "yellow",
            },
          }}
          max={7}
          color="warning"
          onChange={onChange}
        />
      )) || (
        <>
          <MRating
            value={value}
            readOnly={readOnly}
            onChange={(_, value) => {
              if (onChange) onChange(_.nativeEvent, value as number, 0);
            }}
            max={7}
          />
          {value !== null && <Box sx={{ ml: 1 }}>{value}/7</Box>}
        </>
      )}
    </>
  );
}
