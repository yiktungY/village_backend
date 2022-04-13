import "./UpdateProfile.scss";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Button from "@mui/material/Button";
import LoginButton from "../../Button/LoginButton/LoginButton";
import UploadPicture from "../../Posts/UploadPicture/UploadPicture";
import useLogin from "../../../hooks/useLogin";
const SERVER_URL = "http://localhost:8080";

function UpdateProfile(props) {
  const { userInfo, isLoggedIn } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm("");

  const handelUpdate = (data) => {
    const newUpdateInfo = {
      // avatar_url: data.avatar_url,
      givenName: data.givenName,
      familyName: data.familyName,
      displayName: data.displayName,
      age: data.age,
      address: data.address,
    };
    axios
      .put(`${SERVER_URL}/users/${userInfo.id}`, newUpdateInfo, {
        withCredentials: true,
      })
      .then((data) => {
        // setUserInfo(true);
        location.reload();
        props.history.push(`/profile/${userInfo.id}`);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (userInfo) {
      reset({
        displayName: userInfo.displayName,
        familyName: userInfo.familyName,
        givenName: userInfo.givenName,
        age: userInfo.age,
        address: userInfo.address,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    loginFunction();
  }, []);

  return (
    <div className="updatePage">
      <h1 className="headline">Update</h1>
      {isLoggedIn ? (
        <div>
          <UploadPicture userInfo={userInfo} />
          <form
            className="updatePage__form"
            onSubmit={handleSubmit(handelUpdate)}
          >
            <div className="updatePage__box">
              <div>Email: {userInfo.email}</div>
              <div>Display Name: </div>
              <input
                className="inputStyle"
                {...register("displayName", { required: "This is required" })}
              />
              <p>{errors.displayName?.message}</p>
              <div>First Name: </div>
              <input
                className="inputStyle"
                {...register("givenName", { required: "This is required" })}
              />
              <p>{errors.givenName?.message}</p>
              <div>Last Name: </div>
              <input
                className="inputStyle"
                {...register("familyName", { required: "This is required" })}
              />
              <p>{errors.familyName?.message}</p>
            </div>
            <div className="updatePage__box">
              <div>Rating: {userInfo.rating}</div>
              <div>Done Case: {userInfo.doneCase}</div>
              <div>Age: </div>
              <input
                className="inputStyle"
                {...register("age", { required: "This is required" })}
              />
              <p>{errors.age?.message}</p>
              <div>Address: </div>
              <input
                className="inputStyle"
                {...register("address", {
                  required: "This is required",
                })}
              />
              <p>{errors.address?.message}</p>
              <div>Account creates at {userInfo.updated_at}</div>

              <button className="noStyle updateButton" type="submit">
                <Button variant="contained"> Update</Button>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <p>Login to update your profile.</p>
          <LoginButton />
        </>
      )}
    </div>
  );
}

export default UpdateProfile;
