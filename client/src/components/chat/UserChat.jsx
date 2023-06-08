import React, { useContext } from "react";
import {useFetchRecipientUser} from "../../hooks/useFetchRecipient.js";
import {Stack} from "react-bootstrap";
import avatar from "../../assets/pic_profile.svg"
import { ChatContext } from "../../context/ChatContext.jsx";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications.js";

const UserChat = ({chat, user}) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId = recipientUser?._id
  )
  const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);

  // console.log("UserChat", recipientUser)

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserNotificationsAsRead(
            thisUserNotifications,
            notifications
          );
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="Avatar" height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">text Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          12/12/2022
        </div>
        <div
          className={thisUserNotifications?.length > 0
            ? "this-user-notifications"
            : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""
          }
        </div>
        <span className={
          isOnline ? "user-online" : "user-offline"
        }></span>
      </div>
    </Stack>
  )
}
export default UserChat;