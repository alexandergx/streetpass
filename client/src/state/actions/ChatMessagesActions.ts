import { ChatMessagesActions } from '../reducers/ChatMessagesReducer'

export function initChatMessages() {
  return {
    type: ChatMessagesActions.Init,
  }
}

export interface ISetChatMessage {
  userId: string,
  message: string,
}
export function setChatMessage(input: ISetChatMessage) {
  return {
    type: ChatMessagesActions.SetChatMessage,
    payload: input,
  }
}
