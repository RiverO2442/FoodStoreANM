import React from "react";
import { makeStyles, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(15),
  },
}));

const Notification = (props) => {
  const { notify, setNotify } = props;

  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason !== "clickaway") {
      setNotify({
        ...notify,
        isOpen: false,
      });
    }
  };

  return (
    <div>
      <Snackbar
        className={classes.root}
        open={notify.isOpen}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert severity={notify.type} onClose={handleClose}>
          {notify.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Notification;
