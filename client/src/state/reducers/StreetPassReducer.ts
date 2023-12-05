// import { InputLimits, } from '../../utils/constants'

export interface ICoordinates { lat: number, lon: number, }

export interface IStreetPassPreview {
  userId: string,
  name: string,
  profilePicture: string,
}

export interface IStreetPass {
  userId: string,
  name: string,
  age: number,
  sex: boolean | null,
  bio: string,
  coordinates?: ICoordinates,
  date: Date,
  media: Array<{
    image?: string,
    video?: string,
  }>
}

export interface IStreetPassStore {
  streetPasses: Array<IStreetPass> | null,
  blocking: Array<IStreetPassPreview> | null,
  blockingPage: number | null,
}

export enum StreetPassActions {
  Init = 'INIT',
}

type StreetPassAction =
  | { type: StreetPassActions.Init, }

const INITIAL_STATE: IStreetPassStore = {
  streetPasses: null,
  blocking: null,
  blockingPage: null,
}

const streetPassStore = (state = INITIAL_STATE as IStreetPassStore, action: StreetPassAction) => {
  switch (action.type) {
    case StreetPassActions.Init:
      return INITIAL_STATE
    default:
      return state
  }
}

export default streetPassStore
