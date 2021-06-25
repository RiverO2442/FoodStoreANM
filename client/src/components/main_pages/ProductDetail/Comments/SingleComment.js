import React, { useState, useContext } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import axios from "axios";

import { GlobalState } from "../../../../GlobalState";

import ProductItemStarRating from "../../Utils/productItem/ProductItemStarRating/ProductItemStarRating";

const { TextArea } = Input;

const SingleComment = ({ comment, productDetail, callback, setCallback }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;

  const [user, setUser] = state.userAPI.user;

  const [commentValue, setCommentValue] = useState("");

  const [openReply, setOpenReply] = useState(false);

  const toggleReply = () => {
    setOpenReply(!openReply);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    const commentDetail = {
      content: commentValue,
      writer: user,
      about: productDetail._id,
      responseTo: comment._id,
    };

    try {
      await axios.post("/api/saveComment", commentDetail, {
        headers: { Authorization: token },
      });
      setCommentValue("");
      setCallback(!callback);
      setOpenReply(!openReply);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  const action = [
    <span onClick={toggleReply} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  const handleChange = (event) => {
    setCommentValue(event.target.value);
  };
  return (
    <div>
      <Comment
        actions={action}
        author={comment.writer.name}
        avatar={<Avatar src={comment.writer.avatar} alt="commentor image" />}
        content={<p>{comment.content}</p>}
      ></Comment>

      <ProductItemStarRating rating={comment.star}></ProductItemStarRating>

      {/* Comment Form */}
      {openReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: "100%", borderRadius: "5px" }}
            placeholder="write some comment"
            value={commentValue}
            onChange={handleChange}
          ></TextArea>
          <br />
          <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
};

export default SingleComment;
