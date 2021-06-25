const Users = require("../models/userModel");

const Payments = require("../models/paymentModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const sendMail = require("./sendMail");

const sendConfirmMail = require("./sendConfirmMail");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const fetch = require("node-fetch");

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

const userController = {
  //User Validation
  register: async (req, res) => {
    try {
      const { name, password, email } = req.body;
      const user = await Users.findOne({ email });

      if (!name || !password || !email)
        return res.status(400).json({ msg: "Please fill in all the fields" });

      const email_validate = validateEmail(email);

      if (!email_validate)
        return res.status(400).json({ msg: "Invalid Email!" });

      if (user) {
        return res
          .status(400)
          .json({ msg: "The user with that email already exist !" });
      }
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters or more" });

      //Password hashing ( mã hóa mật khẩu)
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");

      res.json({
        msg: "Register Success! Please activate your email to start.",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const { name, email, password } = user;
      const check = await Users.findOne({ email });
      if (check)
        return res
          .status(400)
          .json({ msg: "The user with that email already exist !" });

      const newUser = new Users({
        name,
        email,
        password,
      });

      //Save new user intro database
      await newUser.save();

      res.json({ msg: "Account has been activated!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token) return res.status(400).json({ msg: "Please Login First" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please Login First" });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      //if login success, create refresh token
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ msg: "Login successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const accessToken = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${accessToken}`;

      sendMail(email, url, "Reset your password");
      res.json({ msg: "Resend the password , please check your email" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  sendConfirmMail: async (req, res) => {
    try {
      const {
        email,
        name,
        country_code,
        paymentID,
        cart,
        currentDate,
        total,
        officialTotal,
      } = req.body;

      sendConfirmMail(
        email,
        name,
        country_code,
        paymentID,
        cart,
        currentDate,
        total,
        officialTotal
      );
      res.json({ msg: "Send confirm email about the order successfully!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { password: passwordHash }
      );

      res.json({ msg: "Password successfully  changed !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  findUserById: async (req, res) => {
    try {
      const user = await Users.findById(req.params.userID).select("-password");
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAnswerAdmin: async (req, res) => {
    try {
      const user = await Users.find({ email: "chauminhquang99@gmail.com" });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getAllUserInfor: async (req, res) => {
    try {
      const users = await Users.find().select("-password");
      res.json(users);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      await Users.findOneAndUpdate({ _id: req.user.id }, { name, avatar });
      res.json({ msg: "Updated user successfully !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      await Users.findOneAndUpdate({ _id: req.params.id }, { role });
      res.json({ msg: "Updated user role successfully !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deledted User Successfully !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addcart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      await Users.findByIdAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );
      return res.json({ msg: "Added to cart successfully !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addToFavoriteList: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      await Users.findByIdAndUpdate(
        { _id: req.user.id },
        {
          favoriteList: req.body.favoriteProducts,
        }
      );
      return res.json({ msg: "Added to favorite list successfully !" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });
      res.json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });

      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECRET;

      const passwordHash = await bcrypt.hash(password, 10);

      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed." });

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect." });

        const refreshToken = createRefreshToken({ id: user._id });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login successfully" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture,
        });

        await newUser.save();

        const refreshToken = createRefreshToken({ id: newUser._id });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login successfully" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + process.env.FACEBOOK_SECRET;

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect." });

        const refreshToken = createRefreshToken({ id: user._id });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login successfully" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture.data.url,
        });

        await newUser.save();

        const refreshToken = createRefreshToken({ id: newUser._id });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login successfully" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createActivationToken = (payload) => {
  return jwt.sign(payload.toJSON(), process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "11m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = userController;
