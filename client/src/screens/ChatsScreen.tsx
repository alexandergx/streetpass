import React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import NavTabBar from '../components/navigation/NavTabBar'
import { Screens } from '../navigation'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../state/store'
import { IUserStore, } from '../state/reducers/UserReducer'
import { ISystemStore, } from '../state/reducers/SystemReducer'
import { FlashList, } from '@shopify/flash-list'
import { ScrollView } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import { BlurView } from '@react-native-community/blur'
import { timePassedSince, truncateString } from '../utils/functions'
import Thumbnail from '../components/thumbnail'
import ButtonInput from '../components/textInput/ButtonInput'
import SearchIcon from '../assets/icons/search.svg'
import CrossIcon from '../assets/icons/cross.svg'
import { IListGroupConfig } from '../components/listGroup'
import SelectionModal from '../components/selectionModal'
import DeleteIcon from '../assets/icons/delete.svg'
import ExclamationIcon from '../assets/icons/exclamation-circled.svg'
import GradientBackground from '../components/gradientBackground'
import { Lit, } from '../utils/locale'
import AnimatedBackground from '../components/animated/AnimatedBackground'
import { ThemeTypes } from '../utils/themes'
import { IMatchesStore } from '../state/reducers/MatchesReducer'
import { ISetMatches, IUnsetMatch, setMatches, unsetMatch } from '../state/actions/MatchesActions'
import { IChatsStore } from '../state/reducers/ChatsReducer'
import { ISetChats, ISetChatsSearch, IUnsetChat, setChats, setChatsSearch, unsetChat, unsetChatsSearch } from '../state/actions/ChatsActions'
import { blockUser } from '../api/user'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, matchesStore, chatsStore, } = state
  return { systemStore, userStore, matchesStore, chatsStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setChats,
      unsetChat,
      setChatsSearch,
      unsetChatsSearch,
      setMatches,
      unsetMatch,
    }
  ), dispatch),
})

interface IChatsScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  matchesStore: IMatchesStore,
  chatsStore: IChatsStore,
  actions: {
    setChats: (params: ISetChats) => void,
    unsetChat: (params: IUnsetChat) => void,
    setChatsSearch: (params: ISetChatsSearch) => void,
    unsetChatsSearch: () => void,
    setMatches: (params: ISetMatches) => void,
    unsetMatch: (params: IUnsetMatch) => void,
  },
}
interface IChatsScreenState {
  search: string,
  selectionModalConfig: IListGroupConfig | null,
  matchId: string | null,
  chatId: string | null,
  keyboard: boolean,
  paginatingMatches: boolean,
  paginatingChats: boolean,
}
class ChatsScreen extends React.Component<IChatsScreenProps> {
  constructor(props: IChatsScreenProps) {
    super(props)
    this.inputRef = this.inputRef.bind(this)
  }
  childInputRef: any
  inputRef(input: any) { this.childInputRef = input }

  state: IChatsScreenState = {
    search: '',
    selectionModalConfig: null,
    matchId: null,
    chatId: null,
    keyboard: false,
    paginatingMatches: false,
    paginatingChats: true,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  keyboardWillShow = () => this.setState({ keyboard: true, })
  keyboardWillHide = () => this.setState({ keyboard: false, })

  componentDidMount(): void {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount(): void {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  render() {
    const { navigation, systemStore, userStore, matchesStore, chatsStore, actions, }: IChatsScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <KeyboardAvoidingView
            behavior={'padding'}
            style={{flex: 1, width: '100%',}}
          >            
            <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode={'interactive'} style={{flex: 1, width: '100%', height: '100%',}}>
              <View style={{flex: 1, width: '100%', marginTop: 72,}}>

                <Text style={{paddingHorizontal: 16, marginBottom: 8, color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.cruiserWeight,}}>{matchesStore.matches?.length ? Lit[systemStore.Locale].Title.Matches : Lit[systemStore.Locale].Title.NoMatches}</Text>

                {matchesStore.matches && matchesStore.matches.length > 0 &&
                  <View style={{minWidth: 112,}}>
                    <FlashList
                      data={matchesStore.matches || []}
                      extraData={{ matchId: this.state.chatId, chatId: this.state.chatId, }}
                      estimatedItemSize={112}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={item => {
                        return (
                          <>
                            <TouchableOpacity
                              key={item.item.userId}
                              onPress={() => navigation.navigate(Screens.Chat, { match: item.item, })}
                              onLongPress={() => this.setState({
                                matchId: item.item.userId,
                                selectionModalConfig: {
                                  title: item.item.name,
                                  list: [
                                    { Icon: DeleteIcon, image: item.item.media[0].thumbnail, title: Lit[systemStore.Locale].Button.Unmatch, noRight: true, onPress: () => {
                                      actions.unsetMatch({ userId: item.item.userId, })
                                      actions.unsetChat(item.item.userId)
                                      this.setState({ matchId: null, selectionModalConfig: null, })
                                    }, },
                                    { Icon: DeleteIcon, title: Lit[systemStore.Locale].Button.Block, noRight: true, onPress: () => null, },
                                    { Icon: ExclamationIcon, title: Lit[systemStore.Locale].Button.Report, noRight: true, onPress: () => null, },
                                  ],
                                }
                              })}
                              activeOpacity={Colors.activeOpacity}
                              style={{marginLeft: item.index === 0 ? 16 : 0, marginRight: matchesStore.matches && item.index === matchesStore.matches.length - 1 ? 16 : 8, width: 96, aspectRatio: 1/1.2, borderRadius: 16, overflow: 'hidden',}}
                              >
                              {(this.state.matchId || this.state.chatId) && this.state.matchId !== item.item.userId &&
                                <BlurView
                                blurType={Colors.themeType === ThemeTypes.Dark ? undefined : Colors.safeLightBlur}
                                blurAmount={2}
                                style={{position: 'absolute', zIndex: 1, alignSelf: 'center', width: '100%', height: '100%', borderRadius: 16,}}
                                />
                              }
                              <FastImage key={item.index} source={{ uri: item.item.media[0].thumbnail, }} style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden',}} />

                              {!item.item.seen && <View style={{position: 'absolute', top: 8, right: 8, width: 12, aspectRatio: 1/1, borderRadius: 32, marginLeft: 8, backgroundColor: Colors.red,}} />}

                              <View style={{position: 'absolute', bottom: 6, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8,}}>
                                <BlurView
                                  blurType={Colors.safeLightBlur}
                                  style={{maxWidth: '100%', borderRadius: 8, overflow: 'hidden', paddingHorizontal: 8, height: 16, justifyContent: 'center', alignItems: 'center',}}
                                  >
                                  <Text numberOfLines={1} style={{textAlign: 'center', overflow: 'hidden', color: Colors.safeLightest, fontWeight: Fonts.middleWeight,}}>
                                    {truncateString(item.item.name, 10, 9)}
                                  </Text>
                                </BlurView>
                              </View>
                            </TouchableOpacity>
                          </>
                        )
                      }}
                      keyboardDismissMode={'interactive'}
                      keyboardShouldPersistTaps={'handled'}
                      onEndReached={async () => {
                        if (matchesStore.matches && matchesStore.continue && !this.state.paginatingMatches) {
                          this.setState({ paginatingMatches: true, })
                          await actions.setMatches({ index: matchesStore.matches.length, })
                          this.setState({ paginatingMatches: false, })
                        }
                      }}
                      // onEndReachedThreshold={0.2}
                      />
                  </View>
                }

                <Text style={{paddingHorizontal: 16, marginTop: 24, color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.cruiserWeight,}}>
                  {chatsStore.chatsSearch ? Lit[systemStore.Locale].Title.SearchResults : Lit[systemStore.Locale].Title.Chats}
                </Text>

                <View style={{flex: 0, width: '100%', marginBottom: 8, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 16,}}>
                  <ButtonInput
                    systemStore={systemStore}
                    inputRef={this.inputRef}
                    childInputRef={this.childInputRef}
                    value={this.state.search}
                    onChangeText={(text) => {
                      this.setState({ search: text, })
                      if (text.length > 0) actions.setChatsSearch({ name: text, })
                      else actions.unsetChatsSearch()
                    }}
                    placeholder={Lit[systemStore.Locale].Title.SearchChats}
                    StartIcon={SearchIcon}
                    onPressStart={() => this.childInputRef.focus()}
                    EndIcon={this.state.search.length > 0 || this.props.chatsStore.chatsSearch ? CrossIcon : undefined}
                    onPressEnd={() => {
                      this.setState({ search: '', })
                      actions.unsetChatsSearch()
                    }}
                  />
                </View>

                <View style={{minHeight: 72,}}>
                  <FlashList
                    data={chatsStore.chatsSearch ? chatsStore.chatsSearch : chatsStore.chats ? chatsStore.chats : []}
                    extraData={{ matchId: this.state.chatId, chatId: this.state.chatId, }}
                    estimatedItemSize={72}
                    showsVerticalScrollIndicator={false}
                    renderItem={item => {
                      return (
                        <>
                          <TouchableOpacity
                            key={item.item.chatId}
                            onPress={() => navigation.navigate(Screens.Chat, { match: item.item, })}
                            onLongPress={() => this.setState({
                              chatId: item.item.chatId,
                              selectionModalConfig: {
                                title: item.item.name,
                                list: [
                                  { Icon: DeleteIcon, image: item.item.media[0].thumbnail, title: Lit[systemStore.Locale].Button.Unmatch, noRight: true, onPress: () => {
                                    actions.unsetMatch({ userId: item.item.userId, })
                                    actions.unsetChat(item.item.userId)
                                    this.setState({ matchId: null, selectionModalConfig: null, })
                                  }, },
                                  { Icon: DeleteIcon, title: Lit[systemStore.Locale].Button.Block, noRight: true, onPress: () => {
                                    blockUser({ userId: item.item.userId, })
                                    actions.unsetMatch({ userId: item.item.userId, pass: true, })
                                    actions.unsetChat(item.item.userId)
                                  }, },
                                  { Icon: ExclamationIcon, title: Lit[systemStore.Locale].Button.Report, noRight: true, onPress: () => null, },
                                ],
                              }
                            })}
                            activeOpacity={Colors.activeOpacity}
                            style={{flexDirection: 'row', width: '100%', height: 72, justifyContent: 'center', alignItems: 'center', marginVertical: 4, paddingHorizontal: 16,}}
                          >
                            {(this.state.matchId || this.state.chatId) && this.state.chatId !== item.item.chatId &&
                              <BlurView
                                blurType={Colors.themeType === ThemeTypes.Dark ? undefined : Colors.safeLightBlur}
                                blurAmount={2}
                                style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', borderRadius: 16,}}
                              />
                            }
                            <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden',}}>
                              <BlurView
                                blurType={Colors.darkestBlur}
                                style={{
                                  position: 'absolute', zIndex: -1, width: '100%', height: '100%',
                                  backgroundColor: this.state.chatId === item.item.chatId
                                    ? Colors.darkerBackground : this.state.chatId ? undefined : Colors.darkBackground,
                                }}
                              />
                            </View>
                      
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                              <TouchableOpacity
                                onPress={() => null}
                                onLongPress={() => null}
                                style={{flex: 0, marginLeft: 8,}}
                              >
                                <Thumbnail systemStore={systemStore} uri={item.item.media[0].thumbnail} size={48} />
                              </TouchableOpacity>
                      
                              <View style={{flex: 1, justifyContent: 'center', marginHorizontal: 16,}}>
                                <View style={{flexDirection: 'row',}}>
                                  <Text numberOfLines={1} style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight, marginRight: 8, flex: 1,}}>{item.item.name}</Text>
                                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Text style={{color: Colors.lighter, fontWeight: Fonts.lightWeight,}}>{timePassedSince(item.item.chatDate, systemStore.Locale)}</Text>
                                    {item.item.unread && <View style={{width: 8, aspectRatio: 1/1, borderRadius: 32, marginLeft: 8, backgroundColor: Colors.red,}} />}
                                  </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4,}}>
                                  <Text
                                    numberOfLines={1} ellipsizeMode={'tail'}
                                    style={{color: Colors.lightest, fontWeight: Fonts.lightWeight,}}
                                  >
                                    {item.item.lastMessage}
                                  </Text>
                                  {item.item.lastMessageUserId !== userStore.user.userId &&
                                    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.lightBlue, borderRadius: 8, paddingHorizontal: 4,}}>
                                      <Text style={{color: Colors.safeLightest, fontSize: Fonts.sm, fontWeight: Fonts.heavyWeight,}}>Your turn</Text>
                                    </View>
                                  }
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </>
                      )
                    }}
                    keyboardDismissMode={'interactive'}
                    keyboardShouldPersistTaps={'handled'}
                    onEndReached={async () => {
                      if (chatsStore.chats && chatsStore.continue && !this.state.paginatingChats) {
                        this.setState({ paginatingChats: true, })
                        await actions.setChats({ index: chatsStore.chats.length, })
                        this.setState({ paginatingChats: false, })
                      }
                    }}
                    // onEndReachedThreshold={0.2}
                  />
                </View>
              </View>

              <View style={{height: this.state.keyboard ? 32 : 96,}} />
            </ScrollView>
          </KeyboardAvoidingView>

          <NavTabBar
            systemStore={systemStore}
            activeTab={Screens.Chats}
            profilePicture={userStore.user.media[0]?.thumbnail || null}
            onPressStreetpass={() => navigation.navigate(Screens.Streetpass)}
            onPressChat={() => null}
            onPressUser={() => navigation.navigate(Screens.User)}
          />
        </View>

        {this.state.selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={this.state.selectionModalConfig} clear={true} toggleModal={() => this.setState({ matchId: null, chatId: null, selectionModalConfig: null, })} />
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatsScreen)
