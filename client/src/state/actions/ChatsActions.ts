import { IChatNotificationsReq, IGetChatsReq, IGetChatsRes, IGetMessagesReq, IGetMessagesRes, IReadChatReq, ISearchChatsReq, ISearchChatsRes, IUpdateChatsReq, IUpdateChatsRes, IUpdateMessagesReq, IUpdateMessagesRes, chatNotifications, getChats, getMessages, readChat, searchChats, updateChats, updateMessages } from '../../api/chats'
import { ChatsActions, IChat, IMessage } from '../reducers/ChatsReducer'

export function initChats() {
  return {
    type: ChatsActions.Init,
  }
}

export type ISetChats = IGetChatsReq
export function setChats(input: ISetChats) {
  return async (dispatch: any) => {
    try {
      const result = await getChats(input)
      return dispatch({
        type: ChatsActions.SetChats,
        payload: result as IGetChatsRes,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export type ISetUpdateChats = IUpdateChatsReq
export function setUpdateChats(input: ISetUpdateChats) {
  return async (dispatch: any) => {
    try {
      const result = await updateChats(input)
      return dispatch({
        type: ChatsActions.SetUpdateChats,
        payload: result as IUpdateChatsRes,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export type ISetChat = IChat
export function setChat(input: ISetChat) {
  return {
    type: ChatsActions.SetChat,
    payload: input,
  }
}

export type IUnsetChat = string
export function unsetChat(input: IUnsetChat) {
  return {
    type: ChatsActions.UnsetChat,
    payload: input,
  }
}

export type ISetChatsSearch = ISearchChatsReq
export function setChatsSearch(input: ISetChatsSearch) {
  return async (dispatch: any) => {
    try {
      const result = await searchChats(input)
      return dispatch({
        type: ChatsActions.SetChatsSearch,
        payload: result as ISearchChatsRes,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export function unsetChatsSearch() {
  return {
    type: ChatsActions.UnsetChatsSearch,
  }
}

export type ISetChatKey = string | null
export function setChatKey(input: ISetChatKey) {
  return {
    type: ChatsActions.SetChatKey,
    payload: input,
  }
}

export type ISetReadChat = IReadChatReq
export function setReadChat(input: ISetReadChat) {
  return async (dispatch: any) => {
    try {
      await readChat(input)
      return dispatch({
        type: ChatsActions.SetReadChat,
        payload: input.chatId,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export type ISetChatNotifications = IChatNotificationsReq
export function setChatNotifications(input: ISetChatNotifications) {
  return async (dispatch: any) => {
    try {
      await chatNotifications(input)
      return dispatch({
        type: ChatsActions.SetChatNotifications,
        payload: input,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export type ISetMessages = IGetMessagesReq
export function setMessages(input: ISetMessages) {
  return async (dispatch: any) => {
    try {
      const result = await getMessages(input)
      return dispatch({
        type: ChatsActions.SetMessages,
        payload: { ...result, ...input, } as IGetMessagesRes & ISetMessages,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export type ISetUpdateMessages = IUpdateMessagesReq
export function setUpdateMessages(input: ISetUpdateMessages) {
  return async (dispatch: any) => {
    try {
      const result = await updateMessages(input)
      return dispatch({
        type: ChatsActions.SetUpdateMessages,
        payload: { ...result, ...input, } as IUpdateMessagesRes & ISetUpdateMessages,
      })
    } catch (e) {
      return dispatch({
        type: ChatsActions.ChatsError,
      })
    }
  }
}

export interface ISetMessage {
  userId: string,
  message: IMessage,
  lastUpdated: Date,
}
export function setMessage(input: ISetMessage) {
  return {
    type: ChatsActions.SetMessage,
    payload: input,
  }
}

export interface ISetMessageReaction {
  userId: string,
  messageId: string,
  reaction: string | null,
}
export function setMessageReaction(input: ISetMessageReaction) {
  return {
    type: ChatsActions.SetMessageReaction,
    payload: input,
  }
}
