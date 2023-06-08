import React, { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/service.js";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // console.log("onlineUsers", onlineUsers)
  //
  // console.log("Messages", messages)
  //
  // console.log("Current Chat", currentChat)

  console.log("Notifications", notifications)

  // initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:3300");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [user]);

  // add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res)
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== user?._id)

    socket.emit("sendMessage", {...newMessage, recipientId});
  }, [newMessage]);

  // receive message and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId)

      if (isChatOpen) {
        setNotifications((prev) => [{...res, isRead: true}, ...prev])
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    }
  }, [socket, currentChat]);


  useEffect(() => {
    const getUsers = async() => {
      const response = await getRequest(`${baseUrl}/users`);

      console.log("getUsers response", response)

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats =  response?.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response)
    }

    getUsers();
  }, [userChats]);


  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {

        setIsUserChatLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatLoading(false);

        if (response.error) {return setUserChatsError(response)}

        setUserChats(response);
      }
    }

    getUserChats();
  }, [user]);


  useEffect(() => {
    const getMessages = async () => {

        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

        setIsMessagesLoading(false);

        if (response.error) {return setMessagesError(response)}

        setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something...");

      const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage
      }));

      console.log("senderID", sender._id)

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    [],
  );


  const updateCurrentChat = useCallback(
    (chat) => {
      setCurrentChat(chat);
    },
    [],
  );


  const createChat = useCallback(
    async (firstId, secondId) => {
      const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
        firstId,
        secondId,
      }));

      console.log("CHAT IDs", response)

      if (response.error) {
        return console.log("Error creating chat", response);
      }

      setUserChats((prev) => [...prev, response]);
    }, [],
  );

  const markAllNotificationsAsRead = useCallback(
    () => {
      const mNotifications = notifications.map((n) => {
        return { ...n, isRead: true }
      });

      setNotifications(mNotifications);
    },
    [],
  );

  const markNotificationsAsRead = useCallback((n, userChats, user, notifications) => {
    // find chat to open
    const desireChat = userChats.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });

      return isDesiredChat
    });

    // mark notification as read
    const mNotifications = notifications.map((el) => {
      if (n.senderId === el.senderId) {
        return {...n, isRead: true}
      } else {
        return el;
      }
    });

    updateCurrentChat(desireChat);
    setNotifications(mNotifications);
  }, []);


  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationsAsRead
      }}>
      {children}
    </ChatContext.Provider>
  )
}
