import { createStore, combineReducers, applyMiddleware, Reducer, CombinedState, AnyAction, } from 'redux'
import thunk from 'redux-thunk'
import userStore, { IUserStore, } from '../reducers/UserReducer'
import systemStore, { ISystemStore, } from '../reducers/SystemReducer'
import chatsStore, { IChatsStore } from '../reducers/ChatsReducer'

export interface IStores {
  userStore: IUserStore,
  systemStore: ISystemStore,
  chatsStore: IChatsStore,
}

const rootReducer: Reducer<CombinedState<IStores>, AnyAction> = combineReducers<IStores>({
  userStore,
  systemStore,
  chatsStore,
})

const configureStore = () => { return createStore(rootReducer, applyMiddleware(thunk)) }

export default configureStore
