import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

const createChatStore = () =>
  createStore<{
    currentMessage: string;
    messages: string[];
    setCurrentMessage: (value: string) => void;
    addMessage: () => void;
  }>((set, get) => ({
    currentMessage: "",
    messages: [],
    setCurrentMessage: (value: string) => set({ currentMessage: value }),
    addMessage: () =>
      set({
        messages: [...get().messages, get().currentMessage],
        currentMessage: "",
      }),
  }));

const ChatContext = createContext<ReturnType<typeof createChatStore> | null>(
  null
);

const useMessages = () =>
  useStore(useContext(ChatContext)!, (state) => state.messages);
const useCurrentMessage = () =>
  useStore(useContext(ChatContext)!, (state) => state.currentMessage);
const useMessageCount = () =>
  useStore(useContext(ChatContext)!, (state) => state.messages.length);
const useSetCurrentMessage = () =>
  useStore(useContext(ChatContext)!, (state) => state.setCurrentMessage);
const useAddMessage = () =>
  useStore(useContext(ChatContext)!, (state) => state.addMessage);

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
  const store = useRef(createChatStore());
  return (
    <div className="chat">
      <ChatContext.Provider value={store.current}>
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
