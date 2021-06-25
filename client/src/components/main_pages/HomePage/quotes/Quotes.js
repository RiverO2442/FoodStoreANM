import React, { useState, useEffect } from "react";
import "./Quotes.css";

const Quotes = () => {
  const [quote, setQuote] = useState([]);

  useEffect(() => {
    getQuote();
  }, []);

  const getQuote = () => {
    let url = "http://localhost:3004/quotes";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let quotesArray = data;
        let randomNumber = Math.floor(Math.random() * quotesArray.length);
        let randomQuote = quotesArray[randomNumber];
        setQuote(randomQuote);
      });
  };

  return (
    <div id="quote-box">
      <div id="quote-img">
        <img src={quote.imageURL}></img>
      </div>
      <div id="text">
        <p>{quote.content}</p>
        <div id="author">
          <p>{quote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
