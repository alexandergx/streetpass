import { IGetChatsRes, IGetMessagesRes, ISearchChatsRes } from '../../api/chats'
import { ISetChatNotifications, ISetMessages } from '../actions/ChatsActions'
import { IMedia } from './UserReducer'

export interface IMessage {
  chatId: string,
  messageId: string
  userId: string
  message: string
  date: Date
}

export interface IMessages {
  messages: Array<IMessage>,
  continue: boolean,
}

export interface IChat {
  chatId: string
  userId: string
  name: string
  bio: string
  work: string
  school: string
  age: number
  sex: boolean
  date: Date
  media: IMedia[]
  lastMessage: string
  unread: boolean
  notifications: boolean
}

export interface IChatsStore {
  chats: Array<IChat> | null,
  chatsSearch: Array<IChat>,
  messages: Record<string, IMessages>,
  chatId: string | null,
  unread: number | null,
  continue: boolean,
  chatsError: boolean,
}

export enum ChatsActions {
  Init = 'INIT',
  SetChats = 'SET_CHATS',
  SetChatsSearch = 'SET_CHATS_SEARCH',
  SetReadChat = 'SET_READ_CHAT',
  SetChatNotifications = 'SET_CHAT_NOTIFICATIONS',
  SetMessages = 'SET_MESSAGES',
  SetMessage = 'SET_MESSAGE',
  ChatsError = 'CHATS_ERROR',
}

type ChatsAction =
  | { type: ChatsActions.Init, }
  | { type: ChatsActions.SetChats, payload: IGetChatsRes, }
  | { type: ChatsActions.SetChatsSearch, payload: ISearchChatsRes, }
  | { type: ChatsActions.SetReadChat, payload: string, }
  | { type: ChatsActions.SetChatNotifications, payload: ISetChatNotifications, }
  | { type: ChatsActions.SetMessages, payload: IGetMessagesRes & ISetMessages, }
  | { type: ChatsActions.SetMessage, payload: IMessage, }
  | { type: ChatsActions.ChatsError, }

const INITIAL_STATE: IChatsStore = {
  chats: null,
  chatsSearch: [],
  messages: {},
  chatId: null,
  unread: null,
  continue: true,
  chatsError: false,
}

const chatsStore = (state = INITIAL_STATE, action: ChatsAction) => {
  switch (action.type) {
    case ChatsActions.Init:
      return INITIAL_STATE
    case ChatsActions.SetChats:
      return {
        ...state,
        chats: state.chats ? [...state.chats, ...action.payload.chats] : action.payload.chats,
        continue: action.payload.continue,
      }
    case ChatsActions.SetChatsSearch:
      return {
        ...state,
        chatsSearch: action.payload,
      }
    case ChatsActions.SetReadChat:
      return {
        ...state,
        chats: state.chats
          ? state.chats.map(chat => chat.chatId === action.payload ? { ...chat, unread: false, } : chat)
          : state.chats,
      }
    case ChatsActions.SetChatNotifications:
      return {
        ...state,
        chats: state.chats
          ? state.chats.map(chat => chat.chatId === action.payload.chatId ? { ...chat, notifications: action.payload.notifications, } : chat)
          : state.chats,
      }
    case ChatsActions.SetMessages:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: {
            messages: [...state.messages[action.payload.chatId].messages, ...action.payload.messages],
            continue: action.payload.continue,
          },
        },
      }
    case ChatsActions.SetMessage:
      return {
        ...state,
        chats: state.chats
          ? state.chats.map(chat => chat.chatId === action.payload.chatId ? { ...chat, date: action.payload.date, lastMessage: action.payload.message, unread: true, } : chat)
          : state.chats,
        messages: {
          ...state.messages,
          [action.payload.chatId]: {
            ...state.messages[action.payload.chatId],
            messages: [...state.messages[action.payload.chatId].messages, action.payload],
          },
        },
      }
    case ChatsActions.ChatsError:
      return {
        ...state,
        chatsError: true,
      }
    default:
      return state
  }
}

export default chatsStore
