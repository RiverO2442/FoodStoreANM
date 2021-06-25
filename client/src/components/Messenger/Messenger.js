import React, { useContext, useEffect, useState, useRef } from "react";
import "./Messenger.css";

import { GlobalState } from "../../GlobalState";

import Conversation from "./Conversations/Conversation";
import Message from "./Message/Message";

import ChatOnline from "./ChatOnline/ChatOnline";

import { io } from "socket.io-client";

import axios from "axios";

import {
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChatIcon from "@material-ui/icons/Chat";
import SendIcon from "@material-ui/icons/Send";
import Fab from "@material-ui/core/Fab";
const Messenger = () => {
  const useStyles = makeStyles((theme) => ({
    table: {
      marginTop: theme.spacing(3),
      "& thead th": {
        fontWeight: "600",
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
      },
      "& tbody td": {
        fontWeight: "300",
      },
      "& tbody tr:hover": {
        backgroundColor: "#fffbf2",
        cursor: "pointer",
      },
    },
    searchInput: {
      width: "75%",
    },
    pageContent: {
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
    pageContent2: {
      minWidth: "30%",
      margin: theme.spacing(1),
      padding: theme.spacing(0),
    },
    pageContent3: {
      minWidth: "5%",
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
    pageContent2: {
      minWidth: "30%",
      margin: theme.spacing(1),
      padding: theme.spacing(0),
    },
    newButton: {
      position: "absolute",
      right: "10px",
      padding: "20px 20px",
    },
    button: {
      paddingRight: "10px",
    },
  }));
  const classes = useStyles();
  const state = useContext(GlobalState);
  const [token] = state.token;
  // khi logged mới hiện chat box (nhớ thêm vào sau)
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  const [user] = state.userAPI.user;

  // các cuộc conversation hiển thị trên front end (dc lấy từ database r nạp vào đây)
  const [conversations, setConversations] = useState([]);

  const [currentConversation, setCurrentConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  //tìm avatar của người dùng còn lại trong đoạn hội thoại
  const [senderUser, setSenderUser] = useState([]);

  const [anotherUserID, setAnotherUserID] = useState("");

  // tin nhắn nhận từ socket bên backend server
  const [arrivalMessage, setArrivalMessage] = useState(null);

  //danh sách người dùng online
  const [onlineUsers, setOnlineUsers] = useState([]);

  const scrollRef = useRef();

  //socket io dùng cho nhắn tin real time
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentConversation?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentConversation]);

  useEffect(() => {
    if (user._id) {
      socket.current.emit("addUser", user._id);
    }
    socket.current.on("getUsers", (usersList) => {
      let userIds = [];
      usersList.map((u) => {
        const temp = u.userId;
        userIds.push(temp);
      });

      setOnlineUsers(userIds);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      if (!isAdmin) {
        const res = await axios.get(`/api/findConversation/${user._id}`, {
          headers: { Authorization: token },
        });
        setConversations(res.data);
      } else {
        const res = await axios.get("/api/allConversation", {
          headers: { Authorization: token },
        });
        setConversations(res.data);
      }
    };
    getConversations();
  }, [isAdmin, user._id]);

  useEffect(() => {
    const getMessages = async () => {
      const res = await axios.get(
        `/api/findMessages/${currentConversation._id}`,
        {
          headers: { Authorization: token },
        }
      );
      setMessages(res.data);
    };
    if (currentConversation !== null) {
      getMessages();
    }
  }, [currentConversation]);

  useEffect(() => {
    const getUserById = async () => {
      if (currentConversation) {
        setAnotherUserID(
          currentConversation.members.find((member) => member !== user._id)
        );
      }
      try {
        if (anotherUserID) {
          const res = await axios.get(`/user/findUser/${anotherUserID}`, {
            headers: { Authorization: token },
          });
          setSenderUser(res.data);
        }
      } catch (error) {
        alert(error.response.data.msg);
      }
    };
    getUserById();
  }, [user, anotherUserID, currentConversation]);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationID: currentConversation._id,
    };

    const receiverId = currentConversation.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/api/newMessage", message, {
        headers: { Authorization: token },
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  return (
    <>
      <Paper className={classes.pageContent}>
        <div className="messenger">
          <Paper className={classes.pageContent2}>
            <Paper
              style={{
                width: "100%",
                backgroundColor: "#f5f5f5",
                height: "10%",
                alignContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<ChatIcon />}
                fullWidth
                style={{ height: "100%", fontSize: "large" }}
              >
                Contact
              </Button>
            </Paper>
            <div className="chatMenu">
              <div className="chatMenuWrapper">
                {conversations ? (
                  <>
                    {conversations.map((conversation) => (
                      <div onClick={() => setCurrentConversation(conversation)}>
                        <Conversation
                          conversation={conversation}
                          currentUser={user}
                        ></Conversation>
                      </div>
                    ))}
                  </>
                ) : (
                  <span>No Contact</span>
                )}
              </div>
            </div>
          </Paper>
          <Paper className={classes.pageContent3} style={{ width: "50%" }}>
            <div className="chatBox">
              <div className="chatBoxWrapper">
                {currentConversation ? (
                  <>
                    <div className="chatBoxTop">
                      {messages.map((message) => (
                        <div ref={scrollRef}>
                          <Message
                            message={message}
                            own={message.sender === user._id}
                            currentUser={user}
                            senderUser={senderUser}
                          ></Message>
                        </div>
                      ))}
                    </div>
                    <Divider style={{ margin: "1rem 0 1rem 0" }} />
                    <div className="chatBoxBottom">
                      <TextField
                        onChange={(event) => setNewMessage(event.target.value)}
                        value={newMessage}
                        placeholder="Write something..."
                        multiline
                        variant="outlined"
                        fullWidth
                      />
                      <Fab
                        style={{ margin: "1%" }}
                        onClick={handleSubmitMessage}
                        color="primary"
                        aria-label="add"
                      >
                        <SendIcon></SendIcon>
                      </Fab>
                      {/* <button
                        className="chatSubmitButton"
                        onClick={handleSubmitMessage}
                      >
                        Send
                      </button> */}
                    </div>
                  </>
                ) : (
                  <span className="noConversationText">
                    Please open a conversation to start a chat !
                  </span>
                )}
              </div>
            </div>
          </Paper>
          <Paper className={classes.pageContent2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ChatIcon />}
              fullWidth
              style={{ height: "10%", fontSize: "large" }}
            >
              Online
            </Button>
            <div className="chatOnline">
              <div className="chatOnlineWrapper">
                <ChatOnline
                  onlineUsers={onlineUsers}
                  currentUserId={user._id}
                  setCurrentConversation={setCurrentConversation}
                ></ChatOnline>
              </div>
            </div>
          </Paper>
        </div>
      </Paper>
    </>
  );
};

export default Messenger;
