import React, { useState, useEffect } from "react";
import "./Loading.css";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  }, []);
  return (
    <>
      {loading ? (
        <div className="HashLoader">
          <HashLoader color={"#ff6f00"} loading={loading} size={60} />
        </div>
      ) : (
        <div className="loader-title">
          <h1>There is nothing to shown !</h1>
        </div>
      )}
    </>
  );
};

export default Loading;
