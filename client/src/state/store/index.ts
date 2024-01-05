import { createStore, combineReducers, applyMiddleware, Reducer, CombinedState, AnyAction, } from 'redux'
import thunk from 'redux-thunk'
import systemStore, { ISystemStore, } from '../reducers/SystemReducer'
import userStore, { IUserStore, } from '../reducers/UserReducer'
import streetpassStore, { IStreetpassStore } from '../reducers/StreetpassReducer'
import matchesStore, { IMatchesStore } from '../reducers/MatchesReducer'
import chatsStore, { IChatsStore } from '../reducers/ChatsReducer'
import chatMessagesStore, { IChatMessagesStore } from '../reducers/ChatMessagesReducer'

export interface IStores {
  systemStore: ISystemStore,
  userStore: IUserStore,
  streetpassStore: IStreetpassStore,
  matchesStore: IMatchesStore,
  chatsStore: IChatsStore,
  chatMessagesStore: IChatMessagesStore,
}

const rootReducer: Reducer<CombinedState<IStores>, AnyAction> = combineReducers<IStores>({
  systemStore,
  userStore,
  streetpassStore,
  matchesStore,
  chatsStore,
  chatMessagesStore,
})

const configureStore = () => { return createStore(rootReducer, applyMiddleware(thunk)) }

export default configureStore
