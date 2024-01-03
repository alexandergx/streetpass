import { IGetChatsRes, IGetMessagesRes, ISearchChatsRes } from '../../api/chats'
import { ISetChat, ISetChatKey, ISetChatMessage, ISetChatNotifications, ISetMessage, ISetMessageReaction, ISetMessages, IUnsetChat } from '../actions/ChatsActions'
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
  reaction?: string | null,
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
  media: IMedia[]
  lastMessage: string
  lastMessageId: string,
  lastMessageUserId: string,
  unread: boolean
  notifications: boolean
  streetpassDate: Date
  matchDate: Date
  chatDate: Date
}

export interface IChatsStore {
  chats: Array<IChat> | null,
  chatsSearch: Array<IChat> | null,
  chatKey: string | null,
  messages: Record<string, IMessages>,
  unread: number | null,
  continue: boolean,
  chatsError: boolean,
}

export enum ChatsActions {
  Init = 'INIT',
  SetChats = 'SET_CHATS',
  SetChat = 'SET_CHAT',
  UnsetChat = 'UNSET_CHAT',
  SetChatsSearch = 'SET_CHATS_SEARCH',
  UnsetChatsSearch = 'UNSET_CHATS_SEARCH',
  SetChatKey = 'SET_CHAT_KEY',
  SetReadChat = 'SET_READ_CHAT',
  SetChatNotifications = 'SET_CHAT_NOTIFICATIONS',
  SetMessages = 'SET_MESSAGES',
  SetMessage = 'SET_MESSAGE',
  SetMessageReaction = 'SET_MESSAGE_REACTION',
  SetChatMessage = 'SET_CHAT_MESSAGE',
  ChatsError = 'CHATS_ERROR',
}

type ChatsAction =
  | { type: ChatsActions.Init, }
  | { type: ChatsActions.SetChats, payload: IGetChatsRes, }
  | { type: ChatsActions.SetChat, payload: ISetChat, }
  | { type: ChatsActions.UnsetChat, payload: IUnsetChat, }
  | { type: ChatsActions.SetChatsSearch, payload: ISearchChatsRes, }
  | { type: ChatsActions.UnsetChatsSearch, }
  | { type: ChatsActions.SetChatKey, payload: ISetChatKey, }
  | { type: ChatsActions.SetReadChat, payload: string, }
  | { type: ChatsActions.SetChatNotifications, payload: ISetChatNotifications, }
  | { type: ChatsActions.SetMessages, payload: IGetMessagesRes & ISetMessages, }
  | { type: ChatsActions.SetMessage, payload: ISetMessage, }
  | { type: ChatsActions.SetMessageReaction, payload: ISetMessageReaction, }
  | { type: ChatsActions.SetChatMessage, payload: ISetChatMessage, }
  | { type: ChatsActions.ChatsError, }

const INITIAL_STATE: IChatsStore = {
  chats: null,
  chatsSearch: null,
  chatKey: null,
  messages: {},
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
    case ChatsActions.UnsetChat:
      return {
        ...state,
        chats: state.chats ? state.chats.filter(chat => chat.userId !== action.payload) : state.chats,
        messages: {
          ...state.messages,
          [action.payload]: undefined,
        }
      }
    case ChatsActions.SetChatsSearch:
      return {
        ...state,
        chatsSearch: action.payload,
      }
    case ChatsActions.UnsetChatsSearch:
      return {
        ...state,
        chatsSearch: null,
      }
    case ChatsActions.SetChatKey:
      return {
        ...state,
        chatKey: action.payload,
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
        chats: state.chats ?
          [
            ...state.chats.filter(chat => chat.userId === action.payload.userId).map(chat => ({
              ...chat, date: action.payload.message.date, lastMessage: action.payload.message.message, lastMessageId: action.payload.message.messageId, lastMessageUserId: action.payload.message.userId, unread: true,
            })),
            ...state.chats.filter(chat => chat.userId !== action.payload.userId),
          ]
        : state.chats,
        messages: {
          ...state.messages,
          [action.payload.userId]: {
            messages: state.messages[action.payload.userId] ? [action.payload.message, ...state.messages[action.payload.userId].messages] : [action.payload.message],
            message: state.messages[action.payload.userId] ? state.messages[action.payload.userId].message : '',
            continue: state.messages[action.payload.userId] ? state.messages[action.payload.userId].continue : true,
          },
        },
      }
    case ChatsActions.SetMessageReaction:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.userId]: state.messages[action.payload.userId] ? {
            ...state.messages[action.payload.userId],
            messages: state.messages[action.payload.userId].messages.map(message => message.messageId === action.payload.messageId ? { ...message, reaction: action.payload.reaction } : message),
          } : undefined,
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
