import { CHAT_NOTIFICATIONS, GET_CHATS, GET_MESSAGES, IChatNotificationsMutation, IGetChatsQuery, IGetMessagesQuery, IReadChatMutation, ISearchChatsQuery, ISendMessageMutation, READ_CHAT, SEARCH_CHATS, SEND_MESSAGE, apiRequest } from '.'
import { IChat, IMessage } from '../state/reducers/ChatsReducer'

export type IGetChatsReq = IGetChatsQuery
export interface IGetChatsRes {
  chats: Array<IChat>,
  continue: boolean,
}
export const getChats = async (input: IGetChatsReq): Promise<IGetChatsRes> => {
  try {
    const { data, } = await apiRequest(GET_CHATS(input))
    return data.getChats
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

