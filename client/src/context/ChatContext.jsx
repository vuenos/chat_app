import React, { createContext, useState, useEffect } from 'react';
import { baseUrl, getRequest, postRequest } from "../utils/service.js";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);

  useEffect(() => {
    const getUsers = async() => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats =  response.filter((u) => {
        let isChatCreated = false;
        if (user._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats)
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


  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
      }}>
      {children}
    </ChatContext.Provider>
  )
}
