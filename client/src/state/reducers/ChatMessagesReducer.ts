import { ISetChatMessage, ISetChatTyping } from '../actions/ChatMessagesActions'

export interface IChatMessage {
  message: string,
  typing?: Date | null,
}

export interface IChatMessagesStore {
  chatMessages: Record<string, IChatMessage>,
  chatMessagesError: boolean,
}

export enum ChatMessagesActions {
  Init = 'INIT_CHAT_MESSAGES',
  SetChatMessage = 'SET_CHAT_MESSAGE',
  SetChatTyping = 'SET_CHAT_TYPING',
  ChatMessagesError = 'CHAT_MESSAGES_ERROR',
}

type ChatMessagesAction =
  | { type: ChatMessagesActions.Init, }
  | { type: ChatMessagesActions.SetChatMessage, payload: ISetChatMessage, }
  | { type: ChatMessagesActions.SetChatTyping, payload: ISetChatTyping, }
  | { type: ChatMessagesActions.ChatMessagesError, }

const INITIAL_STATE: IChatMessagesStore = {
  chatMessages: {},
  chatMessagesError: false,
}

const chatMessagesStore = (state = INITIAL_STATE, action: ChatMessagesAction) => {
  switch (action.type) {
    case ChatMessagesActions.Init:
      return INITIAL_STATE
    case ChatMessagesActions.SetChatMessage:
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.userId]: {
            ...state.chatMessages[action.payload.userId],
            message: action.payload.message
          },
        }
      }
    case ChatMessagesActions.SetChatTyping:
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.userId]: {
            ...state.chatMessages[action.payload.userId],
            typing: action.payload.typing,
          },
        }
      }
    case ChatMessagesActions.ChatMessagesError:
      return {
        ...state,
        chatMessagesError: true,
      }
    default:
      return state
  }
}

export default chatMessagesStore
