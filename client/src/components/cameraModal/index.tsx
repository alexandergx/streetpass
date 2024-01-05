import React, {useState, useRef, useEffect, useMemo, } from 'react'
import { MMKVLoader, useMMKVStorage, } from 'react-native-mmkv-storage'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { TapGestureHandler, PanGestureHandler, PinchGestureHandler, PinchGestureHandlerGestureEvent, State, PinchGestureHandlerStateChangeEvent, } from 'react-native-gesture-handler'
import CreateMediaModalButton from './Button'
import CreateMediaModalSwitch from './Switch'
import CreateMediaModalGrid from './Grid'
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video'
import { BlurView } from '@react-native-community/blur'
import { Camera, useCameraDevices, } from 'react-native-vision-camera'
import CrossIcon from '../../assets/icons/cross.svg'
import FlashIcon from '../../assets/icons/flash.svg'
import NoFlashIcon from '../../assets/icons/flash-off.svg'
import GearIcon from '../../assets/icons/gear.svg'
import RotateLeftIcon from '../../assets/icons/rotate-left.svg'
import RotateRightIcon from '../../assets/icons/rotate-right.svg'
import LeftIcon from '../../assets/icons/chevron-left.svg'
import RightIcon from '../../assets/icons/chevron-right.svg'
import GalleryIcon from '../../assets/icons/gallery.svg'
import AudioIcon from '../../assets/icons/audio-solid.svg'
import CameraIcon from '../../assets/icons/camera.svg'
import HDRIcon from '../../assets/icons/hdr.svg'
import GyroIcon from '../../assets/icons/gyro.svg'
import MicOffIcon from '../../assets/icons/mic-off.svg'
import GridIcon from '../../assets/icons/grid.svg'
import TimerIcon from '../../assets/icons/timer.svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { CameraStore, Errors, InputLimits, LocalStorage, } from '../../utils/constants'
import CameraButton from './CameraButton'
import { requestCamera, requestMicrophone, requestPhotoLibrary, hardVibrate, } from '../../utils/services'
import { Lit, } from '../../utils/locale'
import { CameraRoll, } from '@react-native-camera-roll/camera-roll'

const MMKV = new MMKVLoader().withInstanceID(LocalStorage.CameraStore).initialize()

interface ICameraModalProps {
  systemStore: ISystemStore,
  toggleModal: () => void,
  onCapture: (params: { image: string | null, video: string | null, }) => void,
}
const CameraModal: React.FC<ICameraModalProps> = ({ systemStore, toggleModal, onCapture, }) => {
  const { Colors, Fonts, } = systemStore

  const [mounted, setMounted] = useState<boolean>(false)

  const cameraRef = useRef<any>(null)
  // const videoPlayerRef = useRef<any>(null)
  const doubleTapRef = useRef<any>(null)

  // camera settings
  const [defaultFrontCamera, setDefaultFrontCamera] = useMMKVStorage<boolean>(CameraStore.DefaultFrontCamera, MMKV, false)
  const [saveMedia, setSaveMedia] = useMMKVStorage<boolean>(CameraStore.SaveMedia, MMKV, true)
  const [HDR, setHDR] = useMMKVStorage<boolean>(CameraStore.HDR, MMKV, false)
  const [stabilization, setStabilization] = useMMKVStorage<boolean>(CameraStore.Stabilization, MMKV, true)
  const [audio, setAudio] = useMMKVStorage<boolean>(CameraStore.Audio, MMKV, true)
  const [grid, setGrid] = useMMKVStorage<boolean>(CameraStore.Grid, MMKV, false)
  const [timer, setTimer] = useMMKVStorage<boolean>(CameraStore.Timer, MMKV, false)
  const [timerValue, setTimerValue] = useMMKVStorage<number>(CameraStore.TimerValue, MMKV, 3)
  const [mute, setMute] = useState<boolean>(!audio)

  useEffect(() => {
    const mount = async () => {
      if (!mounted) {
        // await requestCamera(systemStore.Locale).then(result => { if (!result) toggleCreateMediaModal() })
        // await requestMicrophone(systemStore.Locale).then(result => { if (!result) setAudio(result) })
        // await requestPhotoLibrary(systemStore.Locale).then(result => { if (!result) setSaveMedia(result) })
        setMounted(true)
      }
    }
    mount()
  }, [mounted])

  // camera controls
  const [cameraFace, setCameraFace] = useState<boolean>(defaultFrontCamera ? true : false)
  const devices = useCameraDevices()
  const device = cameraFace ? devices.find(device => device.position === 'front') : devices.find(device => device.position === 'back')
  
  let photoHDR = false
  let videoHDR = false
  const format = useMemo(() => {
    if (HDR) {
      let pFormat: any = undefined
      device?.formats.forEach(format => {
        if (!pFormat && (format.supportsPhotoHdr || format.supportsVideoHdr)) {
          photoHDR = format.supportsPhotoHdr
          videoHDR = format.supportsVideoHdr
          pFormat = format
        }
        if ((!photoHDR || !videoHDR) && format.supportsPhotoHdr && format.supportsVideoHdr) {
          pFormat = format
        }
        if ((photoHDR && videoHDR && format.supportsPhotoHdr && format.supportsVideoHdr)
        || (photoHDR && !videoHDR && format.supportsPhotoHdr && !format.supportsVideoHdr)
        || (!photoHDR && videoHDR && !format.supportsPhotoHdr && format.supportsVideoHdr)) {
          if (format.maxFps > pFormat.maxFps) {
            pFormat = format
          }
        }
      })
      return pFormat
    } else {
      photoHDR = false
      videoHDR = false
      return device?.formats?.find(format => {
        return (format.maxFps === 30 && format.videoHeight === 1080 && !format.supportsPhotoHdr && !format.supportsVideoHdr)
      })
    }
  }, [device?.formats, HDR])

  const intervalRef = useRef<any>(null)
  const videoRecordingTimeoutRef = React.useRef<any>(null)
  const [videoRecording, setVideoRecording] = useState<boolean>(false)
  const [flash, setFlash] = useState<boolean>(false)
  const [settings, setSettings] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(0)

  // media
  const [capturedPhoto, setCapturedPhoto] = useState<any>(null)
  const [capturedVideo, setCapturedVideo] = useState<any>(null)

  const countdown = async () => {
    setCounter(timerValue)
    await new Promise<void>(resolve => {
      intervalRef.current = setInterval(() => {
        setCounter(prevCounter => {
          const newCounter = Math.max(prevCounter - 1, 0)
          if (newCounter === 0) {
            if (intervalRef.current !== null) {
              clearInterval(intervalRef.current)
            }
            resolve()
          }
          return newCounter
        })
      }, 1000)
    })
    return
  }

  const capturePhoto = async () => {
    try { await cameraRef.current.stopRecording() } catch (e) {() => {}}
    setCapturedVideo(null)
    if (timer) await countdown()
    const photo = await cameraRef.current.takePhoto({
      flash: flash ? 'on' : 'off',
    })
    setCapturedPhoto(photo)
    if (saveMedia) CameraRoll.save(photo.path, { type: 'photo', })
  }

  const recordVideoStart = async () => {
    setCapturedPhoto(null)
    await cameraRef.current.startRecording({
      flash: flash ? 'on' : 'off', durationLimit: InputLimits.VideoLengthMax - 1,
      onRecordingFinished: (video: any) => {
        if (capturedPhoto) return
        clearTimeout(videoRecordingTimeoutRef.current)
        setCapturedVideo(video)
        setVideoRecording(false)
        if (saveMedia) CameraRoll.save(video.path, { type: 'video', })
      },
      onRecordingError: (error: any) => {
        clearTimeout(videoRecordingTimeoutRef.current)
        setCapturedVideo(null)
        setVideoRecording(false)
        console.error('[VIDEO ERROR]', error)
      },
    })
  }

  let startTimestamp = Date.now()
  const recordVideoStarted = async () => {
    startTimestamp = Date.now()
    setVideoRecording(true)
    videoRecordingTimeoutRef.current = setTimeout(async () => {
        try { await cameraRef.current.stopRecording() } catch(e) {() => {}}
    }, (InputLimits.VideoLengthMax - 1) * 1000)
  }

  const recordVideoEnd = async () => {
    if (videoRecording) {
      try { await cameraRef.current.stopRecording() } catch(e) {() => {}}
    } else {
      const photo = await cameraRef.current.takePhoto({ flash: flash ? 'on' : 'off', })
      setCapturedPhoto(photo)
    }
  }

  const discardMedia = () => {
    Alert.alert(
      Lit[systemStore.Locale].Copywrite.DiscardMedia[0], Lit[systemStore.Locale].Copywrite.DiscardMedia[1],
      [
        { text: Lit[systemStore.Locale].Button.Discard, onPress: async () => {
            try { await cameraRef.current.stopRecording() } catch (e) {() => {}}
            setCapturedPhoto(null)
            setCapturedVideo(null)
            setZoom(device?.neutralZoom || 1)
        }},
        { text: Lit[systemStore.Locale].Button.Cancel, onPress: () => null, style: 'cancel', },
      ]
    )
  }

  // gesture controls
  const [mediaFocused, setMediaFocused] = useState<boolean>(false)
  const [longPress, setLongPress] = useState<boolean>(false)
  const [longPressActive, setLongPressActive] = React.useState<boolean>(false)
  const [initialAbsoluteY, setInitialAbsoluteY] = useState<number | null>(null)
  const [panZoom, setPanZoom] = useState<number>(device?.neutralZoom || 1)
  const [zoom, setZoom] = useState<number>(device?.neutralZoom || 1)
  const longPressTimeoutRef = React.useRef<any>(null)

  const onTapHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      capturePhoto()
    }
  }

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.BEGAN) {
      hardVibrate()
      longPressTimeoutRef.current = setTimeout(() => {
        setLongPressActive(true)
        recordVideoStarted()
        recordVideoStart()
        setInitialAbsoluteY(nativeEvent.absoluteY)
      }, 500)
    } else if (nativeEvent.state === State.END || nativeEvent.state === State.CANCELLED || nativeEvent.state === State.FAILED) {
      clearTimeout(longPressTimeoutRef.current)
      if (longPressActive) {
        recordVideoEnd()
        setLongPressActive(false)
        setInitialAbsoluteY(null)
      }
    }
  }

  const onPanGestureEvent = ({ nativeEvent }: any) => {
    if (longPressActive) {
      if (initialAbsoluteY !== null) {
        const zoomChange = (initialAbsoluteY - nativeEvent.absoluteY) / 100
        const newZoom = Math.max(1, (device?.neutralZoom || 1) + zoomChange)
        setPanZoom(newZoom)
      }
    }
  }

  const usePinchToZoom = (device: any): [number, (event: PinchGestureHandlerGestureEvent) => void, (event: PinchGestureHandlerStateChangeEvent) => void] => {
    const [pinchZoom, setPinchZoom] = useState(device?.neutralZoom || 1)
    const initialScale = useRef(1)
    const onPinchStart = () => initialScale.current = 1
    const onPinchEnd = () => initialScale.current = 1
    const onPinchProgress = (scale: number) => {
      let scaleChange = scale - initialScale.current
      let newZoom = pinchZoom
      if (scaleChange > 0) newZoom = Math.min(pinchZoom + scaleChange, 16)
      else if (scaleChange < 0) newZoom = Math.max(pinchZoom + scaleChange * 5, 1)
      initialScale.current = scale
      setPinchZoom(newZoom)
    }
    const onPinchGestureEvent = (event: PinchGestureHandlerGestureEvent) => {
      const { nativeEvent, } = event
      const { scale, state, } = nativeEvent
      if (state === State.ACTIVE) onPinchProgress(scale)
    }
    const onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.oldState === State.BEGAN && event.nativeEvent.state === State.ACTIVE) onPinchStart()
      else if (event.nativeEvent.state === State.END) onPinchEnd()
    }
    return [pinchZoom, onPinchGestureEvent, onPinchHandlerStateChange]
  }
  const [pinchZoom, onPinchGestureEvent, onPinchHandlerStateChange] = usePinchToZoom(device)

  useEffect(() => {
    setZoom(panZoom * pinchZoom)
  }, [panZoom, pinchZoom])

  return (
    <View
      style={{
        position: 'absolute', zIndex: 3, flex: 1, width: '100%', height: '100%',
        justifyContent: 'center', alignItems: 'center',
      }}
    >
      {/* MEDIA CONTROLS LAYER */}
      {(capturedPhoto || capturedVideo) && !mediaFocused &&
        <>
          <View
            style={{
              position: 'absolute', zIndex: 5, top: 80, alignItems: 'center', justifyContent: 'space-between', width: '100%',
              flexDirection: 'row', paddingHorizontal: 16,
            }}
          >
            <CreateMediaModalButton
              systemStore={systemStore}
              Icon={LeftIcon}
              onPress={discardMedia}
            />

            {(capturedVideo) &&
              <CreateMediaModalButton
                systemStore={systemStore}
                Icon={AudioIcon}
                color={!mute ? undefined : Colors.safeLight}
                onPress={() => setMute(!mute)}
              />
            }
          </View>

          <View
            style={{
              position: 'absolute', zIndex: 4, bottom: 96, justifyContent: 'flex-end',
              width: '100%', flexDirection: 'row',
            }}
          >
            <CreateMediaModalButton
              systemStore={systemStore}
              Icon={RightIcon}
              text={Lit[systemStore.Locale].Button.Done}
              onPress={() => onCapture({ image: capturedPhoto ? `file://${capturedPhoto?.path}` : null, video: capturedVideo ? capturedVideo.path : null, })}
            />
          </View>
        </>
      }

      {/* CAMERA SETTINGS LAYER */}
      {settings && !capturedPhoto && !capturedVideo &&
        <BlurView blurType={Colors.safeDarkBlur } style={{position: 'absolute', zIndex: 4, width: '100%', height: '100%',}}>
          <ScrollView>
            <View
              style={{
                position: 'absolute', top: 144, alignItems: 'flex-end', width: '100%',
                paddingHorizontal: 32,
              }}
            >
              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={CameraIcon}
                title={Lit[systemStore.Locale].Title.DefaultCamera}
                subtitle={Lit[systemStore.Locale].Title.DefaultCameraDescription}
                active={defaultFrontCamera}
                onPress={() => setDefaultFrontCamera(!defaultFrontCamera)}
              />

              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={GalleryIcon}
                title={Lit[systemStore.Locale].Title.SaveCapturedMedia}
                subtitle={Lit[systemStore.Locale].Title.SaveCapturedMediaDescription}
                active={saveMedia}
                onPress={() => {
                  requestPhotoLibrary(systemStore.Locale, true).then(result => {
                    if (result) setSaveMedia(!saveMedia)
                  })
                }}
              />

              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={HDRIcon}
                title={Lit[systemStore.Locale].Title.Hdr}
                subtitle={Lit[systemStore.Locale].Title.HdrDescription}
                active={HDR}
                onPress={() => setHDR(!HDR)}
              />

              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={GyroIcon}
                title={Lit[systemStore.Locale].Title.Stabilization}
                subtitle={Lit[systemStore.Locale].Title.StabilizationDescription}
                active={stabilization}
                onPress={() => setStabilization(!stabilization)}
              />

              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={MicOffIcon}
                title={Lit[systemStore.Locale].Title.SoundOff}
                subtitle={Lit[systemStore.Locale].Title.SoundOffDescription}
                active={!audio}
                onPress={() => {
                  requestMicrophone(systemStore.Locale, true).then(result => {
                    if (result) setAudio(!audio)
                  })
                }}
              />

              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={GridIcon}
                title={Lit[systemStore.Locale].Title.GridLines}
                subtitle={Lit[systemStore.Locale].Title.GridLinesDescription}
                active={grid}
                onPress={() => setGrid(!grid)}
              />

              <CreateMediaModalSwitch
                systemStore={systemStore}
                Icon={TimerIcon}
                title={Lit[systemStore.Locale].Title.Timer}
                subtitle={`${timerValue} ${Lit[systemStore.Locale].Title.TimerDescription}`}
                active={timer}
                onPress={() => {
                  switch(true) {
                    case !timer:
                      setTimer(!timer); break
                    case timer && timerValue == 3:
                      setTimerValue(5); break
                    case timer && timerValue == 5:
                      setTimerValue(10); break
                    default:
                      setTimer(!timer)
                      setTimerValue(3)
                  }
                }}
              />
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute', top: 80, alignItems: 'flex-end', width: '100%',
              paddingHorizontal: 16, paddingBottom: 8,
            }}
          >
            <CreateMediaModalButton
              systemStore={systemStore}
              Icon={CrossIcon}
              onPress={() => setSettings(false)}
            />
          </View>
        </BlurView>
      }

      {/* CAMERA CONTROLS LAYER */}
      {!capturedPhoto && !capturedVideo &&
        <>
          {!videoRecording &&
            <View
              style={{
                position: 'absolute', zIndex: 3, top: 80, alignItems: 'center', justifyContent: 'space-between', width: '100%',
                flexDirection: 'row', paddingHorizontal: 16,
              }}
            >
              <CreateMediaModalButton
                systemStore={systemStore}
                Icon={CrossIcon}
                onPress={toggleModal}
              />

              <CreateMediaModalButton
                systemStore={systemStore}
                Icon={flash ? FlashIcon : NoFlashIcon}
                onPress={() => setFlash(!flash)}
              />

              <CreateMediaModalButton
                systemStore={systemStore}
                Icon={GearIcon}
                onPress={() => setSettings(true)}
              />
            </View>
          }

          <View
            style={{
              position: 'absolute', zIndex: 2, bottom: 80,
              justifyContent: 'center', alignItems: 'center', width: '100%',
            }}
          >
            <PanGestureHandler
              onGestureEvent={onPanGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
              minDist={1.5}
            >
              <TapGestureHandler onHandlerStateChange={onTapHandlerStateChange}>
                <View
                  style={{
                    width: 72, height: 72, borderRadius: 64, borderWidth: videoRecording ? 0 : 2, borderColor: Colors.safeLightest,
                    justifyContent: 'center', alignItems: 'center', marginHorizontal: 16,
                    opacity: videoRecording ? Colors.activeOpacity : 1,
                  }}
                >
                  {videoRecording && <CameraButton systemStore={systemStore} />}
                  <View
                    style={{
                      width: '80%', height: '80%', borderRadius: 64, backgroundColor: Colors.safeLightest,
                      justifyContent: 'center', alignItems: 'center',
                    }}
                  >
                    {timer && counter > 0 &&
                      <Text style={{fontSize: Fonts.xxl, fontWeight: Fonts.heavyWeight,}}>{counter}</Text>
                    }
                  </View>
                </View>
              </TapGestureHandler>
            </PanGestureHandler>

            {!videoRecording &&
              <View style={{position: 'absolute', right: 32,}}>
                <CreateMediaModalButton
                  systemStore={systemStore}
                  Icon={cameraFace ? RotateLeftIcon : RotateRightIcon}
                  onPress={() => setCameraFace(!cameraFace)}
                />
              </View>
            }
          </View>
        </>
      }

      {grid && !capturedPhoto && !capturedVideo &&
        <View pointerEvents={'none'} style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%',}}>
          <CreateMediaModalGrid systemStore={systemStore} />
        </View>
      }

      {/* CAMERA LAYER */}
      {device &&
        <TapGestureHandler
          onHandlerStateChange={(e: any) => {
            device.supportsFocus && cameraRef.current?.focus({x: e.nativeEvent.x, y: e.nativeEvent.y})
          }}
          waitFor={doubleTapRef}
        >
          <TapGestureHandler
            ref={doubleTapRef}
            onHandlerStateChange={(e: any) => {
              if (e.nativeEvent.state === 5) setCameraFace(!cameraFace)
            }}
            numberOfTaps={2}
          >
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onHandlerStateChange={onPinchHandlerStateChange}
            >
              <View style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}>
                <Camera
                  ref={cameraRef}
                  device={device}
                  zoom={zoom}
                  photoHdr={HDR && format && photoHDR ? true : false}
                  videoHdr={HDR && format && videoHDR ? true : false}
                  audio={audio}
                  isActive={true}
                  focusable={true}
                  videoStabilizationMode={stabilization ? 'standard' : 'off'}
                  format={HDR ? format : undefined}
                  photo={true}
                  video={true}
                  style={{
                    width: '100%', height: '100%',
                    backgroundColor: Colors.black,
                  }}
                >
                    {(capturedPhoto?.path) &&
                      <TouchableOpacity
                        onLongPress={() => setLongPress(true)}
                        onPressIn={() => setMediaFocused(true)}
                        onPressOut={() => {
                          setLongPress(false)
                          setMediaFocused(false)}
                        }
                        activeOpacity={1}
                        style={{width: '100%', height: '100%', position: 'absolute', zIndex: 1,}}
                      >
                        <FastImage
                          source={{uri: `file://${capturedPhoto?.path}`}}
                          style={{width: '100%', height: '100%',}}
                        />
                        <View style={{width: '100%', height: '100%', position: 'absolute', zIndex: -1, backgroundColor: Colors.black,}} />
                      </TouchableOpacity>
                    }

                    {(capturedVideo?.path) &&
                      <TouchableOpacity
                        onLongPress={() => setLongPress(true)}
                        onPressIn={() => setMediaFocused(true)}
                        onPressOut={() => {
                          setLongPress(false)
                          setMediaFocused(false)}
                        }
                        activeOpacity={1}
                        style={{
                          width: '100%', height: '100%', position: 'absolute', zIndex: 1,
                          justifyContent: 'center', alignItems: 'center',
                        }}
                      >
                        <Video
                          source={{
                            uri: capturedVideo?.path,
                            // headers: {
                            //   Authorization: 'bearer some-token-value',
                            //   'X-Custom-Header': 'some value'
                            // }
                          }}
                          // ref={videoPlayerRef}
                          // onLoad={() => {
                          //   videoPlayerRef.current
                          // }}
                          paused={mediaFocused ? true : false}
                          repeat={true}
                          playInBackground={false}
                          playWhenInactive={false}
                          ignoreSilentSwitch={'ignore'}
                          muted={mute}
                          style={{width: '130%', height: '130%',}}
                        />
                        <View style={{width: '100%', height: '100%', position: 'absolute', zIndex: -1, backgroundColor: Colors.black,}} />
                      </TouchableOpacity>
                    }
                </Camera>
              </View>
            </PinchGestureHandler>
          </TapGestureHandler>
        </TapGestureHandler>
      }

      <BlurView
        blurType={Colors.safeDarkBlur }
        style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%',}}
      />
    </View>
  )
}

export default CameraModal
