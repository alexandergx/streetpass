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
// import { IChatsStore, } from '../state/reducers/ChatsReducer'
import { FlashList, } from '@shopify/flash-list'
import { mockChats, mockMatches, } from '../utils/MockData'
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

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      //
    }
  ), dispatch),
})

interface IChatsScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  // chatsStore: IChatsStore,
  actions: {
    //
  },
}
interface IChatsScreenState {
  search: string,
  selectionModalConfig: IListGroupConfig | null,
  matchId: string | null,
  chatId: string | null,
  keyboard: boolean,
}
class ChatsScreen extends React.Component<IChatsScreenProps> {
  constructor(props: IChatsScreenProps) {
    super(props)
  }

  state: IChatsScreenState = {
    search: '',
    selectionModalConfig: null,
    matchId: null,
    chatId: null,
    keyboard: false,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  componentDidMount () {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }
  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }
  keyboardWillShow = () => {
    this.setState({ keyboard: true, })
  }
  keyboardWillHide = () => {
    this.setState({ keyboard: false, })
  }

  render() {
    const { navigation, systemStore, userStore, actions, }: IChatsScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    const matches = mockMatches
    const chats = mockChats

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <KeyboardAvoidingView
            behavior={'padding'}
            style={{flex: 1,}}
          >            
            <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode={'interactive'} style={{flex: 1, width: '100%', height: '100%',}}>
              <View style={{flex: 1, width: '100%', marginTop: 72,}}>
                <Text style={{paddingHorizontal: 16, marginBottom: 8, color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.cruiserWeight,}}>{Lit[systemStore.Locale].Title.Matches}</Text>

                <View style={{minWidth: 112,}}>
                  <FlashList
                    data={matches}
                    extraData={{ matchId: this.state.chatId, chatId: this.state.chatId, }}
                    estimatedItemSize={112}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={item => {
                      return (
                        <>
                          <TouchableOpacity
                            key={item.item.matchId}
                            onPress={() => navigation.navigate(Screens.Chat, { match: item.item, })}
                            onLongPress={() => this.setState({
                              matchId: item.item.matchId,
                              selectionModalConfig: {
                                title: item.item.name,
                                list: [
                                  { Icon: DeleteIcon, title: Lit[systemStore.Locale].Button.Remove, noRight: true, onPress: () => null, },
                                  { Icon: ExclamationIcon, title: Lit[systemStore.Locale].Button.Report, noRight: true, onPress: () => null, },
                                ],
                              }
                            })}
                            activeOpacity={Colors.activeOpacity}
                            style={{marginLeft: item.index === 0 ? 16 : 0, marginRight: item.index === matches.length - 1 ? 16 : 8, width: 112, aspectRatio: 1/1.2, borderRadius: 16, overflow: 'hidden',}}
                          >
                            {(this.state.matchId || this.state.chatId) && this.state.matchId !== item.item.matchId &&
                              <BlurView
                                blurType={Colors.themeType === ThemeTypes.Dark ? undefined : Colors.safeLightBlur}
                                blurAmount={2}
                                style={{position: 'absolute', zIndex: 1, alignSelf: 'center', width: '100%', height: '100%', borderRadius: 16,}}
                              />
                            }
                            <FastImage key={item.index} source={{ uri: item.item.media[0].image, }} style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden',}} />

                            {!item.item.seen && <View style={{position: 'absolute', top: 8, right: 8, width: 12, aspectRatio: 1/1, borderRadius: 32, marginLeft: 8, backgroundColor: Colors.red,}} />}

                            <View style={{position: 'absolute', bottom: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8,}}>
                              <BlurView
                                blurType={Colors.safeLightBlur as any}
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
                    onEndReached={() => null}
                    // onEndReachedThreshold={0.2}
                  />
                </View>

                {/* <Text style={{paddingHorizontal: 16, marginTop: 16, marginBottom: 8, color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.cruiserWeight,}}>Chats</Text> */}

                <View style={{flex: 0, width: '100%', marginTop: 16, marginBottom: 8, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 16,}}>
                  <ButtonInput
                    systemStore={systemStore}
                    // inputRef={this.inputRef}
                    // childInputRef={this.childInputRef}
                    value={''}
                    onChangeText={() => null}
                    placeholder={'Search chats'}
                    StartIcon={SearchIcon}
                    // onPressStart={() => this.childInputRef.focus()}
                    // EndIcon={this.state.search.length > 0 || this.props.chatsStore.chatsSearch ? CrossIcon : undefined}
                    onPressEnd={() => null}
                  />
                  {/* {this.state.search.length > 0 &&
                    <>
                      <View style={{marginBottom: 8, alignSelf: 'flex-start',}}>
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.middleWeight as any,}}>
                          {!this.props.chatsStore.chatsSearch && !this.state.searchLoading && this.state.search.length > 2 ? Lit[systemStore.Locale].Copywrite.NoResults : Lit[systemStore.Locale].Copywrite.SearchResults}
                        </Text>
                      </View>
                    </>
                  } */}
                </View>

                <View style={{minHeight: 72,}}>
                  <FlashList
                    data={chats}
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
                                  { Icon: DeleteIcon, title: Lit[systemStore.Locale].Button.Remove, noRight: true, onPress: () => null, },
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
                                blurType={Colors.darkestBlur as any}
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
                                <Thumbnail systemStore={systemStore} uri={item.item.media[0].image} size={48} />
                              </TouchableOpacity>
                      
                              <View style={{flex: 1, justifyContent: 'center', marginHorizontal: 16,}}>
                                <View style={{flexDirection: 'row',}}>
                                  <Text numberOfLines={1} style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any, marginRight: 8, flex: 1,}}>{item.item.name}</Text>
                                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                    <Text style={{color: Colors.lighter, fontWeight: Fonts.lightWeight as any,}}>{timePassedSince(item.item.updated, systemStore.Locale)}</Text>
                                    {item.item.unread && <View style={{width: 8, aspectRatio: 1/1, borderRadius: 32, marginLeft: 8, backgroundColor: Colors.red,}} />}
                                  </View>
                                </View>
                                <View style={{marginTop: 4,}}>
                                  <Text
                                    numberOfLines={1} ellipsizeMode={'tail'}
                                    style={{color: Colors.lightest, fontWeight: Fonts.lightWeight as any,}}
                                  >
                                    {item.item.lastMessage}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            {/* {item.item.chatId && this.state.chatLoading.includes(item.chatId) &&
                              <View style={{position: 'absolute', right: 0, marginRight: 22,}}>
                                <ActivityIndicator color={Colors.lighter} />
                              </View>
                            } */}
                          </TouchableOpacity>
                        </>
                      )
                    }}
                    keyboardDismissMode={'interactive'}
                    keyboardShouldPersistTaps={'handled'}
                    onEndReached={() => null}
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
            profilePicture={null}
            onPressStreetPass={() => navigation.navigate(Screens.StreetPass)}
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
