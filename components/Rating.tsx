import { Preferences, userFromFirestore } from "@lib/models";
import { defaults } from "@lib/preferences";
import { db } from "@lib/services/firebase";
import Box from "@mui/material/Box";
import MRating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

// FIXME: todo lo relacionado a tener propias preferencias no funca

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
  const [userPreferences, setUserPreferences] = useState<Preferences>(defaults);

  function getValueLabel(val: number) {
    switch (val) {
      case 1:
        return userPreferences.tierlistNames[1];
      case 2:
        return userPreferences.tierlistNames[2];
      case 3:
        return userPreferences.tierlistNames[3];
      case 4:
        return userPreferences.tierlistNames[4];
      case 5:
        return userPreferences.tierlistNames[5];
      case 6:
        return userPreferences.tierlistNames[6];
      case 7:
        return userPreferences.tierlistNames[7];
      default:
        return "Unkown value";
    }
  }

  useEffect(() => {
    getDoc(doc(db, `usernames/${author}`)).then((_doc) => {
      if (_doc.exists()) {
        getDoc(doc(db, `users/${_doc.data().uid}`)).then((__doc) => {
          setUserPreferences(userFromFirestore(__doc)?.preferences || defaults);
        });
      }
    });
  }, [author]);

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
