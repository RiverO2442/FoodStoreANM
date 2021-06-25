Author: Chau Minh Quang  - Nguyen Anh Hao

#demo-link: https://fastfoodstore-ecommerce.herokuapp.com/?fbclid=IwAR2h8LAa0WRp4q-Sazet90D7fTgYCdr0tsFmhfQtk0mpiGvW0gzp5WnWeLA

Install dependencies for server
npm install
Install dependencies for client
cd client ---> npm install
Connect to your mongodb and add info in .env
Add your paypal client id in client/src/components/mainpages/cart/PaypalButton.js
Run the client & server with concurrently
npm run dev
Run the Express server only
npm run start
Run the React client only
npm run client
Server runs on http://localhost:5000 and client on http://localhost:3000
