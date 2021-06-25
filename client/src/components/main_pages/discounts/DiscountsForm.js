import React, { useState, useEffect, useContext } from "react";

import { Grid, makeStyles } from "@material-ui/core";

import swal from "sweetalert";

import { GlobalState } from "../../../GlobalState";
import axios from "axios";

import Input from "./Controls/Input";

import DatePicker from "./Controls/DatePicker";

import DiscountButton from "./Controls/DiscountButton";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

const initialValues = {
  name: "",
  discountValue: 0,
  minimumValue: 0,
  expireTime: new Date(),
};

const DiscountsForm = ({
  openPopUp,
  setOpenPopUp,
  updateDiscount,
  setUpdateDiscount,
  notify,
  setNotify,
  callback,
  setCallback,
  onEdit,
  setOnEdit,
}) => {
  const state = useContext(GlobalState);

  const [token] = state.token;
  const [values, setValues] = useState(initialValues);

  const [errors, setErrors] = useState({});

  const classes = useStyles();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };

    if ("name" in fieldValues) {
      temp.name = fieldValues.name ? "" : "You must enter the name!";
    }
    if ("discountValue" in fieldValues) {
      temp.discountValue =
        fieldValues.discountValue >= 1 && fieldValues.discountValue <= 100
          ? ""
          : "Discount percent must between 1 to 100!";
    }

    if ("minimumValue" in fieldValues) {
      temp.minimumValue =
        fieldValues.minimumValue > 0 ? "" : "You must enter a value!";
    }
    setErrors({ ...temp });

    if (fieldValues === values)
      return Object.values(temp).every((value) => value === "");
  };

  useEffect(() => {
    if (updateDiscount)
      setValues({
        name: updateDiscount.name,
        discountValue: updateDiscount.discountValue,
        minimumValue: updateDiscount.minimumValue,
        expireTime: new Date(updateDiscount.expireTime),
      });
  }, [updateDiscount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const { name, discountValue, expireTime, minimumValue } = values;
      if (onEdit) {
        try {
          const res = await axios.put(
            `/api/discount/${updateDiscount._id}`,
            {
              name,
              discountValue,
              minimumValue,
              expireTime: expireTime.toDateString(),
              id: updateDiscount._id,
            },
            {
              headers: { Authorization: token },
            }
          );
          setNotify({
            isOpen: true,
            message: onEdit ? "Updated Successfully" : "Created Successfully",
            type: "success",
          });
        } catch (error) {
          swal({
            title: "Error !",
            text: error.response.data.msg,
            icon: "error",
            confirmButtonText: "Yes",
          });
        }
      } else {
        try {
          const res = await axios.post(
            "/api/discount",
            {
              name,
              discountValue,
              minimumValue,
              expireTime: expireTime.toDateString(),
            },
            {
              headers: { Authorization: token },
            }
          );
          setNotify({
            isOpen: true,
            message: onEdit ? "Updated Successfully" : "Created Successfully",
            type: "success",
          });
        } catch (error) {
          swal({
            title: "Error !",
            text: error.response.data.msg,
            icon: "error",
            confirmButtonText: "Yes",
          });
        }
      }

      setOnEdit(false);
      setUpdateDiscount(null);
      resetForm();
      setOpenPopUp(false);
      setCallback(!callback);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return (
    <div>
      <form className={classes.root} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6}>
            <Input
              variant="outlined"
              label="New Discount"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
              type="text"
            ></Input>

            <Input
              type="number"
              variant="outlined"
              label="Discount Value"
              name="discountValue"
              value={values.discountValue}
              onChange={handleChange}
              error={errors.discountValue}
            ></Input>
          </Grid>
          <Grid item xs={6}>
            <Input
              type="number"
              variant="outlined"
              label="Minimum Value"
              name="minimumValue"
              value={values.minimumValue}
              onChange={handleChange}
              error={errors.minimumValue}
            ></Input>
            <DatePicker
              name="expireTime"
              label="Expire Time"
              value={values.expireTime}
              onChange={handleChange}
            ></DatePicker>

            <div style={{ marginTop: "40px", marginLeft: "10px" }}>
              <DiscountButton type="submit" text="Submit"></DiscountButton>
              <DiscountButton
                text="Reset"
                color="default"
                onClick={resetForm}
              ></DiscountButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default DiscountsForm;
