import { IChatNotificationsReq, IGetChatsReq, IGetChatsRes, IGetMessagesReq, IGetMessagesRes, IReadChatReq, IReadChatRes, ISearchChatsReq, ISearchChatsRes, chatNotifications, getChats, getMessages, readChat, searchChats } from '../../api/chats'
import { ChatsActions, IMessage } from '../reducers/ChatsReducer'

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

export type ISetMessage = IMessage
export function setMessage(input: ISetMessage) {
  return {
    type: ChatsActions.SetMessage,
    payload: input,
  }
}
