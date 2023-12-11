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
import { ISetUpdateUser } from '../../state/actions/UserActions'

interface IEditProfileModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  onPress?: () => void,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => void,
  }
}
export interface IEditProfileModalState {
  media: Array<IMedia> | any,
  scroll: boolean,
  keyboard: boolean,
  loading: boolean,
  bio: string,
  work: string,
  school: string,
}
class EditProfileModal extends React.Component<IEditProfileModalProps> {
  constructor(props: IEditProfileModalProps) {
    super(props)
    this.scrollRef = React.createRef()
  }
  scrollRef: RefObject<ScrollView>

  state: IEditProfileModalState = {
    media: [...(this.props.userStore.user.media || []).map((item, index) => { return { ...item, key: index, } }), { key: null, }].slice(0, 9),
    scroll: true,
    keyboard: false,
    loading: false,
    bio: '',
    work: '',
    school: '',
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

  handleUpdateProfile = async () => {

  }

  render() {
    const { systemStore, userStore, toggleModal, onPress, }: IEditProfileModalProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%',}}>
          <NavHeader
            systemStore={systemStore}
            title={`${this.props.userStore.user.name}`}
            color={Colors.lightest}
            StartIcon={onPress ? undefined : CrossIcon}
            onPress={toggleModal}
          />

          <KeyboardAvoidingView
            behavior={'padding'}
            style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,}}
          >
            <View style={{flex: 1, width: '100%',}}>
              <ScrollView ref={this.scrollRef} scrollEnabled={this.state.scroll} showsVerticalScrollIndicator={false} style={{width: '100%', height: 500,}}>
                <DraggableGrid
                  numColumns={3}
                  itemHeight={Dimensions.get('window').width * 0.36}
                  renderItem={(item: any, index) => {
                    return (item.key !== null ?
                      <View
                        key={item.key}
                        style={{width: Dimensions.get('window').width * 0.32, aspectRatio: 1/1.2, justifyContent: 'center', alignItems: 'center', padding: 4,}}
                      >
                        <FastImage
                          key={item.key}
                          source={{ uri: item.image, }}
                          style={{width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden',}}
                        />

                        <TouchableOpacity activeOpacity={Colors.activeOpacity} style={{position: 'absolute', bottom: -2, right: -4,}}>
                          <CrossCircledIcon fill={Colors.safeLightest} width={32} height={32} />
                        </TouchableOpacity>

                        {index === 0 &&
                          <View style={{position: 'absolute', top: 8, right: 8,}}>
                            <ProfileIcon fill={Colors.safeLightest} width={16} height={16} />
                          </View>
                        }
                      </View>
                      : <TouchableOpacity
                        key={item.key}
                        activeOpacity={Colors.activeOpacity}
                        style={{width: Dimensions.get('window').width * 0.32, aspectRatio: 1/1.2, justifyContent: 'center', alignItems: 'center', padding: 4,}}
                      >
                        <BlurView
                          blurType={Colors.darkestBlur as any}
                          style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.darkBackground, borderRadius: 8, overflow: 'hidden',}}
                        />

                        <PhotoIcon style={{position: 'absolute', zIndex: -1,}} fill={Colors.dark} width={64} height={64} />
                        <PlusIcon fill={Colors.lightBlue} width={16} height={16} />
                      </TouchableOpacity>
                    )
                  }}
                  data={this.state.media}
                  onDragStart={() => this.setState({ scroll: false, })}
                  onDragRelease={(data) => this.setState({ media: [...data.filter(i => i.key !== null), { key: null, }].slice(0, 9), scroll: true, })}
                  style={{marginVertical: 16,}}
                />

                <View style={{width: '100%', borderRadius: 16, overflow: 'hidden',}}>
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
                onPress={() => onPress ? onPress() : toggleModal()}
                title={Lit[systemStore.Locale].Button.Save}
                disabled={false}
                loading={this.state.loading}
              />
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </>
    )
  }
}

export default EditProfileModal
