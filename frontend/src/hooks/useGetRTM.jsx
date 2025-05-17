import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";
import { onEvent, offEvent } from "../services/socketManager";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { connected } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.chat);

  useEffect(() => {
    if (!connected) return;

    const handleNewMessage = (newMessage) => {
      console.log(newMessage);
      dispatch(setMessages([...messages, newMessage]));
    };
    
    // Register the listener
    onEvent("newMessage", handleNewMessage);
    
    // Cleanup
    return () => {
      offEvent("newMessage", handleNewMessage);
    };
  }, [messages, connected, dispatch]);
};

export default useGetRTM;
