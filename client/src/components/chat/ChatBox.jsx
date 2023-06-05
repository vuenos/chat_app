import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user._id);

  console.log("USER_ID", user._id)
  console.log("recipientUser", recipientUser)

  // if (!recipientUser) return (
  //   <p style={{ textAlign: "center", width: "100%" }}>
  //     No conversation selected yet...
  //   </p>
  // );

  if (isMessagesLoading) return (
    <p style={{ textAlign: "center", width: "100%" }}>
      Loading chat...
    </p>
  );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages && messages.map((message, index) =>
          <Stack
            key={index}
            className={`${message?.senderId === user?._id ? "message self align-self-end flex-glow-0" : "message align-self-start flex-glow-0"}`}
          >
            <span>{message.text}</span>
            <span className="message-footer">{moment(message.createdAt).calendar()}</span>
          </Stack>)}
      </Stack>
    </Stack>
  );
};
export default ChatBox;