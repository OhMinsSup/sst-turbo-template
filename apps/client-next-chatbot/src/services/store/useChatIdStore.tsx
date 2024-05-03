import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ChatState {
  chatId: string | undefined;
}

interface ChatActions {
  setChatId: (chatId: string | undefined) => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create(
  persist<ChatStore>(
    (set) => ({
      chatId: undefined,
      setChatId: (chatId) => {
        set({ chatId });
      },
    }),
    {
      name: '@chatbot.chatId', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
