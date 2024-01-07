import { ALERT_TYPING, CHAT_NOTIFICATIONS, GET_CHATS, GET_MESSAGES, IAlertTypingQuery, IChatNotificationsMutation, IGetChatsQuery, IGetMessagesQuery, IReactMessageMutation, IReadChatMutation, ISearchChatsQuery, ISendMessageMutation, IUpdateChatsQuery, IUpdateMessagesQuery, REACT_MESSAGE, READ_CHAT, SEARCH_CHATS, SEND_MESSAGE, UPDATE_CHATS, UPDATE_MESSAGES, apiRequest } from '.'
import { IChat, IMessage } from '../state/reducers/ChatsReducer'

export type IGetChatsReq = IGetChatsQuery
export interface IGetChatsRes {
  chats: Array<IChat>,
  continue: boolean,
  lastUpdated: Date | null,
}
export const getChats = async (input: IGetChatsReq): Promise<IGetChatsRes> => {
  try {
    const { data, } = await apiRequest(GET_CHATS(input))
    return data.getChats
  } catch(e) {
    throw new Error
  }
}

export type IUpdateChatsReq = IUpdateChatsQuery
export interface IUpdateChatsRes {
  chats: Array<IChat> | null,
  lastUpdated: Date | null,
}
export const updateChats = async (input: IUpdateChatsReq): Promise<IUpdateChatsRes> => {
  try {
    const { data, } = await apiRequest(UPDATE_CHATS(input))
    return data.updateChats
  } catch(e) {
    throw new Error
  }
}

export type ISearchChatsReq = ISearchChatsQuery
export type ISearchChatsRes = Array<IChat>
export const searchChats = async (input: ISearchChatsReq): Promise<ISearchChatsRes> => {
  try {
    const { data, } = await apiRequest(SEARCH_CHATS(input))
    return data.searchChats
  } catch(e) {
    throw new Error
  }
}

export type IReadChatReq = IReadChatMutation
export type IReadChatRes = boolean
export const readChat = async (input: IReadChatReq): Promise<IReadChatRes> => {
  try {
    const { data, } = await apiRequest(READ_CHAT(input))
    return data.readChat
  } catch(e) {
    throw new Error
  }
}

export type IChatNotificationsReq = IChatNotificationsMutation
export type IChatNotificationsRes = boolean
export const chatNotifications = async (input: IChatNotificationsReq): Promise<IChatNotificationsRes> => {
  try {
    const { data, } = await apiRequest(CHAT_NOTIFICATIONS(input))
    return data.chatNotifications
  } catch(e) {
    throw new Error
  }
}

export type IGetMessagesReq = IGetMessagesQuery
export interface IGetMessagesRes {
  messages: Array<IMessage>,
  continue: boolean,
}
export const getMessages = async (input: IGetMessagesReq): Promise<IGetMessagesRes> => {
  try {
    const { data, } = await apiRequest(GET_MESSAGES(input))
    return data.getMessages
  } catch(e) {
    throw new Error
  }
}

export type IUpdateMessagesReq = IUpdateMessagesQuery
export interface IUpdateMessagesRes {
  messages: Array<IMessage>,
}
export const updateMessages = async (input: IUpdateMessagesReq): Promise<IUpdateMessagesRes> => {
  try {
    const { data, } = await apiRequest(UPDATE_MESSAGES(input))
    return data.updateMessages
  } catch(e) {
    throw new Error
  }
}

export type ISendMessageReq = ISendMessageMutation
export type ISendMessageRes = boolean
export const sendMessage = async (input: ISendMessageReq): Promise<ISendMessageRes> => {
  try {
    const { data, } = await apiRequest(SEND_MESSAGE(input))
    return data.sendMessage
  } catch(e) {
    throw new Error
  }
}

export type IReactMessageReq = IReactMessageMutation
export type IReactMessageRes = boolean
export const reactMessage = async (input: IReactMessageReq): Promise<IReactMessageRes> => {
  try {
    const { data, } = await apiRequest(REACT_MESSAGE(input))
    return data.sendMessage
  } catch(e) {
    throw new Error
  }
}

export type IAlertTypingReq = IAlertTypingQuery
export type IAlertTypingRes = boolean
export const alertTyping = async (input: IAlertTypingReq): Promise<IAlertTypingRes> => {
  try {
    const { data, } = await apiRequest(ALERT_TYPING(input))
    return data.sendMessage
  } catch(e) {
    throw new Error
  }
}
