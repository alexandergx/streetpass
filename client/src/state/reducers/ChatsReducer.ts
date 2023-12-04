// import { IGetChatsRes, ISearchChatsRes } from '../../api/chats'
// import { ISetChat, ISetChatId, ISetReadChat, IUnsetChat } from '../actions/ChatsActions'

export interface IMessage {
  messageId: string,
  chatId: string,
  userId: string,
  authUserId?: string,
  message: string,
  authUserReaction?: string,
  userReaction?: string,
  date: string,
  deletedMessage?: boolean,
  deletedChat?: boolean,
}

export interface IChat {
  chatId?: string,
  userId?: string,
  username?: string,
  name?: string,
  lastMessage?: string,
  lastMessageId?: string,
  unread?: boolean,
  notifications?: boolean,
  updated?: string,
}

export interface IChatsStore {
  chatId: string | null,
  chats: Array<IChat> | null,
  unread: number | null,
  chatsPage: number | null,
  chatsError: boolean,
  chatsSearch: Array<IChat> | null,
  chatsSearchError: boolean,
}

export enum ChatsActions {
  Init = 'INIT',
  SetChatId = 'SET_CHAT_ID',
  SetChats = 'SET_CHATS',
  SetChat = 'SET_CHAT',
  UnsetChat = 'UNSET_CHAT',
  SetReadChat = 'SET_READ_CHAT',
  ChatsError = 'CHATS_ERROR',
  SetChatsSearch = 'SET_CHATS_SEARCH',
  UnsetChatsSearch = 'UNSET_CHATS_SEARCH',
  ChatsSearchError = 'SET_CHATS_SEARCH_ERROR',
}

type ChatsAction =
  | { type: ChatsActions.Init, }
  // | { type: ChatsActions.SetChatId, payload: ISetChatId, }
  // | { type: ChatsActions.SetChats, payload: IGetChatsRes, }
  // | { type: ChatsActions.SetChat, payload: ISetChat, }
  // | { type: ChatsActions.UnsetChat, payload: IUnsetChat, }
  // | { type: ChatsActions.SetReadChat, payload: ISetReadChat, }
  // | { type: ChatsActions.ChatsError, payload: boolean, }
  // | { type: ChatsActions.SetChatsSearch, payload: ISearchChatsRes, }
  | { type: ChatsActions.UnsetChatsSearch, }
  | { type: ChatsActions.ChatsSearchError, payload: boolean, }

const INITIAL_STATE: IChatsStore = {
  chatId: null,
  chats: null,
  unread: null,
  chatsPage: null,
  chatsError: false,
  chatsSearch: null,
  chatsSearchError: false,
}

const chatsStore = (state = INITIAL_STATE, action: ChatsAction) => {
  switch (action.type) {
    case ChatsActions.Init:
      return INITIAL_STATE
    // case ChatsActions.SetChatId:
    //   return {
    //     ...state,
    //     chatId: action.payload,
    //   }
    // case ChatsActions.SetChats:
    //   return {
    //     ...state,
    //     chats: action.payload.chatsPage === 0
    //       ? action.payload.chats
    //       : action.payload.chatsPage === -1 && (state.chatsPage === null || state.chatsPage === -1)
    //         ? action.payload.chats
    //         : [...state.chats || [], ...action.payload.chats],
    //     unread: action.payload.unread,
    //     chatsPage: action.payload.chatsPage,
    //     chatsError: false,
    //   }
    // case ChatsActions.SetChat:
    //   return {
    //     ...state,
    //     chats: state.chats
    //       ? state.chats.find(chat => chat.chatId === action.payload.chatId)
    //         ? [{ ...state.chats.find(chat => chat.chatId === action.payload.chatId), ...action.payload, },
    //           ...state.chats.filter(chat => chat.chatId !== action.payload.chatId)]
    //         : [{ ...action.payload, notifications: true, }, ...state.chats]
    //       : null,
    //     unread: state.chats
    //       ? state.chats.find(chat => chat.chatId === action.payload.chatId)
    //         ? state.chats.find(chat => chat.chatId === action.payload.chatId)?.unread
    //           ? state.unread
    //           : state.unread !== null && action.payload.unread ? state.unread + 1 : state.unread
    //         : state.unread !== null && action.payload.unread ? state.unread + 1 : state.unread
    //       : state.unread,
    //     chatsError: false,
    //   }
    // case ChatsActions.UnsetChat:
    //   return {
    //     ...state,
    //     chats: state.chats ? state.chats.filter(i => i.chatId !== action.payload) : null,
    //     chatsError: false,
    //   }
    // case ChatsActions.SetReadChat:
    //   return {
    //     ...state,
    //     chats: state.chats
    //       ? state.chats?.map(chat => chat.chatId === action.payload ? { ...chat, unread: false, } : chat)
    //       : null,
    //     unread: state.chats
    //       ? state.chats.find(chat => chat.chatId === action.payload)?.unread
    //         ? state.unread !== null ? state.unread - 1 : state.unread
    //         : state.unread
    //       : null,
    //     chatsError: false,
    //   }
    // case ChatsActions.ChatsError:
    //   return {
    //     ...state,
    //     chatsError: action.payload,
    //   }
    // case ChatsActions.SetChatsSearch:
    //   return {
    //     ...state,
    //     chatsSearch: action.payload,
    //     chatsSearchError: false,
    //   }
    case ChatsActions.UnsetChatsSearch:
      return {
        ...state,
        chatsSearch: null,
        chatsSearchError: false,
      }
    case ChatsActions.ChatsSearchError:
      return {
        ...state,
        chatsSearchError: action.payload,
      }
    default:
      return state
  }
}

export default chatsStore
