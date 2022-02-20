import Slider from "@mui/material/Slider";

export default function RatingSlider({ value, onChange, readOnly }) {
  // TODO: make this user customizable
  function getValueLabel(value) {
    switch (value) {
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
