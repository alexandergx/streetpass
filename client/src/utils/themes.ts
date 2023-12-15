// import light from '../assets/mapStyles/light.json'
// import dark from '../assets/mapStyles/dark.json'
// import fairy from '../assets/mapStyles/fairy.json'
// import glitterbomb from '../assets/mapStyles/glitterbomb.json'
// import popsicle from '../assets/mapStyles/popsicle.json'
// import laguna from '../assets/mapStyles/laguna.json'
// import rally from '../assets/mapStyles/rally.json'
// import carbon from '../assets/mapStyles/carbon.json'
// import submarine from '../assets/mapStyles/submarine.json'
// import latte from '../assets/mapStyles/latte.json'

export enum ThemeTypes {
  Light = 'light',
  Dark = 'dark',
}

const darkSpectrums = {
  themeType: ThemeTypes.Dark,
  light: 'rgba(255,255,255,0.5)', lighter: 'rgba(255,255,255,0.85)', lightest: 'rgba(255,255,255,1)',
  dark: 'rgba(0,0,0,0.3)', darker: 'rgba(0,0,0,0.5)', darkest: 'rgba(0,0,0,0.8)',
  lightBlur: 'light', lighterBlur: 'xlight', lightestBlur: 'chromeMaterialLight',
  darkBlur: 'ultraThinMaterialDark', darkerBlur: 'chromeMaterialDark', darkestBlur: 'materialDark',
  lightBackground: 'rgba(255,255,255,0.2)', lighterBackground: 'rgba(255,255,255,0.5)', lightestBackground: 'rgba(255,255,255,0.8)',
  darkBackground: 'rgba(0,0,0,0.1)', darkerBackground: 'rgba(0,0,0,0.3)', darkestBackground: 'rgba(0,0,0,0.7)',
}

const lightSpectrums = {
  themeType: ThemeTypes.Light,
  light: 'rgba(0,0,0,0.3)', lighter: 'rgba(0,0,0,0.5)', lightest: 'rgba(0,0,0,1)',
  dark: 'rgba(255,255,255,0.85)', darker: 'rgba(255,255,255,0.6)', darkest: 'rgba(255,255,255,0.1)',
  lightBlur: 'ultraThinMaterialDark', lighterBlur: 'chromeMaterialDark', lightestBlur: 'thinMaterialDark',
  darkBlur: 'thinMaterialLight', darkerBlur: 'ultraThinMaterialLight', darkestBlur: 'light',
  lightBackground: 'rgba(0,0,0,0.4)', lighterBackground: 'rgba(0,0,0,0.6)', lightestBackground: 'rgba(0,0,0,0.8)',
  darkBackground: 'rgba(255,255,255,0.4)', darkerBackground: 'rgba(255,255,255,0.6)', darkestBackground: 'rgba(255,255,255,0.8)',
}

const Light = {
  // mapStyle: light,
  animation: require('../assets/animations/test.json'),
  ...lightSpectrums,
  gradient: ['rgba(185,185,185,0.5)', 'rgba(235,235,235,0.5)', 'rgba(185,185,185,0.1)'],
}

const Dark = {
  // mapStyle: dark,
  animation: require('../assets/animations/test.json'),
  ...darkSpectrums,
  gradient: ['rgba(25,25,25,1)', 'rgba(15,15,15,1)', 'rgba(25,25,25,1)',],
}

const Fairy = {
  // mapStyle: fairy,
  animation: require('../assets/animations/test.json'),
  ...lightSpectrums,
  gradient: ['rgba(238,174,202,1)', 'rgba(148,187,233,1)',],
}

const Glitterbomb = {
  // mapStyle: glitterbomb,
  animation: require('../assets/animations/test.json'),
  ...darkSpectrums,
  gradient: ['rgba(63,94,251,1)', 'rgba(252,70,107,1)',],
}

const Popsicle = {
  // mapStyle: popsicle,
  animation: require('../assets/animations/test.json'),
  ...darkSpectrums,
  gradient: ['rgba(131,58,180,1)', 'rgba(253,29,29,1)', 'rgba(252,176,69,1)',],
}

const Laguna = {
  // mapStyle: laguna,
  animation: require('../assets/animations/test.json'),
  ...lightSpectrums,
  gradient: ['rgba(52, 220, 255, 1)', 'rgba(255, 169, 155, 1)', 'rgba(255,255,255,1)'],
}

const Rally = {
  // mapStyle: rally,
  animation: require('../assets/animations/test.json'),
  ...darkSpectrums,
  gradient: ['rgba(44, 62, 80, 1)', 'rgba(129, 135, 139, 1)', 'rgba(149, 155, 159, 1)', 'rgba(44, 62, 80, 1)'],
}

const Submarine = {
  // mapStyle: submarine,
  animation: require('../assets/animations/test.json'),
  ...lightSpectrums,
  gradient: ['rgba(47, 128, 237, 1)', 'rgba(86, 204, 242, 1)'],
}

const Latte = {
  // mapStyle: latte,
  animation: require('../assets/animations/test.json'),
  ...lightSpectrums,
  gradient: ['rgba(226, 209, 195, 1)', 'rgba(253, 252, 251, 1)'],
}

const Carbon = {
  // mapStyle: carbon,
  animation: require('../assets/animations/test.json'),
  ...darkSpectrums,
  gradient: ['rgb(35, 37, 38)', 'rgb(65, 67, 69)'],
}

export const Themes = {
  Light,
  Dark,
  Fairy,
  Glitterbomb,
  Submarine,
  Laguna,
  Popsicle,
  Rally,
  Latte,
  Carbon,
}
