import { createStore, combineReducers, applyMiddleware, Reducer, CombinedState, AnyAction, } from 'redux'
import thunk from 'redux-thunk'
import systemStore, { ISystemStore, } from '../reducers/SystemReducer'
import userStore, { IUserStore, } from '../reducers/UserReducer'
import streetpassStore, { IStreetpassStore } from '../reducers/StreetpassReducer'
import matchesStore, { IMatchesStore } from '../reducers/MatchesReducer'
import chatsStore, { IChatsStore } from '../reducers/ChatsReducer'

export interface IStores {
  systemStore: ISystemStore,
  userStore: IUserStore,
  streetpassStore: IStreetpassStore,
  matchesStore: IMatchesStore,
  chatsStore: IChatsStore,
}

const rootReducer: Reducer<CombinedState<IStores>, AnyAction> = combineReducers<IStores>({
  systemStore,
  userStore,
  streetpassStore,
  matchesStore,
  chatsStore,
})

const configureStore = () => { return createStore(rootReducer, applyMiddleware(thunk)) }

export default configureStore
