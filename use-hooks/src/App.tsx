import { createContext, useContext, useState, useMemo } from "react";

const useChatStore = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const messageCount = useMemo(() => messages.length, [messages]);

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    messageCount,
    addMessage: () => {
      setMessages([...messages, currentMessage]);
      setCurrentMessage("");
    },
  };
};

const ChatContext = createContext<ReturnType<typeof useChatStore> | null>(null);

const useMessages = () => useContext(ChatContext)!.messages;
const useCurrentMessage = () => useContext(ChatContext)!.currentMessage;
const useMessageCount = () => useContext(ChatContext)!.messageCount;
const useSetCurrentMessage = () => useContext(ChatContext)!.setCurrentMessage;
const useAddMessage = () => useContext(ChatContext)!.addMessage;

const Chat = () => {
  const currentMessage = useCurrentMessage();
  const messages = useMessages();
  const messageCount = useMessageCount();
  const setCurrentMessage = useSetCurrentMessage();
  const addMessage = useAddMessage();

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className="chat-message">
          {message}
        </div>
      ))}
      <div className="chat-count">Message Count: {messageCount}</div>
      <div className="chat-input">
        <input
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
        />
      </div>
      <div className="chat-button">
        <button onClick={addMessage}>Send</button>
      </div>
    </div>
  );
};

const ChatContainer = () => {
  const store = useChatStore();
  return (
    <div className="chat">
      <ChatContext.Provider value={store}>
        <Chat />
      </ChatContext.Provider>
    </div>
  );
};

function App() {
  return (
    <div className="chat-area">
      <ChatContainer />
      <ChatContainer />
      <ChatContainer />
      <ChatContainer />
    </div>
  );
}

export default App;
