import { IGetChatsRes, IGetMessagesRes, ISearchChatsRes } from '../../api/chats'
import { ISetChat, ISetChatMessage, ISetChatNotifications, ISetMessage, ISetMessages } from '../actions/ChatsActions'
import { IMedia } from './UserReducer'

export interface IMessageMetadata {
  sender: string,
  recipient: string,
}

export interface IMessage {
  chatId: string,
  messageId: string
  userId: string
  message: string
  date: Date
}

export interface IMessages {
  messages: Array<IMessage>,
  message: string,
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
  SetChat = 'SET_CHAT',
  SetChatsSearch = 'SET_CHATS_SEARCH',
  SetReadChat = 'SET_READ_CHAT',
  SetChatNotifications = 'SET_CHAT_NOTIFICATIONS',
  SetMessages = 'SET_MESSAGES',
  SetMessage = 'SET_MESSAGE',
  SetChatMessage = 'SET_CHAT_MESSAGE',
  ChatsError = 'CHATS_ERROR',
}

type ChatsAction =
  | { type: ChatsActions.Init, }
  | { type: ChatsActions.SetChats, payload: IGetChatsRes, }
  | { type: ChatsActions.SetChat, payload: ISetChat, }
  | { type: ChatsActions.SetChatsSearch, payload: ISearchChatsRes, }
  | { type: ChatsActions.SetReadChat, payload: string, }
  | { type: ChatsActions.SetChatNotifications, payload: ISetChatNotifications, }
  | { type: ChatsActions.SetMessages, payload: IGetMessagesRes & ISetMessages, }
  | { type: ChatsActions.SetMessage, payload: ISetMessage, }
  | { type: ChatsActions.SetChatMessage, payload: ISetChatMessage, }
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
    case ChatsActions.SetChat:
      return {
        ...state,
        chats: state.chats ? [action.payload, ...state.chats.filter(chat => chat.chatId !== action.payload.chatId)] : [action.payload],
      }
    case ChatsActions.SetChatsSearch:
      return {
        ...state,
        chatsSearch: action.payload,
      }
    case ChatsActions.SetReadChat:
      return {
        ...state,
        chats: state.chats ? state.chats.map(chat => chat.chatId === action.payload ? { ...chat, unread: false, } : chat) : state.chats,
      }
    case ChatsActions.SetChatNotifications:
      return {
        ...state,
        chats: state.chats ? state.chats.map(chat => chat.chatId === action.payload.chatId ? { ...chat, notifications: action.payload.notifications, } : chat) : state.chats,
      }
    case ChatsActions.SetMessages:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.userId]: {
            messages: state.messages[action.payload.userId] ? [...state.messages[action.payload.userId].messages, ...action.payload.messages] : action.payload.messages,
            message: state.messages[action.payload.userId] ? state.messages[action.payload.userId].message : '',
            continue: action.payload.continue,
          },
        },
      }
    case ChatsActions.SetMessage:
      return {
        ...state,
        chats: state.chats
          ? state.chats.map(chat => chat.userId === action.payload.userId ? { ...chat, date: action.payload.message.date, lastMessage: action.payload.message.message, unread: true, } : chat)
          : state.chats, // TODO - sort chats, new message chat is 0th
        messages: {
          ...state.messages,
          [action.payload.userId]: {
            messages: state.messages[action.payload.userId] ? [...state.messages[action.payload.userId].messages, action.payload.message] : [action.payload.message],
            message: state.messages[action.payload.userId] ? state.messages[action.payload.userId].message : '',
            continue: state.messages[action.payload.userId] ? state.messages[action.payload.userId].continue : true,
          },
        },
      }
    case ChatsActions.SetChatMessage:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.userId]: {
            messages: state.messages[action.payload.userId] ? state.messages[action.payload.userId].messages : [],
            message: action.payload.message,
            continue: state.messages[action.payload.userId] ? state.messages[action.payload.userId].continue : true,
          }
        }
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
