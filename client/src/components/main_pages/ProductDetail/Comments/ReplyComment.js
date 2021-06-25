import React, { useState, useEffect } from "react";

import SingleComment from "./SingleComment";

const ReplyComment = ({
  comments,
  productDetail,
  callback,
  setCallback,
  parentCommentID,
}) => {
  const [childCommentNumber, setChildCommentNumber] = useState(0);

  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    comments.map((comment) => {
      if (comment.responseTo === parentCommentID) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [comments]);

  const handleClick = () => {
    setOpenReplyComments(!openReplyComments);
  };

  return (
    <div>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={handleClick}
        >
          View more {childCommentNumber} comment(s)
        </p>
      )}

      {/* Comments List */}
      {openReplyComments && (
        <div>
          {comments &&
            comments.map((comment, index) => (
              <div style={{ marginLeft: "50px", width: "80%" }}>
                {comment.responseTo === parentCommentID && (
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
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReplyComment;
