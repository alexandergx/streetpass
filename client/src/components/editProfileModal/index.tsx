import React, { RefObject } from 'react'
import { Dimensions, Keyboard, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View, } from 'react-native'
import { IMedia, IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { BlurView } from '@react-native-community/blur'
import NavHeader from '../navigation/NavHeader'
import CrossIcon from '../../assets/icons/cross.svg'
import CrossCircledIcon from '../../assets/icons/cross-circled.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import ProfileIcon from '../../assets/icons/profile.svg'
import PhotoIcon from '../../assets/icons/photo.svg'
import Button from '../button'
import { DraggableGrid } from 'react-native-draggable-grid'
import FastImage from 'react-native-fast-image'
import TextInput from '../textInput'
import { InputLimits, } from '../../utils/constants'
import { Lit, } from '../../utils/locale'
import { ISetSortMedia, ISetUpdateUser, } from '../../state/actions/UserActions'
import ProfileMedia, { ProfileMediaMethods } from './profileMedia'
import SelectionModal from '../selectionModal'
import { IListGroupConfig } from '../listGroup'
import { Screens } from '../../navigation'
import CameraModal from '../cameraModal'

export interface IUploadMedia {
  key: number | null,
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
    this.scrollRef = React.createRef()
    this.profileMediaRef = React.createRef()
  }
  scrollRef: RefObject<ScrollView>
  profileMediaRef: RefObject<ProfileMediaMethods>

  state: IEditProfileModalState = {
    media: [...(this.props.userStore.user.media || []).map((item, index) => { return { key: index, mediaId: item.mediaId, image: item.image, video: item.video, thumbnail: item.thumbnail, new: false, } }), { key: null, mediaId: null, new: false, }].slice(0, 9),
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
  }

  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
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
      this.props.onPress ? this.props.onPress() : this.props.toggleModal()
    }
    this.setState({ loading: false, editProfile: true, })
  }

  render() {
    const { systemStore, userStore, toggleModal, onPress, }: IEditProfileModalProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%',}}>
          <NavHeader
            systemStore={systemStore}
            title={`${userStore.user.name}`}
            color={Colors.lightest}
            StartIcon={onPress ? undefined : CrossIcon}
            onPress={toggleModal}
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
                    blurType={Colors.darkestBlur as any}
                    style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.darkBackground,}}
                  />

                  <View style={{padding: 16,}}>
                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                      <View style={{flex: 1, marginRight: 8,}}>
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any, fontSize: Fonts.md,}}>{Lit[systemStore.Locale].Title.Bio}</Text>
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
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any, fontSize: Fonts.md,}}>{Lit[systemStore.Locale].Title.Work}</Text>
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
                        <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any, fontSize: Fonts.md,}}>{Lit[systemStore.Locale].Title.School}</Text>
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
        </BlurView>

        {this.state.camera &&
          <CameraModal
            systemStore={systemStore}
            toggleModal={() => this.setState({ camera: false, })}
            onCapture={({ image, video, }) => this.setState({ camera: false, media: [...this.state.media.filter((i: IUploadMedia) => i.key !== null), { image: image, video: video, key: this.state.media.length, new: true, }, { key: null, }].slice(0, 9), })}
          />
        }

        {this.state.selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={this.state.selectionModalConfig} toggleModal={() => this.setState({ selectionModalConfig: null, })} />
        }
      </>
    )
  }
}

export default EditProfileModal
