import React, { RefObject } from 'react'
import { Animated, Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, Text, View, } from 'react-native'
import { IUserStore, } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { BlurView } from '@react-native-community/blur'
import NavHeader from '../navigation/NavHeader'
import CrossIcon from '../../assets/icons/cross.svg'
import Button from '../button'
import TextInput from '../textInput'
import { InputLimits, } from '../../utils/constants'
import { Lit, } from '../../utils/locale'
import { ISetSortMedia, ISetUpdateUser, } from '../../state/actions/UserActions'
import ProfileMedia, { ProfileMediaMethods } from './profileMedia'
import SelectionModal from '../selectionModal'
import { IListGroupConfig } from '../listGroup'
import CameraModal from '../cameraModal'

export interface IUploadMedia {
  key: number,
  mediaId: string | null,
  image?: string,
  video?: string,
  thumbnail?: string,
  new: boolean,
}

export interface IEditProfileModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  onPress?: () => void,
  actions: {
    setUser: () => void,
    setUpdateUser: (params: ISetUpdateUser) => void,
    setSortMedia: (params: ISetSortMedia) => void,
  }
}
export interface IEditProfileModalState {
  media: Array<IUploadMedia>,
  deletedMedia: Array<string>,
  scroll: boolean,
  keyboard: boolean,
  loading: boolean,
  bio: string,
  work: string,
  school: string,
  selectionModalConfig: IListGroupConfig | null,
  camera: boolean,
}
class EditProfileModal extends React.Component<IEditProfileModalProps> {
  constructor(props: IEditProfileModalProps) {
    super(props)
    this.fadeAnim = new Animated.Value(0)
    this.heightAnim = new Animated.Value(Dimensions.get('window').height)
    this.scrollRef = React.createRef()
    this.profileMediaRef = React.createRef()
  }
  fadeAnim: Animated.Value
  heightAnim: Animated.Value
  scrollRef: RefObject<ScrollView>
  profileMediaRef: RefObject<ProfileMediaMethods>

  state: IEditProfileModalState = {
    media: [...(this.props.userStore.user.media || []).map((item, index) => { return { key: index, mediaId: item.mediaId, image: item.image, video: item.video, thumbnail: item.thumbnail, new: false, } }), { key: -1, mediaId: null, new: false, }].slice(0, 9),
    deletedMedia: [],
    scroll: true,
    keyboard: false,
    loading: false,
    bio: this.props.userStore.user.bio || '',
    work: this.props.userStore.user.work || '',
    school: this.props.userStore.user.school || '',
    selectionModalConfig: null,
    camera: false,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  keyboardWillShow = () => this.setState({ keyboard: true, })
  keyboardWillHide = () => this.setState({ keyboard: false, })

  componentDidMount () {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true, }),
      Animated.timing(this.heightAnim, { toValue: 0, duration: 200, useNativeDriver: true, }),
    ]).start()
  }

  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  close = () => {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true, }),
      Animated.timing(this.heightAnim, { toValue: Dimensions.get('window').height, duration: 200, useNativeDriver: true, }),
    ]).start(() => this.props.toggleModal())
  }

  handleUpdateProfile = async () => {
    this.setState({ loading: true, })
    if (this.profileMediaRef.current) {
      const result = await this.profileMediaRef.current.save()
      if (result && (
        this.state.bio !== this.props.userStore.user.bio
        || this.state.work !== this.props.userStore.user.work
        || this.state.school !== this.props.userStore.user.school
      )) await this.props.actions.setUpdateUser({ bio: this.state.bio, work: this.state.work, school: this.state.school, })
      await this.props.actions.setUser()
      // this.props.navigation.navigate(Screens.Streetpass)
      this.props.onPress ? this.props.onPress() : this.close()
    }
    this.setState({ loading: false, editProfile: true, })
  }

  render() {
    const { systemStore, userStore, onPress, }: IEditProfileModalProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <Animated.View style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%', opacity: this.fadeAnim, transform: [{ translateY: this.heightAnim, }],}}>
        <BlurView blurType={Colors.darkBlur } style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%',}}>
          <NavHeader
            systemStore={systemStore}
            title={`${userStore.user.name}`}
            color={Colors.lightest}
            StartIcon={onPress ? undefined : CrossIcon}
            onPress={this.close}
          />

          <KeyboardAvoidingView
            behavior={'padding'}
            style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,}}
          >
            <View style={{flex: 1, width: '100%',}}>
              <ScrollView ref={this.scrollRef} scrollEnabled={this.state.scroll} showsVerticalScrollIndicator={false} keyboardDismissMode={'interactive'} style={{width: '100%',}}>
                <ProfileMedia
                  ref={this.profileMediaRef}
                  systemStore={systemStore}
                  state={this.state}
                  setState={(params) => this.setState({ ...params, })}
                  actions={{
                    setSortMedia: this.props.actions.setSortMedia,
                  }}
                />

                <View style={{zIndex: -1, width: '100%', borderRadius: 16, overflow: 'hidden',}}>
                  <BlurView
                    blurType={Colors.darkestBlur }
                    style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.darkBackground,}}
                  />

                  <View style={{padding: 16,}}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                      <View style={{flex: 1, marginRight: 8,}}>
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight , fontSize: Fonts.md,}}>{Lit[systemStore.Locale].Title.Bio}</Text>
                      </View>
                      <View style={{flex: 5,}}>
                        <TextInput
                          systemStore={systemStore}
                          value={this.state.bio}
                          placeholder={Lit[systemStore.Locale].Copywrite.Bio}
                          textColor={this.state.bio.length > InputLimits.DescriptionMax ? Colors.red : undefined}
                          multiline={true}
                          onChangeText={(text: string) => this.setState({ bio: text, })}
                          onStartEditing={() => setTimeout(() => this.scrollRef?.current?.scrollToEnd({ animated: true, }), 500)}
                        />
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                      <View style={{flex: 2, marginRight: 8,}}>
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight , fontSize: Fonts.md,}}>{Lit[systemStore.Locale].Title.Work}</Text>
                      </View>
                      <View style={{flex: 5,}}>
                        <TextInput
                          systemStore={systemStore}
                          value={this.state.work}
                          placeholder={Lit[systemStore.Locale].Copywrite.Work}
                          textColor={this.state.work.length > InputLimits.NameMax ? Colors.red : undefined}
                          onChangeText={(text: string) => this.setState({ work: text, })}
                          onStartEditing={() => setTimeout(() => this.scrollRef?.current?.scrollToEnd({ animated: true, }), 500)}
                        />
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                      <View style={{flex: 2, marginRight: 8,}}>
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight , fontSize: Fonts.md,}}>{Lit[systemStore.Locale].Title.School}</Text>
                      </View>
                      <View style={{flex: 5,}}>
                        <TextInput
                          systemStore={systemStore}
                          value={this.state.school}
                          placeholder={Lit[systemStore.Locale].Copywrite.School}
                          textColor={this.state.school.length > InputLimits.NameMax ? Colors.red : undefined}
                          onChangeText={(text: string) => this.setState({ school: text, })}
                          onStartEditing={() => setTimeout(() => this.scrollRef?.current?.scrollToEnd({ animated: true, }), 500)}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{height: 32,}} />
              </ScrollView>
            </View>

            <View style={{flex: 0, width: '100%', marginBottom: this.state.keyboard ? 0 : 32,}}>
              <Button
                systemStore={systemStore}
                onPress={this.handleUpdateProfile}
                title={Lit[systemStore.Locale].Button.Save}
                disabled={this.state.media.filter((i: any) => i.key !== null).length === 0}
                loading={this.state.loading}
              />
            </View>
          </KeyboardAvoidingView>

          {this.state.selectionModalConfig &&
            <SelectionModal systemStore={systemStore} config={this.state.selectionModalConfig} toggleModal={() => this.setState({ selectionModalConfig: null, })} />
          }
        </BlurView>

        {this.state.camera &&
          <CameraModal
            systemStore={systemStore}
            toggleModal={() => this.setState({ camera: false, })}
            onCapture={({ image, video, }) => this.setState({ camera: false, media: [...this.state.media.filter((i: IUploadMedia) => i.key !== null), { image: image, video: video, key: this.state.media.length, new: true, }, { key: -1, }].slice(0, 9), })}
          />
        }
      </Animated.View>
    )
  }
}

export default EditProfileModal
