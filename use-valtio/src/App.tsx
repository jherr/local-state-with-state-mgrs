import { createContext, useContext, useRef } from "react";
import { proxy, useSnapshot } from "valtio";

const createChatProxy = () => {
  const state = proxy({
    currentMessage: "",
    messages: [] as string[],
    get messageCount() {
      return state.messages.length;
    },
  });
  return state;
};

const ChatContext = createContext<ReturnType<typeof createChatProxy> | null>(
  null
);

const noop = () => {};
const useMessages = () => useSnapshot(useContext(ChatContext)!).messages;
const useCurrentMessage = () =>
  useSnapshot(useContext(ChatContext)!).currentMessage;
const useMessageCount = () =>
  useSnapshot(useContext(ChatContext)!).messageCount;
const useMutableState = () => useContext(ChatContext)!;

const Chat = () => {
  const currentMessage = useCurrentMessage();
  const messages = useMessages();
  const messageCount = useMessageCount();
  const store = useMutableState();

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
            store.currentMessage = e.target.value;
          }}
        />
      </div>
      <div className="chat-button">
        <button
          onClick={() => {
            store.messages.push(currentMessage);
            store.currentMessage = "";
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const ChatContainer = () => {
  const chatStore = useRef(createChatProxy());
  return (
    <div className="chat">
      <ChatContext.Provider value={chatStore.current}>
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
