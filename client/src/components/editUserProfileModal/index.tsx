import React from 'react'
import {
  Keyboard,
} from 'react-native'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISignupUsernameCheck, ISetUpdateProfile, } from '../../state/actions/UserActions'
import { validateUsername, } from '../../utils/functions'
import GalleryIcon from '../../assets/icons/gallery.svg'
import CameraIcon from '../../assets/icons/camera.svg'
import DeleteIcon from '../../assets/icons/delete.svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import ImagePicker from 'react-native-image-crop-picker'
import ProfileBlock from './profileBlock'
import { IListGroupConfig } from '../listGroup'
import { softVibrate } from '../../utils/services'
import { Lit } from '../../utils/locale'

interface IEditUserProfileModalProps {
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  actions: {
    setUser: () => void,
    signupUsernameCheck: (params: ISignupUsernameCheck) => void,
    setUpdateProfile: (params: ISetUpdateProfile) => void,
  }
}
export interface IEditUserProfileModalState {
  keyboard: boolean,
  loading: boolean,
  profilePicture: string | null,
  username: string,
  name: string,
  bio: string,
  usernameNotice: string | null,
  selectionModalConfig: IListGroupConfig | null,
}
class EditUserProfileModal extends React.Component<IEditUserProfileModalProps> {
  state: IEditUserProfileModalState = {
    keyboard: false,
    loading: false,
    profilePicture: this.props.userStore?.user?.profilePicture,
    username: this.props.userStore.user.username || '',
    name: this.props.userStore.user.name || '',
    bio: this.props.userStore.user.bio || '',
    usernameNotice: null,
    selectionModalConfig: null,
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

  selectFromGallery = async () => {
    // const result = await launchImageLibrary({
    //   mediaType: 'photo',
    //   selectionLimit: 1,
    // })
    // if (result?.assets && result.assets.length > 0) {
    //   this.setState({ profilePicture: result.assets[0].uri, })
    //   this.setState({ selectionModalConfig: null, })
    // }
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      width: 360,
      height: 360,
    })
    if (result.path) {
      this.setState({ profilePicture: `file:///${result.path}`, })
      this.setState({ selectionModalConfig: null, })
    }
  }

  takePhoto = async () => {
    // const result = await launchCamera({
    //   mediaType: 'photo',
    //   cameraType: 'front',
    // })
    // if (result?.assets && result.assets.length > 0) {
    //   this.setState({ profilePicture: result.assets[0].uri, })
    //   this.setState({ selectionModalConfig: null, })
    // }
    const result = await ImagePicker.openCamera({
      mediaType: 'photo',
      useFrontCamera: true,
      cropping: true,
      cropperCircleOverlay: true,
    })
    if (result.path) {
      this.setState({ profilePicture: `file:///${result.path}`, })
      this.setState({ selectionModalConfig: null, })
    }
  }

  removeProfilePicture = () => {
    this.setState({ profilePicture: null, })
    this.setSelectionModalConfig()
  }

  setSelectionModalConfig = () => {
    if (this.state.selectionModalConfig !== null) this.setState({ selectionModalConfig: null, })
    else {
      softVibrate()
      this.setState({
        selectionModalConfig: {
          title: Lit[this.props.systemStore.Locale].Title.Thumbnail,
          list: [
            { Icon: GalleryIcon, title: Lit[this.props.systemStore.Locale].Button.GalleryPhoto, onPress: this.selectFromGallery, },
            { Icon: CameraIcon, title: Lit[this.props.systemStore.Locale].Button.CapturePhoto, onPress: this.takePhoto, },
            this.props.userStore.user.profilePicture && { Icon: DeleteIcon, title: Lit[this.props.systemStore.Locale].Button.RemovePhoto, onPress: this.removeProfilePicture, noRight: true, },
          ],
        },
      })
    }
  }

  setUsername = (text: string) => {
    this.setState({ username: text.trim(),})
    if (text !== this.props.userStore.user.username && text.length > 2 && text.length <= 16) this.props.actions.signupUsernameCheck(text)
    if (validateUsername(text)) this.setState({ usernameNotice: Lit[this.props.systemStore.Locale].Copywrite.UsernameNotice, })
    else this.setState({ usernameNotice: null, })
  }

  setName = (text: string) => {
    this.setState({ name: text, })
  }

  setBio = (text: string) => {
    this.setState({ bio: text, })
  }

  updateProfile = async () => {
    if (
      this.state.username !== this.props.userStore.user.username && this.state.username
      || this.state.name !== this.props.userStore.user.name
      || this.state.bio !== this.props.userStore.user.bio
    ) {
      this.setState({ loading: true, })
      await this.props.actions.setUpdateProfile({
        username: this.props.userStore.user.username === this.state.username ? undefined : this.state.username,
        name: this.props.userStore.user.name === this.state.name ? undefined : this.state.name,
        bio: this.props.userStore.user.bio === this.state.bio ? undefined : this.state.bio,
      })
      this.setState({ loading: false, })
      this.props.toggleModal()
    } else this.props.toggleModal()
  }

  render() {
    const { systemStore, userStore, toggleModal, }: IEditUserProfileModalProps = this.props

    return (
      <ProfileBlock
        systemStore={systemStore}
        userStore={userStore}
        state={this.state}
        toggleModal={toggleModal}
        setSelectionModalConfig={this.setSelectionModalConfig}
        setUsername={this.setUsername}
        setName={this.setName}
        setBio={this.setBio}
        updateProfile={this.updateProfile}
        actions={{
          setUser: this.props.actions.setUser,
          setUpdateProfile: this.props.actions.setUpdateProfile,
        }}
      />
    )
  }
}

export default EditUserProfileModal
