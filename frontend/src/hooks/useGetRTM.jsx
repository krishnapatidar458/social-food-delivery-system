
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.chat);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log(newMessage);
      dispatch(setMessages([...messages, newMessage]));
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
};

export default useGetRTM;
