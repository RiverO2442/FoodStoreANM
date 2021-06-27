#  WEB AND APPLICATION SECURITY PROJECT #
Apply all of the techniques that were taught to this web. Especially, the project aimed at preventing attacks in TOP 10 OWASP.

# PROGRAMMING LANGUAGES
ReactJS, NodeJS, MongoDB


# CONTRIBUTORS #
S.O.F Team included:
1. Le Ba Linh
2. Tran Thanh Hai 
3. Nguyen Anh Hao

# INSTRUCTION 
1. Download ZIP or pull the project from Git to your computer.
2. Set up the environment in the .env file.
3. Cd to the project, install the dependencies with the command:
``` 
npm install 
```
4. cd to the ./client folder, continue installing the dependencies with the same command:
``` 
npm install
```
5. Connect your paypal client id in the PaypalButtoon.js stored in Cart folder (see detail in the directory tree above) or follow with the command
```
cd client/src/components/mainpages/cart/PaypalButton.js
```
6. Run the client & server 
```
npm run dev
```

# STRUCTURE
```
.
├── README.MD
├── client
│   ├── db.json
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   └── src
├── controllers
│   ├── UploadAvatarController.js
│   ├── categoryController.js
│   ├── commentController.js
│   ├── conversationController.js
│   ├── discountController.js
│   ├── helloTemplate.js
│   ├── messageController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── sendConfirmMail.js
│   ├── sendMail.js
│   └── userController.js
├── middlewares
│   ├── UploadAvatarMiddleware.js
│   ├── authentication.js
│   └── authenticationAdmin.js
├── models
│   ├── categoryModel.js
│   ├── commentModel.js
│   ├── conversationModel.js
│   ├── discountModel.js
│   ├── messageModel.js
│   ├── paymentModel.js
│   ├── productModel.js
│   └── userModel.js
├── package-lock.json
├── package.json
├── routes
│   ├── UploadAvatar.js
│   ├── categoryRouter.js
│   ├── commentRouter.js
│   ├── conversationRouter.js
│   ├── discountRouter.js
│   ├── messageRouter.js
│   ├── paymentRouter.js
│   ├── productRouter.js
│   ├── uploadImage.js
│   └── userRouter.js
├── server.js
├── socket
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
└── tmp
    └── tmp-1-162367051123

```

# LICENSE
© 2021 Hao Quang & S.O.F Team
