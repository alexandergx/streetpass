import React from 'react'
import {
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { Screens } from '../../navigation'
import { ISystemStore } from '../../state/reducers/SystemReducer'
// import { ISetBlocking, setBlocking, unsetBlocking, setBlockUser, ISetBlockUser, } from '../../state/actions/UserActions'
import ProfileItem from '../../components/profileItem'
import { IUserStore } from '../../state/reducers/UserReducer'
import EllipsisIcon from '../../assets/icons/ellipsis.svg'
import RestrictedIcon from '../../assets/icons/restricted.svg'
import ExclamationCircledIcon from '../../assets/icons/exclamation-circled.svg'
import SelectionModal from '../../components/selectionModal'
import { IListGroupConfig } from '../../components/listGroup'
import { baseUrl, protocol } from '../../api'
import { BlurView } from '@react-native-community/blur'
import { hardVibrate } from '../../utils/services'
import { Lit } from '../../utils/locale'
import { FlashList, } from '@shopify/flash-list'
import NotFound from '../../components/notFound'
import AnimatedBackground from '../../components/animated/AnimatedBackground'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      // setBlocking,
      // unsetBlocking,
      // setBlockUser,
    }
  ), dispatch),
})

interface IBlockingScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    // setBlocking: (params: ISetBlocking) => void,
    // unsetBlocking: () => void,
    // setBlockUser: (params: ISetBlockUser) => void,
  }
}
interface IBlockingScreenState {
  refreshing: boolean,
  loading: boolean,
  userId: string | null,
  profileLoading: Array<string>,
  selectionModalConfig: IListGroupConfig | null,
}
class BlockingScreen extends React.Component<IBlockingScreenProps> {
  state: IBlockingScreenState = {
    refreshing: false,
    loading: false,
    userId: null,
    profileLoading: [],
    selectionModalConfig: null,
  }

  UNSAFE_componentWillMount(): void {
    this.loadBlocking()
  }

  componentWillUnmount(): void {
    this.unloadBlocking()
  }

  loadBlocking = async (refresh = false) => {
    // if ((this.props.userStore.blockingPage !== -1 || refresh) && !this.state.loading) {
    //   this.setState({ loading: true, })
    //   await this.props.actions.setBlocking({
    //     index: refresh ? undefined
    //       : (this.props.userStore?.blocking && this.props.userStore?.blocking[this.props.userStore?.blocking.length - 1].userId) || undefined,
    //     blockingPage : refresh ? null : this.props.userStore.blockingPage,
    //   })
    //   this.setState({ loading: false, })
    // }
  }

  refreshBlocking = async () => {
    // this.setState({ refreshing: true, })
    // await this.loadBlocking(true)
    // this.setState({ refreshing: false, })
  }

  unloadBlocking = () => {
    // this.props.actions.unsetBlocking()
  }

  handleUnblockUser = (userId: string, username: string) => {
    // Alert.alert(
    //   Lit[this.props.systemStore.Locale].Copywrite.Unblock[0], `${username} ${Lit[this.props.systemStore.Locale].Copywrite.Unblock[1]}`,
    //   [
    //     { text: Lit[this.props.systemStore.Locale].Button.Unblock, onPress: async () => {
    //       this.setState({ selectionModalConfig: null, })
    //       this.setState({ profileLoading: [userId, ...this.state.profileLoading], })
    //       await this.props.actions.setBlockUser(userId)
    //       this.setState({ profileLoading: this.state.profileLoading.filter(i => i !== userId), userId: null, })
    //     }},
    //     { text: Lit[this.props.systemStore.Locale].Button.Cancel, onPress: () => null, style: 'cancel', },
    //   ]
    // )
  }

  render() {
    const { navigation, systemStore, userStore, }: IBlockingScreenProps = this.props
    const { Colors, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.BlockingScreen} />

        <View
          style={{
            flex: 1, display: 'flex', width: '100%',
            justifyContent: 'center', alignItems: 'center',
          }}
        >
          <View style={{flex: 1, width: '100%',}}>
            <FlashList
              data={userStore.blocking || []}
              extraData={this.state.userId}
              estimatedItemSize={80}
              ListHeaderComponent={
                <>
                  <View style={{height: 16,}} />
                  {this.state.selectionModalConfig &&
                    <TouchableOpacity
                      onPress={() => this.setState({ userId: null, selectionModalConfig: null, })}
                      style={{
                        position: 'absolute', zIndex: 0, width: '100%', display: 'flex',
                        height: Dimensions.get('window').height * (userStore.blocking?.length || 1), 
                      }}
                    >
                      <BlurView blurAmount={2} style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%',}} />
                    </TouchableOpacity>
                  }
                </>
              }
              renderItem={({ item, index, }) => {
                const config = {
                  title: item.name,
                  list: [
                    { Icon: RestrictedIcon, title: Lit[systemStore.Locale].Button.Unblock, noRight: true, onPress: () => this.handleUnblockUser(item.userId, item.name), },
                    { Icon: ExclamationCircledIcon, title: Lit[systemStore.Locale].Button.Report, noRight: true, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/help`), },
                  ],
                }
                return (
                  <View key={index} style={{paddingHorizontal: 16,}}>
                    <ProfileItem
                      systemStore={systemStore}
                      profile={item}
                      active={this.state.userId === item.userId}
                      blur={this.state.userId && this.state.userId !== item.userId || false}
                      loading={this.state.profileLoading.includes(item.userId as never)}
                      onPress={() => {
                        hardVibrate()
                        this.setState({
                          userId: item.userId,
                          selectionModalConfig: config,
                        })
                      }}
                    />
                  </View>
                )
              }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={(
                <>
                  <View style={{height: 16,}} />
                  <View style={{paddingHorizontal: 16,}}>
                    <NotFound
                      systemStore={systemStore}
                      empty={userStore.blocking && userStore.blocking.length !== 0 ? false : true}
                      loading={this.state.loading}
                      terminus={userStore.blockingPage === -1}
                    />
                  </View>
                  {/* {!userStore.blockingPage && userStore.blockingPage !== -1 && !this.state.refreshing && this.state.loading &&
                    <ActivityIndicator color={Colors.lighter} style={{position: 'absolute', width: '100%', marginTop: 16, alignSelf: 'center',}} />
                  } */}
                  <View style={{height: 32,}} />
                </>
              )}
              onEndReached={() => userStore.blocking ? this.loadBlocking() : null}
              // onEndReachedThreshold={0.2}
              refreshControl={
                <RefreshControl
                  tintColor={Colors.lighter}
                  refreshing={this.state.refreshing}
                  onRefresh={this.refreshBlocking}
                />
              }
            />
          </View>
        </View>

        {this.state.selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={this.state.selectionModalConfig} clear={true} toggleModal={() => this.setState({ userId: null, selectionModalConfig: null, })} />
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlockingScreen)
