import { ApolloClient, gql, InMemoryCache, split, } from '@apollo/client'
import { MMKVLoader, } from 'react-native-mmkv-storage'
import { createUploadLink as customLink, } from './utils'
import { createUploadLink as apolloLink, } from 'apollo-upload-client'
import { GraphQLWsLink, } from '@apollo/client/link/subscriptions'
import { createClient, } from 'graphql-ws'
import { getMainDefinition, } from '@apollo/client/utilities'
import { AuthStore, Errors, LocalStorage, } from '../utils/constants'
import { formatMultiline, } from '../utils/functions'
import { INotificationPreferences, IStreetPassPreferences } from '../state/reducers/UserReducer'

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()
export const getAccessHeaders = () => { return { 'access-token': MMKV.getString(AuthStore.AccessToken), } }
export const getRefreshHeaders = () => { return { 'refresh-token': MMKV.getString(AuthStore.RefreshToken), } }

let env: string
// env = 'prod'
env = 'dev'
export const baseUrl = (env == 'prod') ? 'streetpass.app' : 'localhost:8080' // 'localhost:8080' // development simulator, '192.168.0.11:8080' // development home, '10.0.0.2:8080' // development away
export const protocol = (env == 'prod') ? { 0: 'https://', 1: 'wss://', } : { 0: 'http://', 1: 'ws://', }
const wsLink = new GraphQLWsLink(
  createClient({ url: `${protocol[1]}${baseUrl}/graphql`,
    lazy: true,
    shouldRetry: () => true, retryAttempts: 10,
    connectionParams: () => { return getAccessHeaders() },
  }),
)

const customSplitLink = split(({ query, }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  customLink({ uri: `${protocol[0]}${baseUrl}/graphql`, }),
)
const apolloSplitLink = split(({ query, }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  apolloLink({ uri: `${protocol[0]}${baseUrl}/graphql`, }),
)
export const customClient = new ApolloClient({
  link: customSplitLink,
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: 'no-cache', errorPolicy: 'all', }, },
})
export const apolloClient = new ApolloClient({
  link: apolloSplitLink,
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: 'no-cache', errorPolicy: 'all', }, },
})

export const apiRequest = async (request: any = null, refresh: boolean = false): Promise<any> => {
  let client = customClient
  // client = apolloClient
  // TODO - if slow connection, use apolloClient
  // TODO - alert slow connection, don't close app
  try {
    if (request === null) throw { message: Errors.ForceRefresh, }

    let response
    switch (request.definitions[0].operation) {
      case 'query': response = await client.query({ query: request, context: { headers: getAccessHeaders(), }, }); break
      case 'mutation': response = await client.mutate({ mutation: request, context: { headers: getAccessHeaders(), }, }); break
      default: throw new Error(`[ERROR] bad operation: ${request.definitions[0].operation}`)
    }

    const accessToken = response.data?.signIn?.accessToken || undefined
    const refreshToken = response.data?.signIn?.refreshToken || undefined
    if (accessToken && refreshToken) {
      MMKV.setString(AuthStore.AccessToken, accessToken)
      MMKV.setString(AuthStore.RefreshToken, refreshToken)
    }

    if (response.errors) { throw response.errors[0] }
    return response
  } catch(e: any) {
    if ([Errors.JwtExpired, Errors.ForceRefresh].includes(e?.message) && !refresh) {
      try {
        const refreshHeaders = getRefreshHeaders()
        if (refreshHeaders) {
          const { data, } = await client.query({ query: REFRESH_TOKENS(), context: { headers: getRefreshHeaders(), }, })
          MMKV.setString(AuthStore.AccessToken, data.refreshTokens.accessToken)
          MMKV.setString(AuthStore.RefreshToken, data.refreshTokens.refreshToken)
          if (request === null) return true
          return await apiRequest(request, true)
        } else throw new Error(Errors.AuthError)
      } catch(e: any) {
        console.log('[FATAL ERROR]', e, request?.definitions)
        throw new Error(e?.message)
      }
    } else {
      if ([Errors.JwtMalformed, Errors.InvalidSignature].includes(e?.message)) {
        MMKV.removeItem(AuthStore.AccessToken)
        MMKV.removeItem(AuthStore.RefreshToken)
      }
      console.log('[API ERROR]', e, request?.definitions)
      throw new Error(e?.message)
    }
  }
}

export const inputConstructor = (input: any, override = false) => {
  let inputVariables = ''
  for (const val of Object.keys(input)) {
    if (input[val] || typeof(input[val]) === 'boolean' || typeof(input[val]) === 'number' || (input[val] !== undefined && override)) {
      if (typeof(input[val]) === 'boolean' || typeof(input[val]) === 'number') inputVariables = inputVariables + `${val}: ${input[val]},`
      else if (typeof(input[val]) === 'string' && override) inputVariables = inputVariables + `${val}: "${formatMultiline(input[val])}",`
      else if (typeof(input[val]) === 'object' && Object.prototype.toString.call(input[val]) === '[object Object]') inputVariables = inputVariables + `${val}: "${JSON.stringify(input[val]).replace(/"/g, '\\"')}",`
      else if (Array.isArray(input[val]) && input[val].length > 0 && typeof(input[val][0]) === 'string') inputVariables = inputVariables + `${val}: [${input[val].map((i: any) => `"${i}"`).join(', ')}],`
      else if (Array.isArray(input[val]) && input[val].length > 0 && typeof(input[val][0]) === 'number') inputVariables = inputVariables + `${val}: [${input[val].join(', ')}],`
      else if (input[val]) inputVariables = inputVariables + `${val}: "${input[val]}",`
    }
  }
  return inputVariables
}

export const REFRESH_TOKENS = () => gql`
  query {
    refreshTokens {
      accessToken,
      refreshToken,
    }
  }
`

export interface ISignInMutation {
  appleAuth?: string,
}
export const SIGN_IN = (input: ISignInMutation) => {
  let mutation = `
    mutation {
      signIn(input: {
  `
  mutation = mutation + inputConstructor(input)
  mutation = mutation + `
      }) {
        accessToken
        refreshToken
        user {
          userId
          phoneNumber
          countryCode
          email
          name
          dob
          sex
          bio
          work
          school
          streetPassPreferences {
            discoverable
            location
            sex
            age
          }
          notificationPreferences {
            messages
            matches
            streetPasses
            emails
            newsletters
          }
          media {
            mediaId
            image
            video
            thumbnail
          }
        }
        code
      }
    }
  `
  return gql(mutation)
}

export interface ISendPinMutation {
  phoneNumber: string,
  countryCode: string,
}
export const SEND_PIN = (input: ISendPinMutation) => {
  let mutation = `
    mutation {
      sendPin(input: {
  `
  mutation = mutation + inputConstructor(input)
  mutation = mutation + `
      })
    }
  `
  return gql(mutation)
}

export interface IVerifyPhoneNumberMutation {
  securityPin: string,
}
export const VERIFY_PHONE_NUMBER = (input: IVerifyPhoneNumberMutation) => {
  let mutation = `
    mutation {
      verifyPhoneNumber(input: {
  `
  mutation = mutation + inputConstructor(input)
  mutation = mutation + `
      })
    }
  `
  return gql(mutation)
}

export interface IGetUserQuery {
  userId?: string,
}
export const GET_USER = (input: IGetUserQuery) => {
  let query = `
    query {
      getUser(input: {
  `
  query = query + inputConstructor(input)
  query = query + `
      }) {
        userId
        name
        bio
        work
        school
        sex
        age
        media {
          mediaId
          image
          video
          thumbnail
        }
      }
    }
  `
  return gql(query)
}

export interface IUpdateUserMutation {
  email?: string,
  name?: string,
  dob?: Date,
  sex?: boolean | null,
  bio?: string,
  work?: string,
  school?: string,
  streetPass?: boolean,
  streetPassPreferences?: IStreetPassPreferences,
  notificationPreferences?: INotificationPreferences,
}
export const UPDATE_USER = (input: IUpdateUserMutation) => {
  let mutation = `
    mutation {
      updateUser(input: {
  `
  mutation = mutation + inputConstructor(input)
  mutation = mutation + `
      })
    }
  `
  return gql(mutation)
}

export const UPLOAD_IMAGE = () => gql`
  mutation($file: Upload) {
    uploadMedia(input: { image: $file })
  }
`

export const UPLOAD_VIDEO = () => gql`
  mutation($file: Upload) {
    uploadMedia(input: { video: $file })
  }
`

export interface ISortMediaMutation {
  mediaIds: Array<string | null>,
}
export const SORT_MEDIA = (input: ISortMediaMutation) => {
  let mutation = `
    mutation {
      sortMedia(input: {
  `
  mutation = mutation + inputConstructor(input)
  mutation = mutation + `
      })
    }
  `
  return gql(mutation)
}
