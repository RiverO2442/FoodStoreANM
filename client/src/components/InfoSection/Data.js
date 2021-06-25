import img1 from "../../images/svg-1.svg";

import img2 from "../../images/svg-2.svg";

import img3 from "../../images/svg-3.svg";

export const homeObjOne = {
  id: "about",
  lightBg: false,
  lightText: true,
  lightTextDesc: true,
  topLine: "Hygenic Food",
  headLine: "Unlimited choices with variety of our menus",
  description:
    "Make online payments without getting charged any fees and receive a lot of sales promotion",
  buttonLabel: "Get started",
  imgStart: false,
  image: img1,
  alt: "Section 1 img",
  dark: true,
  primary: true,
  darkText: false,
};

export const homeObjTwo = {
  id: "discover",
  lightBg: true,
  lightText: false,
  lightTextDesc: false,
  topLine: "Unlimited Access",
  headLine: "Login and buy our food at any time",
  description:
    "We have you covered no matter where you are located. All you need is an internet connection and a phone or computer",
  buttonLabel: "Learn More",
  imgStart: true,
  image: img2,
  alt: "Section 2 img",
  dark: false,
  primary: false,
  darkText: true,
};

export const homeObjThree = {
  id: "signup",
  lightBg: true,
  lightText: false,
  lightTextDesc: false,
  topLine: "Join our store",
  headLine: "Get the chat started right now",
  description:
    "Get everything set up and ready in just under 5 minutes. All you need is add your information and you're ready to go ",
  buttonLabel: "Start Now",
  imgStart: false,
  image: img3,
  alt: "Section 3 img",
  dark: false,
  primary: false,
  darkText: true,
};
