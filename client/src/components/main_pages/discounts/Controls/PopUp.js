import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";

import ActionButton from "./ActionButton";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(2),
    position: "absolute",
    top: theme.spacing(5),
  },
  dialogTitle: {
    paddingRight: "0px",
  },
}));

const PopUp = (props) => {
  const { title, children, openPopUp, setOpenPopUp } = props;
  const classes = useStyles();
  return (
    <>
      <Dialog
        open={openPopUp}
        maxWidth="md"
        classes={{ paper: classes.dialogWrapper }}
      >
        <DialogTitle className={classes.dialogTitle}>
          <div style={{ display: "flex" }}>
            <Typography
              variant="h6"
              component="div"
              style={{ flexGrow: 1, color: "crimson" }}
            >
              {title}
            </Typography>
            <ActionButton color="secondary" onClick={() => setOpenPopUp(false)}>
              <CloseIcon></CloseIcon>
            </ActionButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div>{children}</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopUp;
