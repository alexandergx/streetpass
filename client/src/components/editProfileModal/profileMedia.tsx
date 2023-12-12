import React, { useState, useImperativeHandle, forwardRef, } from 'react'
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { useMutation, } from '@apollo/client'
import { ReactNativeFile, } from 'apollo-upload-client'
import { MMKVLoader } from 'react-native-mmkv-storage'
import CrossCircledIcon from '../../assets/icons/cross-circled.svg'
import PlusIcon from '../../assets/icons/plus.svg'
import ProfileIcon from '../../assets/icons/profile.svg'
import PhotoIcon from '../../assets/icons/photo.svg'
import GalleryIcon from '../../assets/icons/gallery.svg'
import CameraIcon from '../../assets/icons/camera.svg'
import DraggableGrid from 'react-native-draggable-grid'
import FastImage from 'react-native-fast-image'
import { LocalStorage } from '../../utils/constants'
import { IEditProfileModalState, IUploadMedia } from '.'
import ImagePicker from 'react-native-image-crop-picker'
import { UPLOAD_IMAGE, UPLOAD_VIDEO, apiRequest, getAccessHeaders } from '../../api'
import Video from 'react-native-video'
import convertToProxyURL from 'react-native-video-cache'
import { ISetSortMedia } from '../../state/actions/UserActions'

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()

export interface ProfileMediaMethods {
  save: () => Promise<boolean>
}

interface IProfileBlockProps {
  systemStore: ISystemStore,
  state: IEditProfileModalState,
  setState: (params: any) => void,
  actions: {
    setSortMedia: (params: ISetSortMedia) => void,
  }
}
const ProfileMedia = forwardRef<ProfileMediaMethods, IProfileBlockProps>(({ systemStore, state, setState, actions, }, ref) => {
  const { Colors, } = systemStore

  const [loading, setLoading] = useState<number | null>(null)
  const [uploadImage] = useMutation(UPLOAD_IMAGE(), { context: { headers: getAccessHeaders(), }, onError: e => { console.log('[UPLOAD ERROR]', e) }, })
  const [updateVideo] = useMutation(UPLOAD_VIDEO(), { context: { headers: getAccessHeaders(), }, onError: e => { console.log('[UPLOAD ERROR]', e) }, })

  const save = async () => {
    try {
      setState({ loading: true, })
      const sortOrderMedia: Array<IUploadMedia> = []
      for (const media of state.media.filter((i: IUploadMedia) => i.key !== null)) {
        setLoading(media.key)
        if (media.image && media.new) {
          const refreshed = await apiRequest(null)
          const { data, } = await uploadImage({ variables: { file: new ReactNativeFile({ uri: media.image, name: 'file', }), }, })
          sortOrderMedia.push({ ...media, mediaId: data.uploadMedia, })
        } else if (media.video) {
          const refreshed = await apiRequest(null)
          const { data, } = await updateVideo({ variables: { file: new ReactNativeFile({ uri: media.video, name: 'file', }), }, })
          sortOrderMedia.push({ ...media, mediaId: data.uploadMedia, })
        } else sortOrderMedia.push(media)
      }
      await actions.setSortMedia(sortOrderMedia)
      setLoading(null)
      setState({ loading: false, })
      return true
    } catch(e) {
      console.log('[UPLOAD ERROR]', e)
      setState({ loading: false, })
    }
    return false
  }

  useImperativeHandle(ref, () => ({ save, }))

  const selectFromGallery = async () => {
    setState({ selectionModalConfig: null, })
    const result = await ImagePicker.openPicker({
      mediaType: 'any',
      cropping: true,
      // multiple: true,
    })
    setState({ media: [...state.media.filter((i: IUploadMedia) => i.key !== null), { image: `file:///${result.path}`, key: state.media.length, new: true, }, { key: null, }].slice(0, 9), })
  }

  return (
    <>
      <DraggableGrid
        numColumns={3}
        itemHeight={Dimensions.get('window').width * 0.36}
        renderItem={(item: any, index) => {
          return (item.key !== null ?
            <View
              key={item.key}
              style={{width: Dimensions.get('window').width * 0.30, aspectRatio: 1/1.2, justifyContent: 'center', alignItems: 'center', padding: 4,}}
            >
              {item.image &&
                <FastImage
                  key={item.key}
                  source={{ uri: item.image, }}
                  style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden',}}
                />
              }

              {/* {item.video &&
                <Video
                  source={{ uri: convertToProxyURL(item.video), }}
                  paused={false}
                  repeat={true}
                  playInBackground={false}
                  playWhenInactive={false}
                  mixWithOthers={'mix'}
                  ignoreSilentSwitch={'ignore'}
                  muted={true}
                  bufferConfig={{
                    minBufferMs: 500,
                    maxBufferMs: 30000,
                    bufferForPlaybackMs: 500,
                    bufferForPlaybackAfterRebufferMs: 1000,
                  }}
                  resizeMode={'cover'}
                  style={{width: '100%', height: '100%',}}
                />
              } */}

              <TouchableOpacity
                activeOpacity={Colors.activeOpacity}
                onPress={() => setState({ media: state.media.filter((i: IUploadMedia) => i.key !== item.key), deletedMedia: [...state.deletedMedia, item] })}
                style={{position: 'absolute', bottom: -2, right: -4,}}
              >
                <CrossCircledIcon fill={Colors.safeLightest} width={32} height={32} />
              </TouchableOpacity>

              {loading === item.key &&
                <ActivityIndicator color={Colors.safeLightest} style={{position: 'absolute', alignSelf: 'center',}} />
              }

              {index === 0 &&
                <View style={{position: 'absolute', top: 8, right: 8,}}>
                  <ProfileIcon fill={Colors.safeLightest} width={16} height={16} />
                </View>
              }
            </View>
            : <TouchableOpacity
              key={item.key}
              activeOpacity={Colors.activeOpacity}
              onPress={() => setState({
                selectionModalConfig: {
                  title: 'Upload media',
                  list: [
                    { Icon: GalleryIcon, title: 'Select from gallery', onPress: selectFromGallery, },
                    { Icon: CameraIcon, title: 'Use camera', onPress: () => null, },
                  ],
                },
              })}
              style={{width: Dimensions.get('window').width * 0.30, aspectRatio: 1/1.2, justifyContent: 'center', alignItems: 'center', padding: 4,}}
            >
              <BlurView
                blurType={Colors.darkestBlur}
                style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.darkBackground, borderRadius: 16, overflow: 'hidden',}}
              />

              <PhotoIcon style={{position: 'absolute', zIndex: -1,}} fill={Colors.dark} width={64} height={64} />
              <PlusIcon fill={Colors.lightBlue} width={16} height={16} />
            </TouchableOpacity>
          )
        }}
        data={state.media as any}
        onDragStart={() => setState({ scroll: false, })}
        onDragRelease={(data) => setState({ media: [...data.filter(i => i.key !== null), { key: null, }].slice(0, 9), scroll: true, })}
        style={{marginVertical: 16,}}
      />
    </>
  )
})

export default ProfileMedia
