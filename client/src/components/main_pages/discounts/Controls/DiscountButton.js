import React from "react";
import { Button as CustomButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
  },
  label: {
    textTransform: "none",
  },
}));

const DiscountButton = (props) => {
  const { text, size, color, variant, onClick, ...other } = props;
  const classes = useStyles();
  return (
    <CustomButton
      classes={{ root: classes.root, label: classes.label }}
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      {...other}
    >
      {text}
    </CustomButton>
  );
};

export default DiscountButton;
