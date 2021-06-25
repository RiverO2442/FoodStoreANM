const Hello = (
  email,
  name,
  country_code,
  paymentID,
  cart,
  currentDate,
  total,
  officialTotal
) => {
  return `
      <!DOCTYPE html>
     <html >
     <head>
    
     </head>
     
    <body style=" font-family: 'Catamaran', sans-serif;
    background-color:#d8dbdb;
    font-size:18px;
    max-width:800px;
    margin:0 auto;
    padding: 2%;
    color:#565859;">
    
    <div id="wrapper" style=" background: #f6faff;">
    <header style="  width:98%;">
      <div id="logo" style="  max-width:220px;
      margin:2% 0 0 5%;">
        <img src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1623071298/QuoteImages/website_logo_w8z8e0.png" style=" max-width:100%;"></img>
      </div>
    </header>


    <div class="one-col" style="padding: 2%;">
      <h1 style=" letter-spacing:1%;">Thank you for placing an order at out shop!</h1>
      <p style="text-align:justify;">Hello!</p>
      <p style="text-align:justify;">
        Your order ${paymentID} has been placed successfully at ${currentDate}
        and we're processing it.
      </p>
      

<h3>Order Details</h3>
<ul>
  <li>Name: ${name}</li>
  <li>Address: ${country_code}</li>
  <li>Email: ${email}</li>
  <li>Total Products: ${cart.length}</li>
  <li>Amount: <s> ${total}$</s></li>
  <li>Official Amount: ${officialTotal}$</li>
</ul>
<h3>Message</h3>
<p style="text-align:justify;">Thank your for trusting us!</p>
      <p style="text-align:justify;">Bon appetit <3</p>
      <div class="button-holder" style=" float:right;
      margin: 0 2% 4% 0;">
        <a class="btn" href="#" target="_blank" style=" float:right;
        background:#303840;
        color:#f6faff;
        text-decoration:none;
        font-weight:700;
        padding:8px 12px;
        border-radius:8px;
        letter-spacing:1px;">
          Learn More
        </a>
      </div>
    </div>

    <div class="line" style="  clear:both;
    height:2px;
    background-color:#e3e9e9;
    margin:4% auto;
    width:96%;"></div>

    <div class="two-col" style=" float:left;
    width:46%;
    padding:2%;">
      <h2>Latest Product News</h2>
      <img src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1623072370/QuoteImages/latestfood_x77uh1.jpg " style=" max-width:100%;"></img>
      <p style="text-align:justify;">
        Explore about more junk food with our variety of menus, always bring
        the best to you with tasty flavor and a reasonable price.
      </p>
    </div>
    <div class="two-col" style=" float:left;
    width:46%;
    padding:2%;">
      <h2>About Services</h2>
      <img src="https://res.cloudinary.com/minh-quang-21-kg/image/upload/v1623072351/QuoteImages/fastfoodbanner_omgd9j.jpg" style=" max-width:100%;"></img>
      <p style="text-align:justify;">
        We're proud to be one of the most reliable customer services provider,
        our shipping service is always available 24/7 and the online payment
        system will help you to get a meal faster and more convenient.
      </p>
    </div>

    <div class="line" style="  clear:both;
    height:2px;
    background-color:#e3e9e9;
    margin:4% auto;
    width:96%;"></div>

    <p class="contact" style=" text-align:center;
    padding-bottom:3%;">
      MamMam Shop <br></br>
      (555) 123-2131 <br></br>
      UIT - TP.HCM <br></br>
      MamMamShop@onlinestore.com
    </p>
  </div>


    </body>

    </html>
      `;
};

module.exports = { Hello };
