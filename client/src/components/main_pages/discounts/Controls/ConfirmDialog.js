import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import React from "react";

import DiscountButton from "./DiscountButton";

const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "absolute",
    top: theme.spacing(14),
    padding: theme.spacing(5),
  },
  dialogContent: {
    textAlign: "center",
  },
  dialogTitle: {
    textAlign: "center",
  },
  dialogActions: {
    justifyContent: "center",
  },
  dialogIcon: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(3),
    "&:hover": {
      cursor: "default",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "7rem",
    },
  },
}));

const ConfirmDialog = (props) => {
  const { confirmDialog, setConfirmDialog } = props;

  const classes = useStyles();
  return (
    <div>
      <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
        <DialogTitle className={classes.dialogTitle}>
          <IconButton className={classes.dialogIcon} disableRipple>
            <HighlightOffIcon></HighlightOffIcon>
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography variant="h6">{confirmDialog.title}</Typography>
          <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <DiscountButton
            text="Yes"
            color="secondary"
            onClick={confirmDialog.onConfirm}
          ></DiscountButton>
          <DiscountButton
            text="No"
            color="default"
            onClick={() =>
              setConfirmDialog({ ...confirmDialog, isOpen: false })
            }
          ></DiscountButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
