import React, { useState, useContext, useEffect } from "react";

import { GlobalState } from "../../../../GlobalState";

import { Button, Input } from "antd";

import axios from "axios";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

import StarRating from "../CommentStarRating/StarRating";
const { TextArea } = Input;

const Comments = ({ productDetail, comments, setComments, isShow }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user, setUser] = state.userAPI.user;

  const [callback, setCallback] = state.productsAPI.callback;

  const [comment, setComment] = useState("");

  const [commentCallback, setCommentCallback] = useState(false);

  const [rating, setRating] = useState(null);

  const [length, setLength] = useState(0);

  const [starArray, setStarArray] = useState([]);

  const [totalStar, setToTalStar] = useState(0);

  useEffect(() => {
    const getStarArray = (totalComments) => {
      if (totalComments !== null) {
        totalComments.map((comment) => {
          return setStarArray([...starArray, starArray.push(comment.star)]);
        });
      }
    };

    const getToTalStar = (totalComments) => {
      getStarArray(totalComments);
      let tempTotalStar = 0;
      for (let i = 0; i < starArray.length; i++) {
        tempTotalStar += starArray[i];
      }
      setToTalStar(tempTotalStar);
    };

    const getAllComments = async () => {
      const res = await axios.get(`/api/getAllComments/${productDetail._id}`);
      setComments(res.data.comments);
      setLength(res.data.length);
      getToTalStar(res.data.comments);
    };

    getAllComments();
  }, [productDetail, callback]);

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const commentDetail = {
      content: comment,
      writer: user,
      about: productDetail._id,
      star: rating,
      length: length,
      totalStar: totalStar,
    };

    try {
      if (rating !== null) {
        await axios.post("/api/saveComment", commentDetail, {
          headers: { Authorization: token },
        });
        setComment("");
        setCommentCallback(!commentCallback);
        setCallback(!callback);
        setRating(null);
        setStarArray([]);
        setToTalStar(0);
        setLength(0);
      } else {
        alert("Please choose a star valuation!");
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div>
      <br />
      {isShow && <p>{comments.length} replies</p>}
      <hr />

      {/* Comments List */}
      {comments &&
        isShow &&
        comments.map(
          (comment, index) =>
            !comment.responseTo && (
              <>
                <SingleComment
                  comment={comment}
                  productDetail={productDetail}
                  callback={callback}
                  setCallback={setCallback}
                ></SingleComment>
                <ReplyComment
                  comments={comments}
                  productDetail={productDetail}
                  callback={callback}
                  setCallback={setCallback}
                  parentCommentID={comment._id}
                ></ReplyComment>
              </>
            )
        )}

      {/* Comment Form */}
      <br></br>
      <h5>Your comment</h5>
      <StarRating rating={rating} setRating={setRating}></StarRating>

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: "100%", borderRadius: "5px" }}
          placeholder="write some comment"
          value={comment}
          onChange={handleChange}
        ></TextArea>
        <br />

        <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Comments;
