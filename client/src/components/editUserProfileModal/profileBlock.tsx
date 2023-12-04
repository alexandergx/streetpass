import React, { useState, } from 'react'
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native'
import Button from '../button'
import TextInput from '../textInput'
import SelectionModal from '../selectionModal'
import Thumbnail from '../thumbnail'
import NavHeader from '../navigation/NavHeader'
import { BlurView } from '@react-native-community/blur'
import { IUserStore } from '../../state/reducers/UserReducer'
import CrossIcon from '../../assets/icons/cross.svg'
import CheckmarkCircledIcon from '../../assets/icons/checkmark-circled.svg'
import CrossCircledIcon from '../../assets/icons/cross-circled.svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { useMutation, } from '@apollo/client'
import { ReactNativeFile, } from 'apollo-upload-client'
import { MMKVLoader } from 'react-native-mmkv-storage'
import { getAccessHeaders, apiRequest, UPLOAD_PROFILE_PICTURE } from '../../api'
import { ISetUpdateProfile } from '../../state/actions/UserActions'
import { InputLimits, LocalStorage } from '../../utils/constants'
import { IEditUserProfileModalState } from '.'
import { Lit } from '../../utils/locale'

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()

interface IProfileBlockProps {
  systemStore: ISystemStore,
  userStore: IUserStore,
  state: IEditUserProfileModalState,
  toggleModal: () => void,
  setSelectionModalConfig: () => void,
  setUsername: (params: string) => void,
  setName: (params: string) => void,
  setBio: (params: string) => void,
  updateProfile: () => void,
  actions: {
    setUser: () => void,
    setUpdateProfile: (params: ISetUpdateProfile) => void,
  }
}
const ProfileBlock: React.FC<IProfileBlockProps> = ({
  systemStore, userStore, state, toggleModal, setSelectionModalConfig, setUsername, setName, setBio, updateProfile, actions,
}) => {
  const { Colors, Fonts, } = systemStore

  const [loading, setLoading] = useState<boolean>(false)
  const [updateProfilePicture] = useMutation(UPLOAD_PROFILE_PICTURE(), { context: { headers: getAccessHeaders(), }, onError: e => { console.log('[UPLOAD ERROR]', e) }, })

  const save = async () => {
    try {
      if (state.profilePicture !== userStore.user.profilePicture) {
        setLoading(true)
        const refreshed = await apiRequest(null)
        if (refreshed === true) {
          if (state.profilePicture !== null) await updateProfilePicture({ variables: { file: new ReactNativeFile({ uri: state.profilePicture, name: 'file', }), }, })
          else await actions.setUpdateProfile({ removeProfilePicture: true, })
          await actions.setUser()
        }
      }
      await updateProfile()
      setLoading(false)
    } catch(e) {
      console.log('[UPLOAD ERROR]', e)
      setLoading(false)
    }
  }

  return (
    <>
      <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%',}}>
        <NavHeader systemStore={systemStore} color={Colors.lightest} StartIcon={CrossIcon} onPress={toggleModal} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            flex: 1, display: 'flex',
            justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
          }}
        >
          <View style={{flex: 1, width: '100%',}}>
            <ScrollView style={{width: '100%', height: '100%',}} showsVerticalScrollIndicator={false}>
              <View style={{height: 16,}} />

              <View style={{width: '100%', borderRadius: 16, overflow: 'hidden',}}>
                <BlurView
                  blurType={Colors.darkestBlur as any}
                  style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.darkBackground,}}
                />

                <View style={{padding: 16,}}>
                  <View style={{flexDirection: 'row', marginBottom: 16,}}>
                    <Thumbnail
                      systemStore={systemStore}
                      onPress={setSelectionModalConfig}
                      uri={state.profilePicture} size={64}
                    />
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <View style={{flex: 2, marginRight: 8,}}>
                      <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any,}}>{Lit[systemStore.Locale].Title.Username}</Text>
                    </View>
                    <View style={{flex: 5,}}>
                      <TextInput
                        systemStore={systemStore}
                        value={state.username}
                        textColor={state.username.length > 16 ? Colors.red : undefined}
                        onChangeText={(text: string) => setUsername(text)}
                        EndIcon={
                          state.username && state.username.length > 2 && state.username.length <= 16
                            ? userStore.usernameTaken
                              ? CrossCircledIcon
                              : state.username !== userStore.user.username
                                ? CheckmarkCircledIcon
                                : undefined
                          : undefined
                        }
                        iconColor={
                          state.username && state.username.length > 2 && state.username.length <= 16
                            ? userStore.usernameTaken
                              ? Colors.red
                              : state.username !== userStore.user.username
                                ? Colors.green
                                : undefined
                          : undefined
                        }
                      />
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <View style={{flex: 2, marginRight: 8,}}>
                      <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any,}}>{Lit[systemStore.Locale].Title.Name}</Text>
                    </View>
                    <View style={{flex: 5,}}>
                      <TextInput
                        systemStore={systemStore}
                        value={state.name}
                        textColor={state.name.length > 32 ? Colors.red : undefined}
                        onChangeText={(text: string) => setName(text)}
                      />
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center',}}>
                    <View style={{flex: 2, marginRight: 8,}}>
                      <Text style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight as any,}}>{Lit[systemStore.Locale].Title.Bio}</Text>
                    </View>
                    <View style={{flex: 5,}}>
                      <TextInput
                        systemStore={systemStore}
                        value={state.bio}
                        textColor={state.bio.length > InputLimits.DescriptionMax ? Colors.red : undefined}
                        multiline={true}
                        onChangeText={(text: string) => setBio(text)}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={{height: 32,}} />
            </ScrollView>
          </View>

          <View style={{flex: 0, width: '100%', marginBottom: state.keyboard ? 8: 32,}}>
            <Button
              systemStore={systemStore}
              onPress={save}
              title={'Save'}
              loading={state.loading || loading}
              disabled={
                state.loading
                || userStore.usernameTaken
                || state.username.length < InputLimits.UsernameMin
                || state.username.length > InputLimits.UsernameMax
                || state.name.length > InputLimits.NameMax
                || state.bio.length > InputLimits.DescriptionMax
              }
            />
          </View>
        </KeyboardAvoidingView>
      </BlurView>

      {state.selectionModalConfig &&
        <SelectionModal systemStore={systemStore} config={state.selectionModalConfig} toggleModal={setSelectionModalConfig} />
      }
    </>
  )
}

export default ProfileBlock
