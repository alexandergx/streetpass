import { createStore, combineReducers, applyMiddleware, Reducer, CombinedState, AnyAction, } from 'redux'
import thunk from 'redux-thunk'
import systemStore, { ISystemStore, } from '../reducers/SystemReducer'
import userStore, { IUserStore, } from '../reducers/UserReducer'
// import chatsStore, { IChatsStore } from '../reducers/ChatsReducer'
// import streetPassStore, { IStreetPassStore } from '../reducers/StreetPassReducer'
// import matchesStore, { IMatchesStore } from '../reducers/MatchesReducer'

export interface IStores {
  systemStore: ISystemStore,
  userStore: IUserStore,
  // streetPassStore: IStreetPassStore,
  // matchesStore: IMatchesStore,
  // chatsStore: IChatsStore,
}

const rootReducer: Reducer<CombinedState<IStores>, AnyAction> = combineReducers<IStores>({
  systemStore,
  userStore,
  // streetPassStore,
  // matchesStore,
  // chatsStore,
})

const configureStore = () => { return createStore(rootReducer, applyMiddleware(thunk)) }

export default configureStore
