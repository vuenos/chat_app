import React, {useContext} from 'react';
import { ChatContext } from "../../context/ChatContext.jsx";

const PotentialChats = () => {
  const { potentialChats } = useContext(ChatContext);
  console.log("PotentialChats", potentialChats);

  return (
    <div>
      <h1>Start Chat</h1>
    </div>
  )
}
export default PotentialChats;