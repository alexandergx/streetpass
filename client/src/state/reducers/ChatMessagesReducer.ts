import { ISetChatMessage } from '../actions/ChatMessagesActions'

export interface IChatMessagesStore {
  chatMessages: Record<string, string>,
  chatMessagesError: boolean,
}

export enum ChatMessagesActions {
  Init = 'INIT_CHAT_MESSAGES',
  SetChatMessage = 'SET_CHAT_MESSAGE',
  ChatMessagesError = 'CHAT_MESSAGES_ERROR',
}

type ChatMessagesAction =
  | { type: ChatMessagesActions.Init, }
  | { type: ChatMessagesActions.SetChatMessage, payload: ISetChatMessage, }
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
          [action.payload.userId]: action.payload.message,
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
