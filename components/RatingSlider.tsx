import Slider from "@mui/material/Slider";

interface Props {
  value: number;
  onChange?: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  readOnly?: boolean;
}

export default function RatingSlider({ value, onChange, readOnly }: Props) {
  function getValueLabel(val: number) {
    switch (val) {
      case 1:
        return "Unwatchable";
      case 2:
        return "Awful";
      case 3:
        return "Bad";
      case 4:
        return "Good";
      case 5:
        return "Great";
      case 6:
        return "Excellent";
      case 7:
        return "Masterpiece";
      default:
        return "Unkown value";
    }
  }

  return (
    <>
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
    </>
  );
}
