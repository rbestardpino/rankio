import StringSetting from "@components/StringSetting";
import UnionSetting from "@components/UnionSetting";
import { Preference, schema } from "@lib/preferences";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import { forwardRef, ReactElement, Ref } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  handleClose: (
    event: React.SyntheticEvent<unknown>,
    reason?: string | undefined
  ) => void;
}

export default function SettingsModal({ open, handleClose }: Props) {
  function getSettingComponent(pref: Preference) {
    switch (pref.type) {
      case "union":
        return <UnionSetting preference={pref} />;
      case "string":
        return <StringSetting preference={pref} />;
      default:
        return <>Unknown setting: {pref.key}</>;
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      disableEscapeKeyDown
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Settings
          </Typography>
          <Button
            autoFocus
            color="inherit"
            variant="outlined"
            startIcon={<SaveOutlined />}
            onClick={handleClose}
          >
            save
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        {schema
          .map((pref) => (
            <ListItem key={pref.key}>{getSettingComponent(pref)}</ListItem>
          ))
          .flatMap((e) => [<Divider key={e.key} />, e])
          .slice(1)}
      </List>
    </Dialog>
  );
}
