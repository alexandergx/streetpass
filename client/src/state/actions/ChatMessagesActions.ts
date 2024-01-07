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

export interface ISetChatTyping {
  userId: string,
  typing: Date | null,
}
export function setChatTyping(input: ISetChatTyping) {
  return {
    type: ChatMessagesActions.SetChatTyping,
    payload: input,
  }
}
