export const phonenumberPlaceholders: any = {
  'n': '1234567890',
  '1': '123 456 7890',    // North America
  '7': '123 456 7890',    // Russia
  '44': '1234 567 890',   // UK
  '33': '12 34 56 78 90',  // France
  '39': '12 34 56 78 90',  // Italy
  '61': '12 3456 7890',   // Australia
  '52': '123 456 7890',   // Mexico
  '55': '12 3456 7890',   // Brazil
  '91': '12 345 67890',   // India
  '49': '12 345 6789',    // Germany
  '86': '123 4567 8901',  // China
  '81': '12 3456 7890',   // Japan
  '234': '123 456 7890',  // Nigeria
  '63': '123 456 7890',   // Philippines
  '20': '1234 567 890',   // Egypt
  '84': '123 456 7890',   // Vietnam
  '90': '123 456 7890',   // Turkey
  '27': '123 456 7890',   // South Africa
  '82': '12 3456 7890',   // South Korea
  '57': '123 456 7890',   // Colombia
  '34': '123 45 67 89',   // Spain
  '31': '123 456 7890',   // Netherlands
  '351': '123 456 789',   // Portugal
  '46': '12 345 67 89',   // Sweden
  '43': '1234 567 890',   // Austria
  '41': '123 456 7890',   // Switzerland
  '45': '12 34 56 78',    // Denmark
  '358': '123 45 678',    // Finland
  '47': '123 45 678',     // Norway
  '353': '123 456 789',   // Ireland
  '1-876': '123 456 7890', // Jamaica
}

export const formatPhonenumber = (countryCode: string, phoneNumber: string) => {
  const digits = phoneNumber.replace(/\D/g, '')
  const formats: { [key: string]: (digits: string) => string } = {
    'n': (digits) => {
      return digits
    },
    '1': (digits) => { // North America
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '7': (digits) => { // Russia
      const cityCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${cityCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '33': (digits) => { // France
      const segments = digits.match(/.{1,2}/g) || []
      return segments.join(' ')
    },
    '39': (digits) => { // Italy
      const segments = digits.match(/.{1,2}/g) || []
      return segments.join(' ')
    },
    '44': (digits) => { // UK
      return digits
    },
    '49': (digits) => { // Germany
      const areaCode = digits.slice(0, 2)
      const localPrefix = digits.slice(2, 5)
      const lineNumber = digits.slice(5)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '52': (digits) => { // Mexico
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '55': (digits) => { // Brazil
      const areaCode = digits.slice(0, 2)
      const localPrefix = digits.slice(2, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '61': (digits) => { // Australia
      const areaCode = digits.slice(0, 2)
      const localNumber = digits.slice(2)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '86': (digits) => { // China
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 7)
      const lineNumber = digits.slice(7)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '91': (digits) => { // India
      const areaCode = digits.slice(0, 2)
      const localPrefix = digits.slice(2, 5)
      const lineNumber = digits.slice(5)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '81': (digits) => { // Japan
      const areaCode = digits.slice(0, 2)
      const localPrefix = digits.slice(2, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '234': (digits) => { // Nigeria
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '63': (digits) => { // Philippines
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '20': (digits) => { // Egypt
      const areaCode = digits.slice(0, 4)
      const localNumber = digits.slice(4)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '84': (digits) => { // Vietnam
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '90': (digits) => { // Turkey
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '27': (digits) => { // South Africa
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '82': (digits) => { // South Korea
      const areaCode = digits.slice(0, 2)
      const localPrefix = digits.slice(2, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '57': (digits) => { // Colombia
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '34': (digits) => { // Spain
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '31': (digits) => { // Netherlands
      const areaCode = digits.slice(0, 3)
      const localPrefix = digits.slice(3, 6)
      const lineNumber = digits.slice(6)
      return `${areaCode}${localPrefix ? ' ' + localPrefix : ''}${lineNumber ? ' ' + lineNumber : ''}`
    },
    '351': (digits) => { // Portugal
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '46': (digits) => { // Sweden
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '43': (digits) => { // Austria
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '41': (digits) => { // Switzerland
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '45': (digits) => { // Denmark
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '358': (digits) => { // Finland
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '47': (digits) => { // Norway
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
    '353': (digits) => { // Ireland
      const areaCode = digits.slice(0, 3)
      const localNumber = digits.slice(3)
      return `${areaCode}${localNumber ? ' ' + localNumber : ''}`
    },
  }
  const formatter = formats[countryCode] || formats['n']
  return formatter(digits)
}

export const countryData: any = {
  'US': {
    'currency': ['USD'],
    'callingCode': ['1'],
    'region': 'Americas',
    'subregion': 'North America',
    'flag': 'flag-us',
    'name': {
      'eng': 'United States',
      'fra': 'États-Unis',
      'ita': 'Stati Uniti d’America',
      'jpn': 'アメリカ合衆国',
      'por': 'Estados Unidos',
      'rus': 'Соединённые Штаты Америки',
      'spa': 'Estados Unidos',
      'zho': '美国',
      'kor': '미국'
    }
  },
  'CA': {
    'currency': ['CAD'],
    'callingCode': ['1'],
    'region': 'Americas',
    'subregion': 'North America',
    'flag': 'flag-ca',
    'name': {
      'eng': 'Canada',
      'fra': 'Canada',
      'ita': 'Canada',
      'jpn': 'カナダ',
      'por': 'Canadá',
      'rus': 'Канада',
      'spa': 'Canadá',
      'zho': '加拿大',
      'kor': '캐나다'
    }
  },

  'AF': {
    'currency': ['AFN'],
    'callingCode': ['93'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-af',
    'name': {
      'eng': 'Afghanistan',
      'fra': 'Afghanistan',
      'ita': 'Afghanistan',
      'jpn': 'アフガニスタン',
      'por': 'Afeganistão',
      'rus': 'Афганистан',
      'spa': 'Afganistán',
      'zho': '阿富汗',
      'kor': '아프가니스탄'
    }
  },
  'AL': {
    'currency': ['ALL'],
    'callingCode': ['355'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-al',
    'name': {
      'eng': 'Albania',
      'fra': 'Albanie',
      'ita': 'Albania',
      'jpn': 'アルバニア',
      'por': 'Albânia',
      'rus': 'Албания',
      'spa': 'Albania',
      'zho': '阿尔巴尼亚',
      'kor': '알바니아'
    }
  },
  'DZ': {
    'currency': ['DZD'],
    'callingCode': ['213'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-dz',
    'name': {
      'eng': 'Algeria',
      'fra': 'Algérie',
      'ita': 'Algeria',
      'jpn': 'アルジェリア',
      'por': 'Argélia',
      'rus': 'Алжир',
      'spa': 'Argelia',
      'zho': '阿尔及利亚',
      'kor': '알제리'
    }
  },
  'AS': {
    'currency': ['USD'],
    'callingCode': ['1684'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-as',
    'name': {
      'eng': 'American Samoa',
      'fra': 'Samoa américaines',
      'ita': 'Samoa Americane',
      'jpn': 'アメリカ領サモア',
      'por': 'Samoa Americana',
      'rus': 'Американское Самоа',
      'spa': 'Samoa Americana',
      'zho': '美属萨摩亚',
      'kor': '아메리칸사모아'
    }
  },
  'AD': {
    'currency': ['EUR'],
    'callingCode': ['376'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-ad',
    'name': {
      'eng': 'Andorra',
      'fra': 'Andorre',
      'ita': 'Andorra',
      'jpn': 'アンドラ',
      'por': 'Andorra',
      'rus': 'Андорра',
      'spa': 'Andorra',
      'zho': '安道尔',
      'kor': '안도라'
    }
  },
  'AO': {
    'currency': ['AOA'],
    'callingCode': ['244'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-ao',
    'name': {
      'eng': 'Angola',
      'fra': 'Angola',
      'ita': 'Angola',
      'jpn': 'アンゴラ',
      'por': 'Angola',
      'rus': 'Ангола',
      'spa': 'Angola',
      'zho': '安哥拉',
      'kor': '앙골라'
    }
  },
  'AI': {
    'currency': ['XCD'],
    'callingCode': ['1264'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-ai',
    'name': {
      'eng': 'Anguilla',
      'fra': 'Anguilla',
      'ita': 'Anguilla',
      'jpn': 'アンギラ',
      'por': 'Anguilla',
      'rus': 'Ангилья',
      'spa': 'Anguilla',
      'zho': '安圭拉',
      'kor': '앵귈라'
    }
  },
  'AG': {
    'currency': ['XCD'],
    'callingCode': ['1268'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-ag',
    'name': {
      'eng': 'Antigua and Barbuda',
      'fra': 'Antigua-et-Barbuda',
      'ita': 'Antigua e Barbuda',
      'jpn': 'アンティグア・バーブーダ',
      'por': 'Antígua e Barbuda',
      'rus': 'Антигуа и Барбуда',
      'spa': 'Antigua y Barbuda',
      'zho': '安提瓜和巴布达',
      'kor': '앤티가 바부다'
    }
  },
  'AR': {
    'currency': ['ARS'],
    'callingCode': ['54'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-ar',
    'name': {
      'eng': 'Argentina',
      'fra': 'Argentine',
      'ita': 'Argentina',
      'jpn': 'アルゼンチン',
      'por': 'Argentina',
      'rus': 'Аргентина',
      'spa': 'Argentina',
      'zho': '阿根廷',
      'kor': '아르헨티나'
    }
  },
  'AM': {
    'currency': ['AMD'],
    'callingCode': ['374'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-am',
    'name': {
      'eng': 'Armenia',
      'fra': 'Arménie',
      'ita': 'Armenia',
      'jpn': 'アルメニア',
      'por': 'Arménia',
      'rus': 'Армения',
      'spa': 'Armenia',
      'zho': '亚美尼亚',
      'kor': '아르메니아'
    }
  },
  'AW': {
    'currency': ['AWG'],
    'callingCode': ['297'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-aw',
    'name': {
      'eng': 'Aruba',
      'fra': 'Aruba',
      'ita': 'Aruba',
      'jpn': 'アルバ',
      'por': 'Aruba',
      'rus': 'Аруба',
      'spa': 'Aruba',
      'zho': '阿鲁巴',
      'kor': '아루바'
    }
  },
  'AU': {
    'currency': ['AUD'],
    'callingCode': ['61'],
    'region': 'Oceania',
    'subregion': 'Australia and New Zealand',
    'flag': 'flag-au',
    'name': {
      'eng': 'Australia',
      'fra': 'Australie',
      'ita': 'Australia',
      'jpn': 'オーストラリア',
      'por': 'Austrália',
      'rus': 'Австралия',
      'spa': 'Australia',
      'zho': '澳大利亚',
      'kor': '호주'
    }
  },
  'AT': {
    'currency': ['EUR'],
    'callingCode': ['43'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-at',
    'name': {
      'eng': 'Austria',
      'fra': 'Autriche',
      'ita': 'Austria',
      'jpn': 'オーストリア',
      'por': 'Áustria',
      'rus': 'Австрия',
      'spa': 'Austria',
      'zho': '奥地利',
      'kor': '오스트리아'
    }
  },
  'AZ': {
    'currency': ['AZN'],
    'callingCode': ['994'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-az',
    'name': {
      'eng': 'Azerbaijan',
      'fra': 'Azerbaïdjan',
      'ita': 'Azerbaijan',
      'jpn': 'アゼルバイジャン',
      'por': 'Azerbeijão',
      'rus': 'Азербайджан',
      'spa': 'Azerbaiyán',
      'zho': '阿塞拜疆',
      'kor': '아제르바이잔'
    }
  },
  'BS': {
    'currency': ['BSD'],
    'callingCode': ['1242'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-bs',
    'name': {
      'eng': 'Bahamas',
      'fra': 'Bahamas',
      'ita': 'Bahamas',
      'jpn': 'バハマ',
      'por': 'Bahamas',
      'rus': 'Багамские Острова',
      'spa': 'Bahamas',
      'zho': '巴哈马',
      'kor': '바하마'
    }
  },
  'BH': {
    'currency': ['BHD'],
    'callingCode': ['973'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-bh',
    'name': {
      'eng': 'Bahrain',
      'fra': 'Bahreïn',
      'ita': 'Bahrein',
      'jpn': 'バーレーン',
      'por': 'Bahrein',
      'rus': 'Бахрейн',
      'spa': 'Bahrein',
      'zho': '巴林',
      'kor': '바레인'
    }
  },
  'BD': {
    'currency': ['BDT'],
    'callingCode': ['880'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-bd',
    'name': {
      'eng': 'Bangladesh',
      'fra': 'Bangladesh',
      'ita': 'Bangladesh',
      'jpn': 'バングラデシュ',
      'por': 'Bangladesh',
      'rus': 'Бангладеш',
      'spa': 'Bangladesh',
      'zho': '孟加拉国',
      'kor': '방글라데시'
    }
  },
  'BB': {
    'currency': ['BBD'],
    'callingCode': ['1246'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-bb',
    'name': {
      'eng': 'Barbados',
      'fra': 'Barbade',
      'ita': 'Barbados',
      'jpn': 'バルバドス',
      'por': 'Barbados',
      'rus': 'Барбадос',
      'spa': 'Barbados',
      'zho': '巴巴多斯',
      'kor': '바베이도스'
    }
  },
  'BY': {
    'currency': ['BYN'],
    'callingCode': ['375'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-by',
    'name': {
      'eng': 'Belarus',
      'fra': 'Biélorussie',
      'ita': 'Bielorussia',
      'jpn': 'ベラルーシ',
      'por': 'Bielorússia',
      'rus': 'Беларусь',
      'spa': 'Bielorrusia',
      'zho': '白俄罗斯',
      'kor': '벨라루스'
    }
  },
  'BE': {
    'currency': ['EUR'],
    'callingCode': ['32'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-be',
    'name': {
      'eng': 'Belgium',
      'fra': 'Belgique',
      'ita': 'Belgio',
      'jpn': 'ベルギー',
      'por': 'Bélgica',
      'rus': 'Бельгия',
      'spa': 'Bélgica',
      'zho': '比利时',
      'kor': '벨기에'
    }
  },
  'BZ': {
    'currency': ['BZD'],
    'callingCode': ['501'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-bz',
    'name': {
      'eng': 'Belize',
      'fra': 'Belize',
      'ita': 'Belize',
      'jpn': 'ベリーズ',
      'por': 'Belize',
      'rus': 'Белиз',
      'spa': 'Belice',
      'zho': '伯利兹',
      'kor': '벨리즈'
    }
  },
  'BJ': {
    'currency': ['XOF'],
    'callingCode': ['229'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-bj',
    'name': {
      'eng': 'Benin',
      'fra': 'Bénin',
      'ita': 'Benin',
      'jpn': 'ベナン',
      'por': 'Benin',
      'rus': 'Бенин',
      'spa': 'Benín',
      'zho': '贝宁',
      'kor': '베냉'
    }
  },
  'BM': {
    'currency': ['BMD'],
    'callingCode': ['1441'],
    'region': 'Americas',
    'subregion': 'North America',
    'flag': 'flag-bm',
    'name': {
      'eng': 'Bermuda',
      'fra': 'Bermudes',
      'ita': 'Bermuda',
      'jpn': 'バミューダ',
      'por': 'Bermudas',
      'rus': 'Бермудские Острова',
      'spa': 'Bermudas',
      'zho': '百慕大',
      'kor': '버뮤다'
    }
  },
  'BT': {
    'currency': ['BTN', 'INR'],
    'callingCode': ['975'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-bt',
    'name': {
      'eng': 'Bhutan',
      'fra': 'Bhoutan',
      'ita': 'Bhutan',
      'jpn': 'ブータン',
      'por': 'Butão',
      'rus': 'Бутан',
      'spa': 'Bután',
      'zho': '不丹',
      'kor': '부탄'
    }
  },
  'BO': {
    'currency': ['BOB'],
    'callingCode': ['591'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-bo',
    'name': {
      'eng': 'Bolivia',
      'fra': 'Bolivie',
      'ita': 'Bolivia',
      'jpn': 'ボリビア多民族国',
      'por': 'Bolívia',
      'rus': 'Боливия',
      'spa': 'Bolivia',
      'zho': '玻利维亚',
      'kor': '볼리비아'
    }
  },
  'BA': {
    'currency': ['BAM'],
    'callingCode': ['387'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-ba',
    'name': {
      'eng': 'Bosnia and Herzegovina',
      'fra': 'Bosnie-Herzégovine',
      'ita': 'Bosnia ed Erzegovina',
      'jpn': 'ボスニア・ヘルツェゴビナ',
      'por': 'Bósnia e Herzegovina',
      'rus': 'Босния и Герцеговина',
      'spa': 'Bosnia y Herzegovina',
      'zho': '波斯尼亚和黑塞哥维那',
      'kor': '보스니아 헤르체고비나'
    }
  },
  'BW': {
    'currency': ['BWP'],
    'callingCode': ['267'],
    'region': 'Africa',
    'subregion': 'Southern Africa',
    'flag': 'flag-bw',
    'name': {
      'eng': 'Botswana',
      'fra': 'Botswana',
      'ita': 'Botswana',
      'jpn': 'ボツワナ',
      'por': 'Botswana',
      'rus': 'Ботсвана',
      'spa': 'Botswana',
      'zho': '博茨瓦纳',
      'kor': '보츠와나'
    }
  },
  'BR': {
    'currency': ['BRL'],
    'callingCode': ['55'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-br',
    'name': {
      'eng': 'Brazil',
      'fra': 'Brésil',
      'ita': 'Brasile',
      'jpn': 'ブラジル',
      'por': 'Brasil',
      'rus': 'Бразилия',
      'spa': 'Brasil',
      'zho': '巴西',
      'kor': '브라질'
    }
  },
  'IO': {
    'currency': ['USD'],
    'callingCode': ['246'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-io',
    'name': {
      'eng': 'British Indian Ocean Territory',
      'fra': 'Territoire britannique de l’océan Indien',
      'ita': 'Territorio britannico dell’oceano indiano',
      'jpn': 'イギリス領インド洋地域',
      'por': 'Território Britânico do Oceano Índico',
      'rus': 'Британская территория в Индийском океане',
      'spa': 'Territorio Británico del Océano Índico',
      'zho': '英属印度洋领地',
      'kor': '인도'
    }
  },
  'VG': {
    'currency': ['USD'],
    'callingCode': ['1284'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-vg',
    'name': {
      'eng': 'British Virgin Islands',
      'fra': 'Îles Vierges britanniques',
      'ita': 'Isole Vergini Britanniche',
      'jpn': 'イギリス領ヴァージン諸島',
      'por': 'Ilhas Virgens',
      'rus': 'Британские Виргинские острова',
      'spa': 'Islas Vírgenes del Reino Unido',
      'zho': '英属维尔京群岛',
      'kor': '영국령 버진아일랜드'
    }
  },
  'BN': {
    'currency': ['BND'],
    'callingCode': ['673'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-bn',
    'name': {
      'eng': 'Brunei',
      'fra': 'Brunei',
      'ita': 'Brunei',
      'jpn': 'ブルネイ・ダルサラーム',
      'por': 'Brunei',
      'rus': 'Бруней',
      'spa': 'Brunei',
      'zho': '文莱',
      'kor': '브루나이'
    }
  },
  'BG': {
    'currency': ['BGN'],
    'callingCode': ['359'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-bg',
    'name': {
      'eng': 'Bulgaria',
      'fra': 'Bulgarie',
      'ita': 'Bulgaria',
      'jpn': 'ブルガリア',
      'por': 'Bulgária',
      'rus': 'Болгария',
      'spa': 'Bulgaria',
      'zho': '保加利亚',
      'kor': '불가리아'
    }
  },
  'BF': {
    'currency': ['XOF'],
    'callingCode': ['226'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-bf',
    'name': {
      'eng': 'Burkina Faso',
      'fra': 'Burkina Faso',
      'ita': 'Burkina Faso',
      'jpn': 'ブルキナファソ',
      'por': 'Burkina Faso',
      'rus': 'Буркина-Фасо',
      'spa': 'Burkina Faso',
      'zho': '布基纳法索',
      'kor': '부르키나파소'
    }
  },
  'BI': {
    'currency': ['BIF'],
    'callingCode': ['257'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-bi',
    'name': {
      'eng': 'Burundi',
      'fra': 'Burundi',
      'ita': 'Burundi',
      'jpn': 'ブルンジ',
      'por': 'Burundi',
      'rus': 'Бурунди',
      'spa': 'Burundi',
      'zho': '布隆迪',
      'kor': '부룬디'
    }
  },
  'KH': {
    'currency': ['KHR'],
    'callingCode': ['855'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-kh',
    'name': {
      'eng': 'Cambodia',
      'fra': 'Cambodge',
      'ita': 'Cambogia',
      'jpn': 'カンボジア',
      'por': 'Camboja',
      'rus': 'Камбоджа',
      'spa': 'Camboya',
      'zho': '柬埔寨',
      'kor': '캄보디아'
    }
  },
  'CM': {
    'currency': ['XAF'],
    'callingCode': ['237'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-cm',
    'name': {
      'eng': 'Cameroon',
      'fra': 'Cameroun',
      'ita': 'Camerun',
      'jpn': 'カメルーン',
      'por': 'Camarões',
      'rus': 'Камерун',
      'spa': 'Camerún',
      'zho': '喀麦隆',
      'kor': '카메룬'
    }
  },
  // 'CA': {
  //   'currency': ['CAD'],
  //   'callingCode': ['1'],
  //   'region': 'Americas',
  //   'subregion': 'North America',
  //   'flag': 'flag-ca',
  //   'name': {
  //     'eng': 'Canada',
  //     'fra': 'Canada',
  //     'ita': 'Canada',
  //     'jpn': 'カナダ',
  //     'por': 'Canadá',
  //     'rus': 'Канада',
  //     'spa': 'Canadá',
  //     'zho': '加拿大',
  //     'kor': '캐나다'
  //   }
  // },
  'CV': {
    'currency': ['CVE'],
    'callingCode': ['238'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-cv',
    'name': {
      'eng': 'Cape Verde',
      'fra': 'Îles du Cap-Vert',
      'ita': 'Capo Verde',
      'jpn': 'カーボベルデ',
      'por': 'Cabo Verde',
      'rus': 'Кабо-Верде',
      'spa': 'Cabo Verde',
      'zho': '佛得角',
      'kor': '카보베르데'
    }
  },
  'BQ': {
    'currency': ['USD'],
    'callingCode': ['599'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-bq',
    'name': {
      'eng': 'Caribbean Netherlands',
      'fra': 'Pays-Bas caribéens',
      'ita': 'Paesi Bassi caraibici',
      'jpn': 'ボネール、シント・ユースタティウスおよびサバ',
      'por': 'Países Baixos Caribenhos',
      'rus': 'Карибские Нидерланды',
      'spa': 'Caribe Neerlandés',
      'zho': '荷蘭加勒比區',
      'kor': '카리브 네덜란드'
    }
  },
  'KY': {
    'currency': ['KYD'],
    'callingCode': ['1345'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-ky',
    'name': {
      'eng': 'Cayman Islands',
      'fra': 'Îles Caïmans',
      'ita': 'Isole Cayman',
      'jpn': 'ケイマン諸島',
      'por': 'Ilhas Caimão',
      'rus': 'Каймановы острова',
      'spa': 'Islas Caimán',
      'zho': '开曼群岛',
      'kor': '케이맨 제도'
    }
  },
  'CF': {
    'currency': ['XAF'],
    'callingCode': ['236'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-cf',
    'name': {
      'eng': 'Central African Republic',
      'fra': 'République centrafricaine',
      'ita': 'Repubblica Centrafricana',
      'jpn': '中央アフリカ共和国',
      'por': 'República Centro-Africana',
      'rus': 'Центральноафриканская Республика',
      'spa': 'República Centroafricana',
      'zho': '中非共和国',
      'kor': '중앙아프리카 공화국'
    }
  },
  'TD': {
    'currency': ['XAF'],
    'callingCode': ['235'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-td',
    'name': {
      'eng': 'Chad',
      'fra': 'Tchad',
      'ita': 'Ciad',
      'jpn': 'チャド',
      'por': 'Chade',
      'rus': 'Чад',
      'spa': 'Chad',
      'zho': '乍得',
      'kor': '차드'
    }
  },
  'CL': {
    'currency': ['CLP'],
    'callingCode': ['56'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-cl',
    'name': {
      'eng': 'Chile',
      'fra': 'Chili',
      'ita': 'Cile',
      'jpn': 'チリ',
      'por': 'Chile',
      'rus': 'Чили',
      'spa': 'Chile',
      'zho': '智利',
      'kor': '칠레'
    }
  },
  'CN': {
    'currency': ['CNY'],
    'callingCode': ['86'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-cn',
    'name': {
      'eng': 'China',
      'fra': 'Chine',
      'ita': 'Cina',
      'jpn': '中国',
      'por': 'China',
      'rus': 'Китай',
      'spa': 'China',
      'kor': '중국'
    }
  },
  'CX': {
    'currency': ['AUD'],
    'callingCode': ['61'],
    'region': 'Oceania',
    'subregion': 'Australia and New Zealand',
    'flag': 'flag-cx',
    'name': {
      'eng': 'Christmas Island',
      'fra': 'Île Christmas',
      'ita': 'Isola di Natale',
      'jpn': 'クリスマス島',
      'por': 'Ilha do Natal',
      'rus': 'Остров Рождества',
      'spa': 'Isla de Navidad',
      'zho': '圣诞岛',
      'kor': '크리스마스 섬'
    }
  },
  'CC': {
    'currency': ['AUD'],
    'callingCode': ['61'],
    'region': 'Oceania',
    'subregion': 'Australia and New Zealand',
    'flag': 'flag-cc',
    'name': {
      'eng': 'Cocos (Keeling) Islands',
      'fra': 'Îles Cocos',
      'ita': 'Isole Cocos e Keeling',
      'jpn': 'ココス（キーリング）諸島',
      'por': 'Ilhas Cocos (Keeling)',
      'rus': 'Кокосовые острова',
      'spa': 'Islas Cocos o Islas Keeling',
      'zho': '科科斯',
      'kor': '코코스 제도'
    }
  },
  'CO': {
    'currency': ['COP'],
    'callingCode': ['57'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-co',
    'name': {
      'eng': 'Colombia',
      'fra': 'Colombie',
      'ita': 'Colombia',
      'jpn': 'コロンビア',
      'por': 'Colômbia',
      'rus': 'Колумбия',
      'spa': 'Colombia',
      'zho': '哥伦比亚',
      'kor': '콜롬비아'
    }
  },
  'KM': {
    'currency': ['KMF'],
    'callingCode': ['269'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-km',
    'name': {
      'eng': 'Comoros',
      'fra': 'Comores',
      'ita': 'Comore',
      'jpn': 'コモロ',
      'por': 'Comores',
      'rus': 'Коморы',
      'spa': 'Comoras',
      'zho': '科摩罗',
      'kor': '코모로'
    }
  },
  'CK': {
    'currency': ['NZD', 'CKD'],
    'callingCode': ['682'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-ck',
    'name': {
      'eng': 'Cook Islands',
      'fra': 'Îles Cook',
      'ita': 'Isole Cook',
      'jpn': 'クック諸島',
      'por': 'Ilhas Cook',
      'rus': 'Острова Кука',
      'spa': 'Islas Cook',
      'zho': '库克群岛',
      'kor': '쿡 제도'
    }
  },
  'CR': {
    'currency': ['CRC'],
    'callingCode': ['506'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-cr',
    'name': {
      'eng': 'Costa Rica',
      'fra': 'Costa Rica',
      'ita': 'Costa Rica',
      'jpn': 'コスタリカ',
      'por': 'Costa Rica',
      'rus': 'Коста-Рика',
      'spa': 'Costa Rica',
      'zho': '哥斯达黎加',
      'kor': '코스타리카'
    }
  },
  'HR': {
    'currency': ['HRK'],
    'callingCode': ['385'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-hr',
    'name': {
      'eng': 'Croatia',
      'fra': 'Croatie',
      'ita': 'Croazia',
      'jpn': 'クロアチア',
      'por': 'Croácia',
      'rus': 'Хорватия',
      'spa': 'Croacia',
      'zho': '克罗地亚',
      'kor': '크로아티아'
    }
  },
  'CU': {
    'currency': ['CUC', 'CUP'],
    'callingCode': ['53'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-cu',
    'name': {
      'eng': 'Cuba',
      'fra': 'Cuba',
      'ita': 'Cuba',
      'jpn': 'キューバ',
      'por': 'Cuba',
      'rus': 'Куба',
      'spa': 'Cuba',
      'zho': '古巴',
      'kor': '쿠바'
    }
  },
  'CW': {
    'currency': ['ANG'],
    'callingCode': ['5999'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-cw',
    'name': {
      'eng': 'Curaçao',
      'fra': 'Curaçao',
      'por': 'ilha da Curação',
      'rus': 'Кюрасао',
      'spa': 'Curazao',
      'zho': '库拉索',
      'kor': '퀴라소'
    }
  },
  'CY': {
    'currency': ['EUR'],
    'callingCode': ['357'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-cy',
    'name': {
      'eng': 'Cyprus',
      'fra': 'Chypre',
      'ita': 'Cipro',
      'jpn': 'キプロス',
      'por': 'Chipre',
      'rus': 'Кипр',
      'spa': 'Chipre',
      'zho': '塞浦路斯',
      'kor': '키프로스'
    }
  },
  'CZ': {
    'currency': ['CZK'],
    'callingCode': ['420'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-cz',
    'name': {
      'eng': 'Czechia',
      'fra': 'Tchéquie',
      'ita': 'Cechia',
      'jpn': 'チェコ',
      'por': 'Chéquia',
      'rus': 'Чехия',
      'spa': 'Chequia',
      'zho': '捷克',
      'kor': '체코'
    }
  },
  'CD': {
    'currency': ['CDF'],
    'callingCode': ['243'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-cd',
    'name': {
      'eng': 'DR Congo',
      'fra': 'Congo (Rép. dém.)',
      'ita': 'Congo (Rep. Dem.)',
      'jpn': 'コンゴ民主共和国',
      'por': 'República Democrática do Congo',
      'rus': 'Демократическая Республика Конго',
      'spa': 'Congo (Rep. Dem.)',
      'zho': '民主刚果',
      'kor': '콩고 민주 공화국'
    }
  },
  'DK': {
    'currency': ['DKK'],
    'callingCode': ['45'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-dk',
    'name': {
      'eng': 'Denmark',
      'fra': 'Danemark',
      'ita': 'Danimarca',
      'jpn': 'デンマーク',
      'por': 'Dinamarca',
      'rus': 'Дания',
      'spa': 'Dinamarca',
      'zho': '丹麦',
      'kor': '덴마크'
    }
  },
  'DJ': {
    'currency': ['DJF'],
    'callingCode': ['253'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-dj',
    'name': {
      'eng': 'Djibouti',
      'fra': 'Djibouti',
      'ita': 'Gibuti',
      'jpn': 'ジブチ',
      'por': 'Djibouti',
      'rus': 'Джибути',
      'spa': 'Djibouti',
      'zho': '吉布提',
      'kor': '지부티'
    }
  },
  'DM': {
    'currency': ['XCD'],
    'callingCode': ['1767'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-dm',
    'name': {
      'eng': 'Dominica',
      'fra': 'Dominique',
      'ita': 'Dominica',
      'jpn': 'ドミニカ国',
      'por': 'Dominica',
      'rus': 'Доминика',
      'spa': 'Dominica',
      'zho': '多米尼加',
      'kor': '도미니카 공화국'
    }
  },
  'DO': {
    'currency': ['DOP'],
    'callingCode': ['1809', '1829', '1849'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-do',
    'name': {
      'eng': 'Dominican Republic',
      'fra': 'République dominicaine',
      'ita': 'Repubblica Dominicana',
      'jpn': 'ドミニカ共和国',
      'por': 'República Dominicana',
      'rus': 'Доминиканская Республика',
      'spa': 'República Dominicana',
      'zho': '多明尼加',
      'kor': '도미니카 공화국'
    }
  },
  'EC': {
    'currency': ['USD'],
    'callingCode': ['593'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-ec',
    'name': {
      'eng': 'Ecuador',
      'fra': 'Équateur',
      'ita': 'Ecuador',
      'jpn': 'エクアドル',
      'por': 'Equador',
      'rus': 'Эквадор',
      'spa': 'Ecuador',
      'zho': '厄瓜多尔',
      'kor': '에콰도르'
    }
  },
  'EG': {
    'currency': ['EGP'],
    'callingCode': ['20'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-eg',
    'name': {
      'eng': 'Egypt',
      'fra': 'Égypte',
      'ita': 'Egitto',
      'jpn': 'エジプト',
      'por': 'Egito',
      'rus': 'Египет',
      'spa': 'Egipto',
      'zho': '埃及',
      'kor': '이집트'
    }
  },
  'SV': {
    'currency': ['SVC', 'USD'],
    'callingCode': ['503'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-sv',
    'name': {
      'eng': 'El Salvador',
      'fra': 'Salvador',
      'ita': 'El Salvador',
      'jpn': 'エルサルバドル',
      'por': 'El Salvador',
      'rus': 'Сальвадор',
      'spa': 'El Salvador',
      'zho': '萨尔瓦多',
      'kor': '엘살바도르'
    }
  },
  'GQ': {
    'currency': ['XAF'],
    'callingCode': ['240'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-gq',
    'name': {
      'eng': 'Equatorial Guinea',
      'fra': 'Guinée équatoriale',
      'ita': 'Guinea Equatoriale',
      'jpn': '赤道ギニア',
      'por': 'Guiné Equatorial',
      'rus': 'Экваториальная Гвинея',
      'spa': 'Guinea Ecuatorial',
      'zho': '赤道几内亚',
      'kor': '적도 기니'
    }
  },
  'ER': {
    'currency': ['ERN'],
    'callingCode': ['291'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-er',
    'name': {
      'eng': 'Eritrea',
      'fra': 'Érythrée',
      'ita': 'Eritrea',
      'jpn': 'エリトリア',
      'por': 'Eritreia',
      'rus': 'Эритрея',
      'spa': 'Eritrea',
      'zho': '厄立特里亚',
      'kor': '에리트레아'
    }
  },
  'EE': {
    'currency': ['EUR'],
    'callingCode': ['372'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-ee',
    'name': {
      'eng': 'Estonia',
      'fra': 'Estonie',
      'ita': 'Estonia',
      'jpn': 'エストニア',
      'por': 'Estónia',
      'rus': 'Эстония',
      'spa': 'Estonia',
      'zho': '爱沙尼亚',
      'kor': '에스토니아'
    }
  },
  'SZ': {
    'currency': ['SZL'],
    'callingCode': ['268'],
    'region': 'Africa',
    'subregion': 'Southern Africa',
    'flag': 'flag-sz',
    'name': {
      'eng': 'Eswatini',
      'fra': 'Swaziland',
      'ita': 'Swaziland',
      'jpn': 'スワジランド',
      'por': 'Suazilândia',
      'rus': 'Свазиленд',
      'spa': 'Suazilandia',
      'zho': '斯威士兰',
      'kor': '에스와티니'
    }
  },
  'ET': {
    'currency': ['ETB'],
    'callingCode': ['251'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-et',
    'name': {
      'eng': 'Ethiopia',
      'fra': 'Éthiopie',
      'ita': 'Etiopia',
      'jpn': 'エチオピア',
      'por': 'Etiópia',
      'rus': 'Эфиопия',
      'spa': 'Etiopía',
      'zho': '埃塞俄比亚',
      'kor': '에티오피아'
    }
  },
  'FK': {
    'currency': ['FKP'],
    'callingCode': ['500'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-fk',
    'name': {
      'eng': 'Falkland Islands',
      'fra': 'Îles Malouines',
      'ita': 'Isole Falkland o Isole Malvine',
      'jpn': 'フォークランド（マルビナス）諸島',
      'por': 'Ilhas Malvinas',
      'rus': 'Фолклендские острова',
      'spa': 'Islas Malvinas',
      'zho': '福克兰群岛',
      'kor': '포클랜드 제도'
    }
  },
  'FO': {
    'currency': ['DKK'],
    'callingCode': ['298'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-fo',
    'name': {
      'eng': 'Faroe Islands',
      'fra': 'Îles Féroé',
      'ita': 'Isole Far Oer',
      'jpn': 'フェロー諸島',
      'por': 'Ilhas Faroé',
      'rus': 'Фарерские острова',
      'spa': 'Islas Faroe',
      'zho': '法罗群岛',
      'kor': '페로 제도'
    }
  },
  'FJ': {
    'currency': ['FJD'],
    'callingCode': ['679'],
    'region': 'Oceania',
    'subregion': 'Melanesia',
    'flag': 'flag-fj',
    'name': {
      'eng': 'Fiji',
      'fra': 'Fidji',
      'ita': 'Figi',
      'jpn': 'フィジー',
      'por': 'Fiji',
      'rus': 'Фиджи',
      'spa': 'Fiyi',
      'zho': '斐济',
      'kor': '피지'
    }
  },
  'FI': {
    'currency': ['EUR'],
    'callingCode': ['358'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-fi',
    'name': {
      'eng': 'Finland',
      'fra': 'Finlande',
      'ita': 'Finlandia',
      'jpn': 'フィンランド',
      'por': 'Finlândia',
      'rus': 'Финляндия',
      'spa': 'Finlandia',
      'zho': '芬兰',
      'kor': '핀란드'
    }
  },
  'FR': {
    'currency': ['EUR'],
    'callingCode': ['33'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-fr',
    'name': {
      'eng': 'France',
      'fra': 'France',
      'ita': 'Francia',
      'jpn': 'フランス',
      'por': 'França',
      'rus': 'Франция',
      'spa': 'Francia',
      'zho': '法国',
      'kor': '프랑스'
    }
  },
  'GF': {
    'currency': ['EUR'],
    'callingCode': ['594'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-gf',
    'name': {
      'eng': 'French Guiana',
      'fra': 'Guyane',
      'ita': 'Guyana francese',
      'jpn': 'フランス領ギアナ',
      'por': 'Guiana Francesa',
      'rus': 'Французская Гвиана',
      'spa': 'Guayana Francesa',
      'zho': '法属圭亚那',
      'kor': '프랑스령 기아나'
    }
  },
  'PF': {
    'currency': ['XPF'],
    'callingCode': ['689'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-pf',
    'name': {
      'eng': 'French Polynesia',
      'fra': 'Polynésie française',
      'ita': 'Polinesia Francese',
      'jpn': 'フランス領ポリネシア',
      'por': 'Polinésia Francesa',
      'rus': 'Французская Полинезия',
      'spa': 'Polinesia Francesa',
      'zho': '法属波利尼西亚',
      'kor': '프랑스령 폴리네시아'
    }
  },
  'GA': {
    'currency': ['XAF'],
    'callingCode': ['241'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-ga',
    'name': {
      'eng': 'Gabon',
      'fra': 'Gabon',
      'ita': 'Gabon',
      'jpn': 'ガボン',
      'por': 'Gabão',
      'rus': 'Габон',
      'spa': 'Gabón',
      'zho': '加蓬',
      'kor': '가봉'
    }
  },
  'GM': {
    'currency': ['GMD'],
    'callingCode': ['220'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-gm',
    'name': {
      'eng': 'Gambia',
      'fra': 'Gambie',
      'ita': 'Gambia',
      'jpn': 'ガンビア',
      'por': 'Gâmbia',
      'rus': 'Гамбия',
      'spa': 'Gambia',
      'zho': '冈比亚',
      'kor': '감비아'
    }
  },
  'GE': {
    'currency': ['GEL'],
    'callingCode': ['995'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-ge',
    'name': {
      'eng': 'Georgia',
      'fra': 'Géorgie',
      'ita': 'Georgia',
      'jpn': 'グルジア',
      'por': 'Geórgia',
      'rus': 'Грузия',
      'spa': 'Georgia',
      'zho': '格鲁吉亚',
      'kor': '조지아'
    }
  },
  'DE': {
    'currency': ['EUR'],
    'callingCode': ['49'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-de',
    'name': {
      'eng': 'Germany',
      'fra': 'Allemagne',
      'ita': 'Germania',
      'jpn': 'ドイツ',
      'por': 'Alemanha',
      'rus': 'Германия',
      'spa': 'Alemania',
      'zho': '德国',
      'kor': '독일'
    }
  },
  'GH': {
    'currency': ['GHS'],
    'callingCode': ['233'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-gh',
    'name': {
      'eng': 'Ghana',
      'fra': 'Ghana',
      'ita': 'Ghana',
      'jpn': 'ガーナ',
      'por': 'Gana',
      'rus': 'Гана',
      'spa': 'Ghana',
      'zho': '加纳',
      'kor': '가나'
    }
  },
  'GI': {
    'currency': ['GIP'],
    'callingCode': ['350'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-gi',
    'name': {
      'eng': 'Gibraltar',
      'fra': 'Gibraltar',
      'ita': 'Gibilterra',
      'jpn': 'ジブラルタル',
      'por': 'Gibraltar',
      'rus': 'Гибралтар',
      'spa': 'Gibraltar',
      'zho': '直布罗陀',
      'kor': '지브롤터'
    }
  },
  'GR': {
    'currency': ['EUR'],
    'callingCode': ['30'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-gr',
    'name': {
      'eng': 'Greece',
      'fra': 'Grèce',
      'ita': 'Grecia',
      'jpn': 'ギリシャ',
      'por': 'Grécia',
      'rus': 'Греция',
      'spa': 'Grecia',
      'zho': '希腊',
      'kor': '그리스'
    }
  },
  'GL': {
    'currency': ['DKK'],
    'callingCode': ['299'],
    'region': 'Americas',
    'subregion': 'North America',
    'flag': 'flag-gl',
    'name': {
      'eng': 'Greenland',
      'fra': 'Groenland',
      'ita': 'Groenlandia',
      'jpn': 'グリーンランド',
      'por': 'Gronelândia',
      'rus': 'Гренландия',
      'spa': 'Groenlandia',
      'zho': '格陵兰',
      'kor': '그린란드'
    }
  },
  'GD': {
    'currency': ['XCD'],
    'callingCode': ['1473'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-gd',
    'name': {
      'eng': 'Grenada',
      'fra': 'Grenade',
      'ita': 'Grenada',
      'jpn': 'グレナダ',
      'por': 'Granada',
      'rus': 'Гренада',
      'spa': 'Grenada',
      'zho': '格林纳达',
      'kor': '그레나다'
    }
  },
  'GP': {
    'currency': ['EUR'],
    'callingCode': ['590'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-gp',
    'name': {
      'eng': 'Guadeloupe',
      'fra': 'Guadeloupe',
      'ita': 'Guadeloupa',
      'jpn': 'グアドループ',
      'por': 'Guadalupe',
      'rus': 'Гваделупа',
      'spa': 'Guadalupe',
      'zho': '瓜德罗普岛',
      'kor': '과들루프'
    }
  },
  'GU': {
    'currency': ['USD'],
    'callingCode': ['1671'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-gu',
    'name': {
      'eng': 'Guam',
      'fra': 'Guam',
      'ita': 'Guam',
      'jpn': 'グアム',
      'por': 'Guam',
      'rus': 'Гуам',
      'spa': 'Guam',
      'zho': '关岛',
      'kor': '괌'
    }
  },
  'GT': {
    'currency': ['GTQ'],
    'callingCode': ['502'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-gt',
    'name': {
      'eng': 'Guatemala',
      'fra': 'Guatemala',
      'ita': 'Guatemala',
      'jpn': 'グアテマラ',
      'por': 'Guatemala',
      'rus': 'Гватемала',
      'spa': 'Guatemala',
      'zho': '危地马拉',
      'kor': '과테말라'
    }
  },
  'GG': {
    'currency': ['GBP'],
    'callingCode': ['44'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-gg',
    'name': {
      'eng': 'Guernsey',
      'fra': 'Guernesey',
      'ita': 'Guernsey',
      'jpn': 'ガーンジー',
      'por': 'Guernsey',
      'rus': 'Гернси',
      'spa': 'Guernsey',
      'zho': '根西岛',
      'kor': '건지 섬'
    }
  },
  'GN': {
    'currency': ['GNF'],
    'callingCode': ['224'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-gn',
    'name': {
      'eng': 'Guinea',
      'fra': 'Guinée',
      'ita': 'Guinea',
      'jpn': 'ギニア',
      'por': 'Guiné',
      'rus': 'Гвинея',
      'spa': 'Guinea',
      'zho': '几内亚',
      'kor': '기니'
    }
  },
  'GW': {
    'currency': ['XOF'],
    'callingCode': ['245'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-gw',
    'name': {
      'eng': 'Guinea-Bissau',
      'fra': 'Guinée-Bissau',
      'ita': 'Guinea-Bissau',
      'jpn': 'ギニアビサウ',
      'por': 'Guiné-Bissau',
      'rus': 'Гвинея-Бисау',
      'spa': 'Guinea-Bisáu',
      'zho': '几内亚比绍',
      'kor': '기니비사우'
    }
  },
  'GY': {
    'currency': ['GYD'],
    'callingCode': ['592'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-gy',
    'name': {
      'eng': 'Guyana',
      'fra': 'Guyana',
      'ita': 'Guyana',
      'jpn': 'ガイアナ',
      'por': 'Guiana',
      'rus': 'Гайана',
      'spa': 'Guyana',
      'zho': '圭亚那',
      'kor': '가이아나'
    }
  },
  'HT': {
    'currency': ['HTG', 'USD'],
    'callingCode': ['509'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-ht',
    'name': {
      'eng': 'Haiti',
      'fra': 'Haïti',
      'ita': 'Haiti',
      'jpn': 'ハイチ',
      'por': 'Haiti',
      'rus': 'Гаити',
      'spa': 'Haiti',
      'zho': '海地',
      'kor': '아이티'
    }
  },
  'HN': {
    'currency': ['HNL'],
    'callingCode': ['504'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-hn',
    'name': {
      'eng': 'Honduras',
      'fra': 'Honduras',
      'ita': 'Honduras',
      'jpn': 'ホンジュラス',
      'por': 'Honduras',
      'rus': 'Гондурас',
      'spa': 'Honduras',
      'zho': '洪都拉斯',
      'kor': '온두라스'
    }
  },
  'HK': {
    'currency': ['HKD'],
    'callingCode': ['852'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-hk',
    'name': {
      'eng': 'Hong Kong',
      'fra': 'Hong Kong',
      'ita': 'Hong Kong',
      'jpn': '香港',
      'por': 'Hong Kong',
      'rus': 'Гонконг',
      'spa': 'Hong Kong',
      'kor': '홍콩'
    }
  },
  'HU': {
    'currency': ['HUF'],
    'callingCode': ['36'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-hu',
    'name': {
      'eng': 'Hungary',
      'fra': 'Hongrie',
      'ita': 'Ungheria',
      'jpn': 'ハンガリー',
      'por': 'Hungria',
      'rus': 'Венгрия',
      'spa': 'Hungría',
      'zho': '匈牙利',
      'kor': '헝가리'
    }
  },
  'IS': {
    'currency': ['ISK'],
    'callingCode': ['354'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-is',
    'name': {
      'eng': 'Iceland',
      'fra': 'Islande',
      'ita': 'Islanda',
      'jpn': 'アイスランド',
      'por': 'Islândia',
      'rus': 'Исландия',
      'spa': 'Islandia',
      'zho': '冰岛',
      'kor': '아이슬란드'
    }
  },
  'IN': {
    'currency': ['INR'],
    'callingCode': ['91'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-in',
    'name': {
      'eng': 'India',
      'fra': 'Inde',
      'ita': 'India',
      'jpn': 'インド',
      'por': 'Índia',
      'rus': 'Индия',
      'spa': 'India',
      'zho': '印度',
      'kor': '인도'
    }
  },
  'ID': {
    'currency': ['IDR'],
    'callingCode': ['62'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-id',
    'name': {
      'eng': 'Indonesia',
      'fra': 'Indonésie',
      'ita': 'Indonesia',
      'jpn': 'インドネシア',
      'por': 'Indonésia',
      'rus': 'Индонезия',
      'spa': 'Indonesia',
      'zho': '印度尼西亚',
      'kor': '인도네시아'
    }
  },
  'IR': {
    'currency': ['IRR'],
    'callingCode': ['98'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-ir',
    'name': {
      'eng': 'Iran',
      'fra': 'Iran',
      'ita': 'Iran',
      'jpn': 'イラン・イスラム共和国',
      'por': 'Irão',
      'rus': 'Иран',
      'spa': 'Iran',
      'zho': '伊朗',
      'kor': '이란'
    }
  },
  'IQ': {
    'currency': ['IQD'],
    'callingCode': ['964'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-iq',
    'name': {
      'eng': 'Iraq',
      'fra': 'Irak',
      'ita': 'Iraq',
      'jpn': 'イラク',
      'por': 'Iraque',
      'rus': 'Ирак',
      'spa': 'Irak',
      'zho': '伊拉克',
      'kor': '이라크'
    }
  },
  'IE': {
    'currency': ['EUR'],
    'callingCode': ['353'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-ie',
    'name': {
      'eng': 'Ireland',
      'fra': 'Irlande',
      'ita': 'Irlanda',
      'jpn': 'アイルランド',
      'por': 'Irlanda',
      'rus': 'Ирландия',
      'spa': 'Irlanda',
      'zho': '爱尔兰',
      'kor': '아일랜드'
    }
  },
  'IM': {
    'currency': ['GBP'],
    'callingCode': ['44'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-im',
    'name': {
      'eng': 'Isle of Man',
      'fra': 'Île de Man',
      'ita': 'Isola di Man',
      'jpn': 'マン島',
      'por': 'Ilha de Man',
      'rus': 'Остров Мэн',
      'spa': 'Isla de Man',
      'zho': '马恩岛',
      'kor': '맨섬'
    }
  },
  'IL': {
    'currency': ['ILS'],
    'callingCode': ['972'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-il',
    'name': {
      'eng': 'Israel',
      'fra': 'Israël',
      'ita': 'Israele',
      'jpn': 'イスラエル',
      'por': 'Israel',
      'rus': 'Израиль',
      'spa': 'Israel',
      'zho': '以色列',
      'kor': '이스라엘'
    }
  },
  'IT': {
    'currency': ['EUR'],
    'callingCode': ['39'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-it',
    'name': {
      'eng': 'Italy',
      'fra': 'Italie',
      'ita': 'Italia',
      'jpn': 'イタリア',
      'por': 'Itália',
      'rus': 'Италия',
      'spa': 'Italia',
      'zho': '意大利',
      'kor': '이탈리아'
    }
  },
  'CI': {
    'currency': ['XOF'],
    'callingCode': ['225'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-ci',
    'name': {
      'eng': 'Ivory Coast',
      'fra': 'Côte d’Ivoire',
      'ita': 'Costa d’Avorio',
      'jpn': 'コートジボワール',
      'por': 'Costa do Marfim',
      'rus': 'Кот-д’Ивуар',
      'spa': 'Costa de Marfil',
      'zho': '科特迪瓦',
      'kor': '코트디부아르'
    }
  },
  'JM': {
    'currency': ['JMD'],
    'callingCode': ['1876'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-jm',
    'name': {
      'eng': 'Jamaica',
      'fra': 'Jamaïque',
      'ita': 'Giamaica',
      'jpn': 'ジャマイカ',
      'por': 'Jamaica',
      'rus': 'Ямайка',
      'spa': 'Jamaica',
      'zho': '牙买加',
      'kor': '자메이카'
    }
  },
  'JP': {
    'currency': ['JPY'],
    'callingCode': ['81'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-jp',
    'name': {
      'eng': 'Japan',
      'fra': 'Japon',
      'ita': 'Giappone',
      'jpn': '日本',
      'por': 'Japão',
      'rus': 'Япония',
      'spa': 'Japón',
      'zho': '日本',
      'kor': '일본'
    }
  },
  'JE': {
    'currency': ['GBP'],
    'callingCode': ['44'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-je',
    'name': {
      'eng': 'Jersey',
      'fra': 'Jersey',
      'ita': 'Isola di Jersey',
      'jpn': 'ジャージー',
      'por': 'Jersey',
      'rus': 'Джерси',
      'spa': 'Jersey',
      'zho': '泽西岛',
      'kor': '저지 섬'
    }
  },
  'JO': {
    'currency': ['JOD'],
    'callingCode': ['962'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-jo',
    'name': {
      'eng': 'Jordan',
      'fra': 'Jordanie',
      'ita': 'Giordania',
      'jpn': 'ヨルダン',
      'por': 'Jordânia',
      'rus': 'Иордания',
      'spa': 'Jordania',
      'zho': '约旦',
      'kor': '요르단'
    }
  },
  'KZ': {
    'currency': ['KZT'],
    'callingCode': ['7'],
    'region': 'Asia',
    'subregion': 'Central Asia',
    'flag': 'flag-kz',
    'name': {
      'eng': 'Kazakhstan',
      'fra': 'Kazakhstan',
      'ita': 'Kazakistan',
      'jpn': 'カザフスタン',
      'por': 'Cazaquistão',
      'rus': 'Казахстан',
      'spa': 'Kazajistán',
      'zho': '哈萨克斯坦',
      'kor': '카자흐스탄'
    }
  },
  'KE': {
    'currency': ['KES'],
    'callingCode': ['254'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-ke',
    'name': {
      'eng': 'Kenya',
      'fra': 'Kenya',
      'ita': 'Kenya',
      'jpn': 'ケニア',
      'por': 'Quénia',
      'rus': 'Кения',
      'spa': 'Kenia',
      'zho': '肯尼亚',
      'kor': '케냐'
    }
  },
  'KI': {
    'currency': ['AUD'],
    'callingCode': ['686'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-ki',
    'name': {
      'eng': 'Kiribati',
      'fra': 'Kiribati',
      'ita': 'Kiribati',
      'jpn': 'キリバス',
      'por': 'Kiribati',
      'rus': 'Кирибати',
      'spa': 'Kiribati',
      'zho': '基里巴斯',
      'kor': '키리바시'
    }
  },
  'XK': {
    'currency': ['EUR'],
    'callingCode': ['383'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-xk',
    'name': {
      'eng': 'Kosovo',
      'fra': 'Kosovo',
      'ita': 'Kosovo',
      'por': 'Kosovo',
      'rus': 'Республика Косово',
      'spa': 'Kosovo',
      'zho': '科索沃',
      'kor': '코소보'
    }
  },
  'KW': {
    'currency': ['KWD'],
    'callingCode': ['965'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-kw',
    'name': {
      'eng': 'Kuwait',
      'fra': 'Koweït',
      'ita': 'Kuwait',
      'jpn': 'クウェート',
      'por': 'Kuwait',
      'rus': 'Кувейт',
      'spa': 'Kuwait',
      'zho': '科威特',
      'kor': '쿠웨이트'
    }
  },
  'KG': {
    'currency': ['KGS'],
    'callingCode': ['996'],
    'region': 'Asia',
    'subregion': 'Central Asia',
    'flag': 'flag-kg',
    'name': {
      'eng': 'Kyrgyzstan',
      'fra': 'Kirghizistan',
      'ita': 'Kirghizistan',
      'jpn': 'キルギス',
      'por': 'Quirguistão',
      'rus': 'Киргизия',
      'spa': 'Kirguizistán',
      'zho': '吉尔吉斯斯坦',
      'kor': '키르기스스탄'
    }
  },
  'LA': {
    'currency': ['LAK'],
    'callingCode': ['856'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-la',
    'name': {
      'eng': 'Laos',
      'fra': 'Laos',
      'ita': 'Laos',
      'jpn': 'ラオス人民民主共和国',
      'por': 'Laos',
      'rus': 'Лаос',
      'spa': 'Laos',
      'zho': '老挝',
      'kor': '라오스'
    }
  },
  'LV': {
    'currency': ['EUR'],
    'callingCode': ['371'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-lv',
    'name': {
      'eng': 'Latvia',
      'fra': 'Lettonie',
      'ita': 'Lettonia',
      'jpn': 'ラトビア',
      'por': 'Letónia',
      'rus': 'Латвия',
      'spa': 'Letonia',
      'zho': '拉脱维亚',
      'kor': '라트비아'
    }
  },
  'LB': {
    'currency': ['LBP'],
    'callingCode': ['961'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-lb',
    'name': {
      'eng': 'Lebanon',
      'fra': 'Liban',
      'ita': 'Libano',
      'jpn': 'レバノン',
      'por': 'Líbano',
      'rus': 'Ливан',
      'spa': 'Líbano',
      'zho': '黎巴嫩',
      'kor': '레바논'
    }
  },
  'LS': {
    'currency': ['LSL', 'ZAR'],
    'callingCode': ['266'],
    'region': 'Africa',
    'subregion': 'Southern Africa',
    'flag': 'flag-ls',
    'name': {
      'eng': 'Lesotho',
      'fra': 'Lesotho',
      'ita': 'Lesotho',
      'jpn': 'レソト',
      'por': 'Lesoto',
      'rus': 'Лесото',
      'spa': 'Lesotho',
      'zho': '莱索托',
      'kor': '레소토'
    }
  },
  'LR': {
    'currency': ['LRD'],
    'callingCode': ['231'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-lr',
    'name': {
      'eng': 'Liberia',
      'fra': 'Liberia',
      'ita': 'Liberia',
      'jpn': 'リベリア',
      'por': 'Libéria',
      'rus': 'Либерия',
      'spa': 'Liberia',
      'zho': '利比里亚',
      'kor': '라이베리아'
    }
  },
  'LY': {
    'currency': ['LYD'],
    'callingCode': ['218'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-ly',
    'name': {
      'eng': 'Libya',
      'fra': 'Libye',
      'ita': 'Libia',
      'jpn': 'リビア',
      'por': 'Líbia',
      'rus': 'Ливия',
      'spa': 'Libia',
      'zho': '利比亚',
      'kor': '리비아'
    }
  },
  'LI': {
    'currency': ['CHF'],
    'callingCode': ['423'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-li',
    'name': {
      'eng': 'Liechtenstein',
      'fra': 'Liechtenstein',
      'ita': 'Liechtenstein',
      'jpn': 'リヒテンシュタイン',
      'por': 'Liechtenstein',
      'rus': 'Лихтенштейн',
      'spa': 'Liechtenstein',
      'zho': '列支敦士登',
      'kor': '리히텐슈타인'
    }
  },
  'LT': {
    'currency': ['EUR'],
    'callingCode': ['370'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-lt',
    'name': {
      'eng': 'Lithuania',
      'fra': 'Lituanie',
      'ita': 'Lituania',
      'jpn': 'リトアニア',
      'por': 'Lituânia',
      'rus': 'Литва',
      'spa': 'Lituania',
      'zho': '立陶宛',
      'kor': '리투아니아'
    }
  },
  'LU': {
    'currency': ['EUR'],
    'callingCode': ['352'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-lu',
    'name': {
      'eng': 'Luxembourg',
      'fra': 'Luxembourg',
      'ita': 'Lussemburgo',
      'jpn': 'ルクセンブルク',
      'por': 'Luxemburgo',
      'rus': 'Люксембург',
      'spa': 'Luxemburgo',
      'zho': '卢森堡',
      'kor': '룩셈부르크'
    }
  },
  'MO': {
    'currency': ['MOP'],
    'callingCode': ['853'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-mo',
    'name': {
      'eng': 'Macau',
      'fra': 'Macao',
      'ita': 'Macao',
      'jpn': 'マカオ',
      'por': 'Macau',
      'rus': 'Макао',
      'spa': 'Macao',
      'kor': '마카오'
    }
  },
  'MK': {
    'currency': ['MKD'],
    'callingCode': ['389'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-mk',
    'name': {
      'eng': 'Macedonia',
      'fra': 'Macédoine',
      'ita': 'Macedonia',
      'jpn': 'マケドニア旧ユーゴスラビア共和国',
      'por': 'Macedónia',
      'rus': 'Республика Македония',
      'spa': 'Macedonia',
      'zho': '马其顿',
      'kor': '마케도니아'
    }
  },
  'MG': {
    'currency': ['MGA'],
    'callingCode': ['261'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-mg',
    'name': {
      'eng': 'Madagascar',
      'fra': 'Madagascar',
      'ita': 'Madagascar',
      'jpn': 'マダガスカル',
      'por': 'Madagáscar',
      'rus': 'Мадагаскар',
      'spa': 'Madagascar',
      'zho': '马达加斯加',
      'kor': '마다가스카르'
    }
  },
  'MW': {
    'currency': ['MWK'],
    'callingCode': ['265'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-mw',
    'name': {
      'eng': 'Malawi',
      'fra': 'Malawi',
      'ita': 'Malawi',
      'jpn': 'マラウイ',
      'por': 'Malawi',
      'rus': 'Малави',
      'spa': 'Malawi',
      'zho': '马拉维',
      'kor': '말라위'
    }
  },
  'MY': {
    'currency': ['MYR'],
    'callingCode': ['60'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-my',
    'name': {
      'eng': 'Malaysia',
      'fra': 'Malaisie',
      'ita': 'Malesia',
      'jpn': 'マレーシア',
      'por': 'Malásia',
      'rus': 'Малайзия',
      'spa': 'Malasia',
      'zho': '马来西亚',
      'kor': '말레이시아'
    }
  },
  'MV': {
    'currency': ['MVR'],
    'callingCode': ['960'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-mv',
    'name': {
      'eng': 'Maldives',
      'fra': 'Maldives',
      'ita': 'Maldive',
      'jpn': 'モルディブ',
      'por': 'Maldivas',
      'spa': 'Maldivas',
      'rus': 'Мальдивы',
      'zho': '马尔代夫',
      'kor': '몰디브'
    }
  },
  'ML': {
    'currency': ['XOF'],
    'callingCode': ['223'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-ml',
    'name': {
      'eng': 'Mali',
      'fra': 'Mali',
      'ita': 'Mali',
      'jpn': 'マリ',
      'por': 'Mali',
      'rus': 'Мали',
      'spa': 'Mali',
      'zho': '马里',
      'kor': '말리'
    }
  },
  'MT': {
    'currency': ['EUR'],
    'callingCode': ['356'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-mt',
    'name': {
      'eng': 'Malta',
      'fra': 'Malte',
      'ita': 'Malta',
      'jpn': 'マルタ',
      'por': 'Malta',
      'rus': 'Мальта',
      'spa': 'Malta',
      'zho': '马耳他',
      'kor': '몰타'
    }
  },
  'MH': {
    'currency': ['USD'],
    'callingCode': ['692'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-mh',
    'name': {
      'eng': 'Marshall Islands',
      'fra': 'Îles Marshall',
      'ita': 'Isole Marshall',
      'jpn': 'マーシャル諸島',
      'por': 'Ilhas Marshall',
      'rus': 'Маршалловы Острова',
      'spa': 'Islas Marshall',
      'zho': '马绍尔群岛',
      'kor': '마셜 제도'
    }
  },
  'MQ': {
    'currency': ['EUR'],
    'callingCode': ['596'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-mq',
    'name': {
      'eng': 'Martinique',
      'fra': 'Martinique',
      'ita': 'Martinica',
      'jpn': 'マルティニーク',
      'por': 'Martinica',
      'rus': 'Мартиника',
      'spa': 'Martinica',
      'zho': '马提尼克',
      'kor': '마르티니크'
    }
  },
  'MR': {
    'currency': ['MRO'],
    'callingCode': ['222'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-mr',
    'name': {
      'eng': 'Mauritania',
      'fra': 'Mauritanie',
      'ita': 'Mauritania',
      'jpn': 'モーリタニア',
      'por': 'Mauritânia',
      'rus': 'Мавритания',
      'spa': 'Mauritania',
      'zho': '毛里塔尼亚',
      'kor': '모리타니'
    }
  },
  'MU': {
    'currency': ['MUR'],
    'callingCode': ['230'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-mu',
    'name': {
      'eng': 'Mauritius',
      'fra': 'Île Maurice',
      'ita': 'Mauritius',
      'jpn': 'モーリシャス',
      'por': 'Maurício',
      'rus': 'Маврикий',
      'spa': 'Mauricio',
      'zho': '毛里求斯',
      'kor': '모리셔스'
    }
  },
  'YT': {
    'currency': ['EUR'],
    'callingCode': ['262'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-yt',
    'name': {
      'eng': 'Mayotte',
      'fra': 'Mayotte',
      'ita': 'Mayotte',
      'jpn': 'マヨット',
      'por': 'Mayotte',
      'rus': 'Майотта',
      'spa': 'Mayotte',
      'zho': '马约特',
      'kor': '마요트'
    }
  },
  'MX': {
    'currency': ['MXN'],
    'callingCode': ['52'],
    'region': 'Americas',
    'subregion': 'North America',
    'flag': 'flag-mx',
    'name': {
      'eng': 'Mexico',
      'fra': 'Mexique',
      'ita': 'Messico',
      'jpn': 'メキシコ',
      'por': 'México',
      'rus': 'Мексика',
      'spa': 'México',
      'zho': '墨西哥',
      'kor': '멕시코'
    }
  },
  'FM': {
    'currency': ['USD'],
    'callingCode': ['691'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-fm',
    'name': {
      'eng': 'Micronesia',
      'fra': 'Micronésie',
      'ita': 'Micronesia',
      'jpn': 'ミクロネシア連邦',
      'por': 'Micronésia',
      'rus': 'Федеративные Штаты Микронезии',
      'spa': 'Micronesia',
      'zho': '密克罗尼西亚',
      'kor': '미크로네시아'
    }
  },
  'MD': {
    'currency': ['MDL'],
    'callingCode': ['373'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-md',
    'name': {
      'eng': 'Moldova',
      'fra': 'Moldavie',
      'ita': 'Moldavia',
      'jpn': 'モルドバ共和国',
      'por': 'Moldávia',
      'rus': 'Молдавия',
      'spa': 'Moldavia',
      'zho': '摩尔多瓦',
      'kor': '몰도바'
    }
  },
  'MC': {
    'currency': ['EUR'],
    'callingCode': ['377'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-mc',
    'name': {
      'eng': 'Monaco',
      'fra': 'Monaco',
      'ita': 'Principato di Monaco',
      'jpn': 'モナコ',
      'por': 'Mónaco',
      'rus': 'Монако',
      'spa': 'Mónaco',
      'zho': '摩纳哥',
      'kor': '모나코'
    }
  },
  'MN': {
    'currency': ['MNT'],
    'callingCode': ['976'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-mn',
    'name': {
      'eng': 'Mongolia',
      'fra': 'Mongolie',
      'ita': 'Mongolia',
      'jpn': 'モンゴル',
      'por': 'Mongólia',
      'rus': 'Монголия',
      'spa': 'Mongolia',
      'zho': '蒙古',
      'kor': '몽골국'
    }
  },
  'ME': {
    'currency': ['EUR'],
    'callingCode': ['382'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-me',
    'name': {
      'eng': 'Montenegro',
      'fra': 'Monténégro',
      'ita': 'Montenegro',
      'jpn': 'モンテネグロ',
      'por': 'Montenegro',
      'rus': 'Черногория',
      'spa': 'Montenegro',
      'zho': '黑山',
      'kor': '몬테네그로'
    }
  },
  'MS': {
    'currency': ['XCD'],
    'callingCode': ['1664'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-ms',
    'name': {
      'eng': 'Montserrat',
      'fra': 'Montserrat',
      'ita': 'Montserrat',
      'jpn': 'モントセラト',
      'por': 'Montserrat',
      'rus': 'Монтсеррат',
      'spa': 'Montserrat',
      'zho': '蒙特塞拉特',
      'kor': '몬트세랫'
    }
  },
  'MA': {
    'currency': ['MAD'],
    'callingCode': ['212'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-ma',
    'name': {
      'eng': 'Morocco',
      'fra': 'Maroc',
      'ita': 'Marocco',
      'jpn': 'モロッコ',
      'por': 'Marrocos',
      'rus': 'Марокко',
      'spa': 'Marruecos',
      'zho': '摩洛哥',
      'kor': '모로코'
    }
  },
  'MZ': {
    'currency': ['MZN'],
    'callingCode': ['258'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-mz',
    'name': {
      'eng': 'Mozambique',
      'fra': 'Mozambique',
      'ita': 'Mozambico',
      'jpn': 'モザンビーク',
      'por': 'Moçambique',
      'rus': 'Мозамбик',
      'spa': 'Mozambique',
      'zho': '莫桑比克',
      'kor': '모잠비크'
    }
  },
  'MM': {
    'currency': ['MMK'],
    'callingCode': ['95'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-mm',
    'name': {
      'eng': 'Myanmar',
      'fra': 'Birmanie',
      'ita': 'Birmania',
      'jpn': 'ミャンマー',
      'por': 'Myanmar',
      'rus': 'Мьянма',
      'spa': 'Myanmar',
      'zho': '缅甸',
      'kor': '미얀마'
    }
  },
  'NA': {
    'currency': ['NAD', 'ZAR'],
    'callingCode': ['264'],
    'region': 'Africa',
    'subregion': 'Southern Africa',
    'flag': 'flag-na',
    'name': {
      'eng': 'Namibia',
      'fra': 'Namibie',
      'ita': 'Namibia',
      'jpn': 'ナミビア',
      'por': 'Namíbia',
      'rus': 'Намибия',
      'spa': 'Namibia',
      'zho': '纳米比亚',
      'kor': '나미비아'
    }
  },
  'NR': {
    'currency': ['AUD'],
    'callingCode': ['674'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-nr',
    'name': {
      'eng': 'Nauru',
      'fra': 'Nauru',
      'ita': 'Nauru',
      'jpn': 'ナウル',
      'por': 'Nauru',
      'rus': 'Науру',
      'spa': 'Nauru',
      'zho': '瑙鲁',
      'kor': '나우루'
    }
  },
  'NP': {
    'currency': ['NPR'],
    'callingCode': ['977'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-np',
    'name': {
      'eng': 'Nepal',
      'fra': 'Népal',
      'ita': 'Nepal',
      'jpn': 'ネパール',
      'por': 'Nepal',
      'rus': 'Непал',
      'spa': 'Nepal',
      'zho': '尼泊尔',
      'kor': '네팔'
    }
  },
  'NL': {
    'currency': ['EUR'],
    'callingCode': ['31'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-nl',
    'name': {
      'eng': 'Netherlands',
      'fra': 'Pays-Bas',
      'ita': 'Paesi Bassi',
      'jpn': 'オランダ',
      'por': 'Holanda',
      'rus': 'Нидерланды',
      'spa': 'Países Bajos',
      'zho': '荷兰',
      'kor': '네덜란드'
    }
  },
  'NC': {
    'currency': ['XPF'],
    'callingCode': ['687'],
    'region': 'Oceania',
    'subregion': 'Melanesia',
    'flag': 'flag-nc',
    'name': {
      'eng': 'New Caledonia',
      'fra': 'Nouvelle-Calédonie',
      'ita': 'Nuova Caledonia',
      'jpn': 'ニューカレドニア',
      'por': 'Nova Caledónia',
      'rus': 'Новая Каледония',
      'spa': 'Nueva Caledonia',
      'zho': '新喀里多尼亚',
      'kor': '누벨칼레도니'
    }
  },
  'NZ': {
    'currency': ['NZD'],
    'callingCode': ['64'],
    'region': 'Oceania',
    'subregion': 'Australia and New Zealand',
    'flag': 'flag-nz',
    'name': {
      'eng': 'New Zealand',
      'fra': 'Nouvelle-Zélande',
      'ita': 'Nuova Zelanda',
      'jpn': 'ニュージーランド',
      'por': 'Nova Zelândia',
      'rus': 'Новая Зеландия',
      'spa': 'Nueva Zelanda',
      'zho': '新西兰',
      'kor': '뉴질랜드'
    }
  },
  'NI': {
    'currency': ['NIO'],
    'callingCode': ['505'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-ni',
    'name': {
      'eng': 'Nicaragua',
      'fra': 'Nicaragua',
      'ita': 'Nicaragua',
      'jpn': 'ニカラグア',
      'por': 'Nicarágua',
      'rus': 'Никарагуа',
      'spa': 'Nicaragua',
      'zho': '尼加拉瓜',
      'kor': '니카라과'
    }
  },
  'NE': {
    'currency': ['XOF'],
    'callingCode': ['227'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-ne',
    'name': {
      'eng': 'Niger',
      'fra': 'Niger',
      'ita': 'Niger',
      'jpn': 'ニジェール',
      'por': 'Níger',
      'rus': 'Нигер',
      'spa': 'Níger',
      'zho': '尼日尔',
      'kor': '니제르'
    }
  },
  'NG': {
    'currency': ['NGN'],
    'callingCode': ['234'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-ng',
    'name': {
      'eng': 'Nigeria',
      'fra': 'Nigéria',
      'ita': 'Nigeria',
      'jpn': 'ナイジェリア',
      'por': 'Nigéria',
      'rus': 'Нигерия',
      'spa': 'Nigeria',
      'zho': '尼日利亚',
      'kor': '나이지리아'
    }
  },
  'NU': {
    'currency': ['NZD'],
    'callingCode': ['683'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-nu',
    'name': {
      'eng': 'Niue',
      'fra': 'Niue',
      'ita': 'Niue',
      'jpn': 'ニウエ',
      'por': 'Niue',
      'rus': 'Ниуэ',
      'spa': 'Niue',
      'zho': '纽埃',
      'kor': '니우에'
    }
  },
  'NF': {
    'currency': ['AUD'],
    'callingCode': ['672'],
    'region': 'Oceania',
    'subregion': 'Australia and New Zealand',
    'flag': 'flag-nf',
    'name': {
      'eng': 'Norfolk Island',
      'fra': 'Île Norfolk',
      'ita': 'Isola Norfolk',
      'jpn': 'ノーフォーク島',
      'por': 'Ilha Norfolk',
      'rus': 'Норфолк',
      'spa': 'Isla de Norfolk',
      'zho': '诺福克岛',
      'kor': '노퍽 섬'
    }
  },
  'KP': {
    'currency': ['KPW'],
    'callingCode': ['850'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-kp',
    'name': {
      'eng': 'North Korea',
      'fra': 'Corée du Nord',
      'ita': 'Corea del Nord',
      'jpn': '朝鮮民主主義人民共和国',
      'por': 'Coreia do Norte',
      'rus': 'Северная Корея',
      'spa': 'Corea del Norte',
      'zho': '朝鲜',
      'kor': '조선'
    }
  },
  'MP': {
    'currency': ['USD'],
    'callingCode': ['1670'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-mp',
    'name': {
      'eng': 'Northern Mariana Islands',
      'fra': 'Îles Mariannes du Nord',
      'ita': 'Isole Marianne Settentrionali',
      'jpn': '北マリアナ諸島',
      'por': 'Marianas Setentrionais',
      'rus': 'Северные Марианские острова',
      'spa': 'Islas Marianas del Norte',
      'zho': '北马里亚纳群岛',
      'kor': '북마리아나 제도'
    }
  },
  'NO': {
    'currency': ['NOK'],
    'callingCode': ['47'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-no',
    'name': {
      'eng': 'Norway',
      'fra': 'Norvège',
      'ita': 'Norvegia',
      'jpn': 'ノルウェー',
      'por': 'Noruega',
      'rus': 'Норвегия',
      'spa': 'Noruega',
      'zho': '挪威',
      'kor': '노르웨이'
    }
  },
  'OM': {
    'currency': ['OMR'],
    'callingCode': ['968'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-om',
    'name': {
      'eng': 'Oman',
      'fra': 'Oman',
      'ita': 'oman',
      'jpn': 'オマーン',
      'por': 'Omã',
      'rus': 'Оман',
      'spa': 'Omán',
      'zho': '阿曼',
      'kor': '오만'
    }
  },
  'PK': {
    'currency': ['PKR'],
    'callingCode': ['92'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-pk',
    'name': {
      'eng': 'Pakistan',
      'fra': 'Pakistan',
      'ita': 'Pakistan',
      'jpn': 'パキスタン',
      'por': 'Paquistão',
      'rus': 'Пакистан',
      'spa': 'Pakistán',
      'zho': '巴基斯坦',
      'kor': '파키스탄'
    }
  },
  'PW': {
    'currency': ['USD'],
    'callingCode': ['680'],
    'region': 'Oceania',
    'subregion': 'Micronesia',
    'flag': 'flag-pw',
    'name': {
      'eng': 'Palau',
      'fra': 'Palaos (Palau)',
      'ita': 'Palau',
      'jpn': 'パラオ',
      'por': 'Palau',
      'rus': 'Палау',
      'spa': 'Palau',
      'zho': '帕劳',
      'kor': '팔라우'
    }
  },
  'PS': {
    'currency': ['ILS'],
    'callingCode': ['970'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-ps',
    'name': {
      'eng': 'Palestine',
      'fra': 'Palestine',
      'ita': 'Palestina',
      'jpn': 'パレスチナ',
      'por': 'Palestina',
      'rus': 'Палестина',
      'spa': 'Palestina',
      'zho': '巴勒斯坦',
      'kor': '팔레스타인'
    }
  },
  'PA': {
    'currency': ['PAB', 'USD'],
    'callingCode': ['507'],
    'region': 'Americas',
    'subregion': 'Central America',
    'flag': 'flag-pa',
    'name': {
      'eng': 'Panama',
      'fra': 'Panama',
      'ita': 'Panama',
      'jpn': 'パナマ',
      'por': 'Panamá',
      'rus': 'Панама',
      'spa': 'Panamá',
      'zho': '巴拿马',
      'kor': '파나마'
    }
  },
  'PG': {
    'currency': ['PGK'],
    'callingCode': ['675'],
    'region': 'Oceania',
    'subregion': 'Melanesia',
    'flag': 'flag-pg',
    'name': {
      'eng': 'Papua New Guinea',
      'fra': 'Papouasie-Nouvelle-Guinée',
      'ita': 'Papua Nuova Guinea',
      'jpn': 'パプアニューギニア',
      'por': 'Papua Nova Guiné',
      'rus': 'Папуа — Новая Гвинея',
      'spa': 'Papúa Nueva Guinea',
      'zho': '巴布亚新几内亚',
      'kor': '파푸아뉴기니'
    }
  },
  'PY': {
    'currency': ['PYG'],
    'callingCode': ['595'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-py',
    'name': {
      'eng': 'Paraguay',
      'fra': 'Paraguay',
      'ita': 'Paraguay',
      'jpn': 'パラグアイ',
      'por': 'Paraguai',
      'rus': 'Парагвай',
      'spa': 'Paraguay',
      'zho': '巴拉圭',
      'kor': '파라과이'
    }
  },
  'PE': {
    'currency': ['PEN'],
    'callingCode': ['51'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-pe',
    'name': {
      'eng': 'Peru',
      'fra': 'Pérou',
      'ita': 'Perù',
      'jpn': 'ペルー',
      'por': 'Perú',
      'rus': 'Перу',
      'spa': 'Perú',
      'zho': '秘鲁',
      'kor': '페루'
    }
  },
  'PH': {
    'currency': ['PHP'],
    'callingCode': ['63'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-ph',
    'name': {
      'eng': 'Philippines',
      'fra': 'Philippines',
      'ita': 'Filippine',
      'jpn': 'フィリピン',
      'por': 'Filipinas',
      'rus': 'Филиппины',
      'spa': 'Filipinas',
      'zho': '菲律宾',
      'kor': '필리핀'
    }
  },
  'PN': {
    'currency': ['NZD'],
    'callingCode': ['64'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-pn',
    'name': {
      'eng': 'Pitcairn Islands',
      'fra': 'Îles Pitcairn',
      'ita': 'Isole Pitcairn',
      'jpn': 'ピトケアン',
      'por': 'Ilhas Pitcairn',
      'rus': 'Острова Питкэрн',
      'spa': 'Islas Pitcairn',
      'zho': '皮特凯恩群岛',
      'kor': '핏케언 제도'
    }
  },
  'PL': {
    'currency': ['PLN'],
    'callingCode': ['48'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-pl',
    'name': {
      'eng': 'Poland',
      'fra': 'Pologne',
      'ita': 'Polonia',
      'jpn': 'ポーランド',
      'por': 'Polónia',
      'rus': 'Польша',
      'spa': 'Polonia',
      'zho': '波兰',
      'kor': '폴란드'
    }
  },
  'PT': {
    'currency': ['EUR'],
    'callingCode': ['351'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-pt',
    'name': {
      'eng': 'Portugal',
      'fra': 'Portugal',
      'ita': 'Portogallo',
      'jpn': 'ポルトガル',
      'por': 'Portugal',
      'rus': 'Португалия',
      'spa': 'Portugal',
      'zho': '葡萄牙',
      'kor': '포르투갈'
    }
  },
  'PR': {
    'currency': ['USD'],
    'callingCode': ['1787', '1939'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-pr',
    'name': {
      'eng': 'Puerto Rico',
      'fra': 'Porto Rico',
      'ita': 'Porto Rico',
      'jpn': 'プエルトリコ',
      'por': 'Porto Rico',
      'rus': 'Пуэрто-Рико',
      'spa': 'Puerto Rico',
      'zho': '波多黎各',
      'kor': '푸에르토리코'
    }
  },
  'QA': {
    'currency': ['QAR'],
    'callingCode': ['974'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-qa',
    'name': {
      'eng': 'Qatar',
      'fra': 'Qatar',
      'ita': 'Qatar',
      'jpn': 'カタール',
      'por': 'Catar',
      'rus': 'Катар',
      'spa': 'Catar',
      'zho': '卡塔尔',
      'kor': '카타르'
    }
  },
  'CG': {
    'currency': ['XAF'],
    'callingCode': ['242'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-cg',
    'name': {
      'eng': 'Republic of the Congo',
      'fra': 'Congo',
      'ita': 'Congo',
      'jpn': 'コンゴ共和国',
      'por': 'Congo',
      'rus': 'Республика Конго',
      'spa': 'Congo',
      'zho': '刚果',
      'kor': '콩고'
    }
  },
  'RO': {
    'currency': ['RON'],
    'callingCode': ['40'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-ro',
    'name': {
      'eng': 'Romania',
      'fra': 'Roumanie',
      'ita': 'Romania',
      'jpn': 'ルーマニア',
      'por': 'Roménia',
      'rus': 'Румыния',
      'spa': 'Rumania',
      'zho': '罗马尼亚',
      'kor': '루마니아'
    }
  },
  'RU': {
    'currency': ['RUB'],
    'callingCode': ['7'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-ru',
    'name': {
      'eng': 'Russia',
      'fra': 'Russie',
      'ita': 'Russia',
      'jpn': 'ロシア連邦',
      'por': 'Rússia',
      'rus': 'Россия',
      'spa': 'Rusia',
      'zho': '俄罗斯',
      'kor': '러시아'
    }
  },
  'RW': {
    'currency': ['RWF'],
    'callingCode': ['250'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-rw',
    'name': {
      'eng': 'Rwanda',
      'fra': 'Rwanda',
      'ita': 'Ruanda',
      'jpn': 'ルワンダ',
      'por': 'Ruanda',
      'rus': 'Руанда',
      'spa': 'Ruanda',
      'zho': '卢旺达',
      'kor': '르완다'
    }
  },
  'RE': {
    'currency': ['EUR'],
    'callingCode': ['262'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-re',
    'name': {
      'eng': 'Réunion',
      'fra': 'Réunion',
      'ita': 'Riunione',
      'jpn': 'レユニオン',
      'por': 'Reunião',
      'rus': 'Реюньон',
      'spa': 'Reunión',
      'zho': '留尼旺岛',
      'kor': '레위니옹'
    }
  },
  'BL': {
    'currency': ['EUR'],
    'callingCode': ['590'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-bl',
    'name': {
      'eng': 'Saint Barthélemy',
      'fra': 'Saint-Barthélemy',
      'ita': 'Antille Francesi',
      'jpn': 'サン・バルテルミー',
      'por': 'São Bartolomeu',
      'rus': 'Сен-Бартелеми',
      'spa': 'San Bartolomé',
      'zho': '圣巴泰勒米',
      'kor': '생바르텔레미'
    }
  },
  'SH': {
    'currency': ['SHP', 'GBP'],
    'callingCode': ['290', '247'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-sh',
    'name': {
      'eng': 'Saint Helena, Ascension and Tristan da Cunha',
      'fra': 'Sainte-Hélène, Ascension et Tristan da Cunha',
      'ita': 'Sant’Elena, Ascensione e Tristan da Cunha',
      'jpn': 'セントヘレナ・アセンションおよびトリスタンダクーニャ',
      'por': 'Santa Helena, Ascensão e Tristão da Cunha',
      'rus': 'Острова Святой Елены, Вознесения и Тристан-да-Кунья',
      'spa': 'Santa Elena, Ascensión y Tristán de Acuña',
      'zho': '圣赫勒拿、阿森松和特里斯坦-达库尼亚',
      'kor': '세인트헬레나'
    }
  },
  'KN': {
    'currency': ['XCD'],
    'callingCode': ['1869'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-kn',
    'name': {
      'eng': 'Saint Kitts and Nevis',
      'fra': 'Saint-Christophe-et-Niévès',
      'ita': 'Saint Kitts e Nevis',
      'jpn': 'セントクリストファー・ネイビス',
      'por': 'São Cristóvão e Nevis',
      'rus': 'Сент-Китс и Невис',
      'spa': 'San Cristóbal y Nieves',
      'zho': '圣基茨和尼维斯',
      'kor': '세인트키츠 네비스'
    }
  },
  'LC': {
    'currency': ['XCD'],
    'callingCode': ['1758'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-lc',
    'name': {
      'eng': 'Saint Lucia',
      'fra': 'Sainte-Lucie',
      'ita': 'Santa Lucia',
      'jpn': 'セントルシア',
      'por': 'Santa Lúcia',
      'rus': 'Сент-Люсия',
      'spa': 'Santa Lucía',
      'zho': '圣卢西亚',
      'kor': '세인트루시아'
    }
  },
  'MF': {
    'currency': ['EUR'],
    'callingCode': ['590'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-mf',
    'name': {
      'eng': 'Saint Martin',
      'fra': 'Saint-Martin',
      'ita': 'Saint Martin',
      'jpn': 'サン・マルタン（フランス領）',
      'por': 'São Martinho',
      'rus': 'Сен-Мартен',
      'spa': 'Saint Martin',
      'zho': '圣马丁',
      'kor': '생마르탱'
    }
  },
  'PM': {
    'currency': ['EUR'],
    'callingCode': ['508'],
    'region': 'Americas',
    'subregion': 'North America',
    'flag': 'flag-pm',
    'name': {
      'eng': 'Saint Pierre and Miquelon',
      'fra': 'Saint-Pierre-et-Miquelon',
      'ita': 'Saint-Pierre e Miquelon',
      'jpn': 'サンピエール島・ミクロン島',
      'por': 'Saint-Pierre e Miquelon',
      'rus': 'Сен-Пьер и Микелон',
      'spa': 'San Pedro y Miquelón',
      'zho': '圣皮埃尔和密克隆',
      'kor': '생피에르 미클롱'
    }
  },
  'VC': {
    'currency': ['XCD'],
    'callingCode': ['1784'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-vc',
    'name': {
      'eng': 'Saint Vincent and the Grenadines',
      'fra': 'Saint-Vincent-et-les-Grenadines',
      'ita': 'Saint Vincent e Grenadine',
      'jpn': 'セントビンセントおよびグレナディーン諸島',
      'por': 'São Vincente e Granadinas',
      'rus': 'Сент-Винсент и Гренадины',
      'spa': 'San Vicente y Granadinas',
      'zho': '圣文森特和格林纳丁斯',
      'kor': '세인트빈센트 그레나딘'
    }
  },
  'WS': {
    'currency': ['WST'],
    'callingCode': ['685'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-ws',
    'name': {
      'eng': 'Samoa',
      'fra': 'Samoa',
      'ita': 'Samoa',
      'jpn': 'サモア',
      'por': 'Samoa',
      'rus': 'Самоа',
      'spa': 'Samoa',
      'zho': '萨摩亚',
      'kor': '사모아'
    }
  },
  'SM': {
    'currency': ['EUR'],
    'callingCode': ['378'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-sm',
    'name': {
      'eng': 'San Marino',
      'fra': 'Saint-Marin',
      'ita': 'San Marino',
      'jpn': 'サンマリノ',
      'por': 'San Marino',
      'rus': 'Сан-Марино',
      'spa': 'San Marino',
      'zho': '圣马力诺',
      'kor': '산마리노'
    }
  },
  'SA': {
    'currency': ['SAR'],
    'callingCode': ['966'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-sa',
    'name': {
      'eng': 'Saudi Arabia',
      'fra': 'Arabie Saoudite',
      'ita': 'Arabia Saudita',
      'jpn': 'サウジアラビア',
      'por': 'Arábia Saudita',
      'rus': 'Саудовская Аравия',
      'spa': 'Arabia Saudí',
      'zho': '沙特阿拉伯',
      'kor': '사우디아라비아'
    }
  },
  'SN': {
    'currency': ['XOF'],
    'callingCode': ['221'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-sn',
    'name': {
      'eng': 'Senegal',
      'fra': 'Sénégal',
      'ita': 'Senegal',
      'jpn': 'セネガル',
      'por': 'Senegal',
      'rus': 'Сенегал',
      'spa': 'Senegal',
      'zho': '塞内加尔',
      'kor': '세네갈'
    }
  },
  'RS': {
    'currency': ['RSD'],
    'callingCode': ['381'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-rs',
    'name': {
      'eng': 'Serbia',
      'fra': 'Serbie',
      'ita': 'Serbia',
      'jpn': 'セルビア',
      'por': 'Sérvia',
      'rus': 'Сербия',
      'spa': 'Serbia',
      'zho': '塞尔维亚',
      'kor': '세르비아'
    }
  },
  'SC': {
    'currency': ['SCR'],
    'callingCode': ['248'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-sc',
    'name': {
      'eng': 'Seychelles',
      'fra': 'Seychelles',
      'ita': 'Seychelles',
      'jpn': 'セーシェル',
      'por': 'Seicheles',
      'rus': 'Сейшельские Острова',
      'spa': 'Seychelles',
      'zho': '塞舌尔',
      'kor': '세이셸'
    }
  },
  'SL': {
    'currency': ['SLL'],
    'callingCode': ['232'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-sl',
    'name': {
      'eng': 'Sierra Leone',
      'fra': 'Sierra Leone',
      'ita': 'Sierra Leone',
      'jpn': 'シエラレオネ',
      'por': 'Serra Leoa',
      'rus': 'Сьерра-Леоне',
      'spa': 'Sierra Leone',
      'zho': '塞拉利昂',
      'kor': '시에라리온'
    }
  },
  'SG': {
    'currency': ['SGD'],
    'callingCode': ['65'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-sg',
    'name': {
      'eng': 'Singapore',
      'fra': 'Singapour',
      'ita': 'Singapore',
      'jpn': 'シンガポール',
      'por': 'Singapura',
      'rus': 'Сингапур',
      'spa': 'Singapur',
      'kor': '싱가포르'
    }
  },
  'SX': {
    'currency': ['ANG'],
    'callingCode': ['1721'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-sx',
    'name': {
      'eng': 'Sint Maarten',
      'fra': 'Saint-Martin',
      'ita': 'Sint Maarten',
      'jpn': 'シント・マールテン',
      'por': 'São Martinho',
      'rus': 'Синт-Мартен',
      'spa': 'Sint Maarten',
      'zho': '圣马丁岛',
      'kor': '신트마르턴'
    }
  },
  'SK': {
    'currency': ['EUR'],
    'callingCode': ['421'],
    'region': 'Europe',
    'subregion': 'Central Europe',
    'flag': 'flag-sk',
    'name': {
      'eng': 'Slovakia',
      'fra': 'Slovaquie',
      'ita': 'Slovacchia',
      'jpn': 'スロバキア',
      'por': 'Eslováquia',
      'rus': 'Словакия',
      'spa': 'República Eslovaca',
      'zho': '斯洛伐克',
      'kor': '슬로바키아'
    }
  },
  'SI': {
    'currency': ['EUR'],
    'callingCode': ['386'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-si',
    'name': {
      'eng': 'Slovenia',
      'fra': 'Slovénie',
      'ita': 'Slovenia',
      'jpn': 'スロベニア',
      'por': 'Eslovénia',
      'rus': 'Словения',
      'spa': 'Eslovenia',
      'zho': '斯洛文尼亚',
      'kor': '슬로베니아'
    }
  },
  'SB': {
    'currency': ['SBD'],
    'callingCode': ['677'],
    'region': 'Oceania',
    'subregion': 'Melanesia',
    'flag': 'flag-sb',
    'name': {
      'eng': 'Solomon Islands',
      'fra': 'Îles Salomon',
      'ita': 'Isole Salomone',
      'jpn': 'ソロモン諸島',
      'por': 'Ilhas Salomão',
      'rus': 'Соломоновы Острова',
      'spa': 'Islas Salomón',
      'zho': '所罗门群岛',
      'kor': '솔로몬 제도'
    }
  },
  'SO': {
    'currency': ['SOS'],
    'callingCode': ['252'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-so',
    'name': {
      'eng': 'Somalia',
      'fra': 'Somalie',
      'ita': 'Somalia',
      'jpn': 'ソマリア',
      'por': 'Somália',
      'rus': 'Сомали',
      'spa': 'Somalia',
      'zho': '索马里',
      'kor': '소말리아'
    }
  },
  'ZA': {
    'currency': ['ZAR'],
    'callingCode': ['27'],
    'region': 'Africa',
    'subregion': 'Southern Africa',
    'flag': 'flag-za',
    'name': {
      'eng': 'South Africa',
      'fra': 'Afrique du Sud',
      'ita': 'Sud Africa',
      'jpn': '南アフリカ',
      'por': 'África do Sul',
      'rus': 'Южно-Африканская Республика',
      'spa': 'República de Sudáfrica',
      'zho': '南非',
      'kor': '남아프리카'
    }
  },
  'GS': {
    'currency': ['GBP'],
    'callingCode': ['500'],
    'region': 'Antarctic',
    'subregion': '',
    'flag': 'flag-gs',
    'name': {
      'eng': 'South Georgia',
      'fra': 'Géorgie du Sud-et-les Îles Sandwich du Sud',
      'ita': 'Georgia del Sud e Isole Sandwich Meridionali',
      'jpn': 'サウスジョージア・サウスサンドウィッチ諸島',
      'por': 'Ilhas Geórgia do Sul e Sandwich do Sul',
      'rus': 'Южная Георгия и Южные Сандвичевы острова',
      'spa': 'Islas Georgias del Sur y Sandwich del Sur',
      'zho': '南乔治亚',
      'kor': '조지아'
    }
  },
  'KR': {
    'currency': ['KRW'],
    'callingCode': ['82'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-kr',
    'name': {
      'eng': 'South Korea',
      'fra': 'Corée du Sud',
      'ita': 'Corea del Sud',
      'jpn': '韓国',
      'por': 'Coreia do Sul',
      'rus': 'Южная Корея',
      'spa': 'Corea del Sur',
      'zho': '韩国',
      'kor': '한국'
    }
  },
  'SS': {
    'currency': ['SSP'],
    'callingCode': ['211'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-ss',
    'name': {
      'eng': 'South Sudan',
      'fra': 'Soudan du Sud',
      'ita': 'Sudan del sud',
      'jpn': '南スーダン',
      'por': 'Sudão do Sul',
      'rus': 'Южный Судан',
      'spa': 'Sudán del Sur',
      'zho': '南苏丹',
      'kor': '남수단'
    }
  },
  'ES': {
    'currency': ['EUR'],
    'callingCode': ['34'],
    'region': 'Europe',
    'subregion': 'Southern Europe',
    'flag': 'flag-es',
    'name': {
      'eng': 'Spain',
      'fra': 'Espagne',
      'ita': 'Spagna',
      'jpn': 'スペイン',
      'por': 'Espanha',
      'rus': 'Испания',
      'spa': 'España',
      'zho': '西班牙',
      'kor': '스페인'
    }
  },
  'LK': {
    'currency': ['LKR'],
    'callingCode': ['94'],
    'region': 'Asia',
    'subregion': 'Southern Asia',
    'flag': 'flag-lk',
    'name': {
      'eng': 'Sri Lanka',
      'fra': 'Sri Lanka',
      'ita': 'Sri Lanka',
      'jpn': 'スリランカ',
      'por': 'Sri Lanka',
      'rus': 'Шри-Ланка',
      'spa': 'Sri Lanka',
      'zho': '斯里兰卡',
      'kor': '스리랑카'
    }
  },
  'SD': {
    'currency': ['SDG'],
    'callingCode': ['249'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-sd',
    'name': {
      'eng': 'Sudan',
      'fra': 'Soudan',
      'ita': 'Sudan',
      'jpn': 'スーダン',
      'por': 'Sudão',
      'rus': 'Судан',
      'spa': 'Sudán',
      'zho': '苏丹',
      'kor': '수단'
    }
  },
  'SR': {
    'currency': ['SRD'],
    'callingCode': ['597'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-sr',
    'name': {
      'eng': 'Suriname',
      'fra': 'Surinam',
      'ita': 'Suriname',
      'jpn': 'スリナム',
      'por': 'Suriname',
      'rus': 'Суринам',
      'spa': 'Surinam',
      'zho': '苏里南',
      'kor': '수리남'
    }
  },
  'SJ': {
    'currency': ['NOK'],
    'callingCode': ['4779'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-sj',
    'name': {
      'eng': 'Svalbard and Jan Mayen',
      'fra': 'Svalbard et Jan Mayen',
      'ita': 'Svalbard e Jan Mayen',
      'jpn': 'スヴァールバル諸島およびヤンマイエン島',
      'por': 'Ilhas Svalbard e Jan Mayen',
      'rus': 'Шпицберген и Ян-Майен',
      'spa': 'Islas Svalbard y Jan Mayen',
      'zho': '斯瓦尔巴特',
      'kor': '스발바르 얀마옌 제도'
    }
  },
  'SE': {
    'currency': ['SEK'],
    'callingCode': ['46'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-se',
    'name': {
      'eng': 'Sweden',
      'fra': 'Suède',
      'ita': 'Svezia',
      'jpn': 'スウェーデン',
      'por': 'Suécia',
      'rus': 'Швеция',
      'spa': 'Suecia',
      'zho': '瑞典',
      'kor': '스웨덴'
    }
  },
  'CH': {
    'currency': ['CHF'],
    'callingCode': ['41'],
    'region': 'Europe',
    'subregion': 'Western Europe',
    'flag': 'flag-ch',
    'name': {
      'eng': 'Switzerland',
      'fra': 'Suisse',
      'ita': 'Svizzera',
      'jpn': 'スイス',
      'por': 'Suíça',
      'rus': 'Швейцария',
      'spa': 'Suiza',
      'zho': '瑞士',
      'kor': '스위스'
    }
  },
  'SY': {
    'currency': ['SYP'],
    'callingCode': ['963'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-sy',
    'name': {
      'eng': 'Syria',
      'fra': 'Syrie',
      'ita': 'Siria',
      'jpn': 'シリア・アラブ共和国',
      'por': 'Síria',
      'rus': 'Сирия',
      'spa': 'Siria',
      'zho': '叙利亚',
      'kor': '시리아'
    }
  },
  'ST': {
    'currency': ['STD'],
    'callingCode': ['239'],
    'region': 'Africa',
    'subregion': 'Middle Africa',
    'flag': 'flag-st',
    'name': {
      'eng': 'São Tomé and Príncipe',
      'fra': 'São Tomé et Príncipe',
      'ita': 'São Tomé e Príncipe',
      'jpn': 'サントメ・プリンシペ',
      'por': 'São Tomé e Príncipe',
      'spa': 'Santo Tomé y Príncipe',
      'rus': 'Сан-Томе и Принсипи',
      'zho': '圣多美和普林西比',
      'kor': '상투메 프린시페'
    }
  },
  'TW': {
    'currency': ['TWD'],
    'callingCode': ['886'],
    'region': 'Asia',
    'subregion': 'Eastern Asia',
    'flag': 'flag-tw',
    'name': {
      'eng': 'Taiwan',
      'fra': 'Taïwan',
      'ita': 'Taiwan',
      'jpn': '台湾',
      'por': 'Ilha Formosa',
      'rus': 'Тайвань',
      'spa': 'Taiwán',
      'kor': '대만'
    }
  },
  'TJ': {
    'currency': ['TJS'],
    'callingCode': ['992'],
    'region': 'Asia',
    'subregion': 'Central Asia',
    'flag': 'flag-tj',
    'name': {
      'eng': 'Tajikistan',
      'fra': 'Tadjikistan',
      'ita': 'Tagikistan',
      'jpn': 'タジキスタン',
      'por': 'Tajiquistão',
      'rus': 'Таджикистан',
      'spa': 'Tayikistán',
      'zho': '塔吉克斯坦',
      'kor': '타지키스탄'
    }
  },
  'TZ': {
    'currency': ['TZS'],
    'callingCode': ['255'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-tz',
    'name': {
      'eng': 'Tanzania',
      'fra': 'Tanzanie',
      'ita': 'Tanzania',
      'jpn': 'タンザニア',
      'por': 'Tanzânia',
      'rus': 'Танзания',
      'spa': 'Tanzania',
      'zho': '坦桑尼亚',
      'kor': '탄자니아'
    }
  },
  'TH': {
    'currency': ['THB'],
    'callingCode': ['66'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-th',
    'name': {
      'eng': 'Thailand',
      'fra': 'Thaïlande',
      'ita': 'Tailandia',
      'jpn': 'タイ',
      'por': 'Tailândia',
      'rus': 'Таиланд',
      'spa': 'Tailandia',
      'zho': '泰国',
      'kor': '태국'
    }
  },
  'TL': {
    'currency': ['USD'],
    'callingCode': ['670'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-tl',
    'name': {
      'eng': 'Timor-Leste',
      'fra': 'Timor oriental',
      'ita': 'Timor Est',
      'jpn': '東ティモール',
      'por': 'Timor-Leste',
      'rus': 'Восточный Тимор',
      'spa': 'Timor Oriental',
      'zho': '东帝汶',
      'kor': '동티모르'
    }
  },
  'TG': {
    'currency': ['XOF'],
    'callingCode': ['228'],
    'region': 'Africa',
    'subregion': 'Western Africa',
    'flag': 'flag-tg',
    'name': {
      'eng': 'Togo',
      'fra': 'Togo',
      'ita': 'Togo',
      'jpn': 'トーゴ',
      'por': 'Togo',
      'rus': 'Того',
      'spa': 'Togo',
      'zho': '多哥',
      'kor': '토고'
    }
  },
  'TK': {
    'currency': ['NZD'],
    'callingCode': ['690'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-tk',
    'name': {
      'eng': 'Tokelau',
      'fra': 'Tokelau',
      'ita': 'Isole Tokelau',
      'jpn': 'トケラウ',
      'por': 'Tokelau',
      'rus': 'Токелау',
      'spa': 'Islas Tokelau',
      'zho': '托克劳',
      'kor': '토켈라우'
    }
  },
  'TO': {
    'currency': ['TOP'],
    'callingCode': ['676'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-to',
    'name': {
      'eng': 'Tonga',
      'fra': 'Tonga',
      'ita': 'Tonga',
      'jpn': 'トンガ',
      'por': 'Tonga',
      'rus': 'Тонга',
      'spa': 'Tonga',
      'zho': '汤加',
      'kor': '통가'
    }
  },
  'TT': {
    'currency': ['TTD'],
    'callingCode': ['1868'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-tt',
    'name': {
      'eng': 'Trinidad and Tobago',
      'fra': 'Trinité-et-Tobago',
      'ita': 'Trinidad e Tobago',
      'jpn': 'トリニダード・トバゴ',
      'por': 'Trinidade e Tobago',
      'rus': 'Тринидад и Тобаго',
      'spa': 'Trinidad y Tobago',
      'zho': '特立尼达和多巴哥',
      'kor': '트리니다드 토바고'
    }
  },
  'TN': {
    'currency': ['TND'],
    'callingCode': ['216'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-tn',
    'name': {
      'eng': 'Tunisia',
      'fra': 'Tunisie',
      'ita': 'Tunisia',
      'jpn': 'チュニジア',
      'por': 'Tunísia',
      'rus': 'Тунис',
      'spa': 'Túnez',
      'zho': '突尼斯',
      'kor': '튀니지'
    }
  },
  'TR': {
    'currency': ['TRY'],
    'callingCode': ['90'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-tr',
    'name': {
      'eng': 'Turkey',
      'fra': 'Turquie',
      'ita': 'Turchia',
      'jpn': 'トルコ',
      'por': 'Turquia',
      'rus': 'Турция',
      'spa': 'Turquía',
      'zho': '土耳其',
      'kor': '터키'
    }
  },
  'TM': {
    'currency': ['TMT'],
    'callingCode': ['993'],
    'region': 'Asia',
    'subregion': 'Central Asia',
    'flag': 'flag-tm',
    'name': {
      'eng': 'Turkmenistan',
      'fra': 'Turkménistan',
      'ita': 'Turkmenistan',
      'jpn': 'トルクメニスタン',
      'por': 'Turquemenistão',
      'rus': 'Туркмения',
      'spa': 'Turkmenistán',
      'zho': '土库曼斯坦',
      'kor': '투르크메니스탄'
    }
  },
  'TC': {
    'currency': ['USD'],
    'callingCode': ['1649'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-tc',
    'name': {
      'eng': 'Turks and Caicos Islands',
      'fra': 'Îles Turques-et-Caïques',
      'ita': 'Isole Turks e Caicos',
      'jpn': 'タークス・カイコス諸島',
      'por': 'Ilhas Turks e Caicos',
      'rus': 'Теркс и Кайкос',
      'spa': 'Islas Turks y Caicos',
      'zho': '特克斯和凯科斯群岛',
      'kor': '터크스 케이커스 제도'
    }
  },
  'TV': {
    'currency': ['AUD'],
    'callingCode': ['688'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-tv',
    'name': {
      'eng': 'Tuvalu',
      'fra': 'Tuvalu',
      'ita': 'Tuvalu',
      'jpn': 'ツバル',
      'por': 'Tuvalu',
      'rus': 'Тувалу',
      'spa': 'Tuvalu',
      'zho': '图瓦卢',
      'kor': '투발루'
    }
  },
  'UG': {
    'currency': ['UGX'],
    'callingCode': ['256'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-ug',
    'name': {
      'eng': 'Uganda',
      'fra': 'Ouganda',
      'ita': 'Uganda',
      'jpn': 'ウガンダ',
      'por': 'Uganda',
      'rus': 'Уганда',
      'spa': 'Uganda',
      'zho': '乌干达',
      'kor': '우간다'
    }
  },
  'UA': {
    'currency': ['UAH'],
    'callingCode': ['380'],
    'region': 'Europe',
    'subregion': 'Eastern Europe',
    'flag': 'flag-ua',
    'name': {
      'eng': 'Ukraine',
      'fra': 'Ukraine',
      'ita': 'Ucraina',
      'jpn': 'ウクライナ',
      'por': 'Ucrânia',
      'rus': 'Украина',
      'spa': 'Ucrania',
      'zho': '乌克兰',
      'kor': '우크라이나'
    }
  },
  'AE': {
    'currency': ['AED'],
    'callingCode': ['971'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-ae',
    'name': {
      'eng': 'United Arab Emirates',
      'fra': 'Émirats arabes unis',
      'ita': 'Emirati Arabi Uniti',
      'jpn': 'アラブ首長国連邦',
      'por': 'Emirados Árabes Unidos',
      'rus': 'Объединённые Арабские Эмираты',
      'spa': 'Emiratos Árabes Unidos',
      'zho': '阿拉伯联合酋长国',
      'kor': '아랍에미리트'
    }
  },
  'GB': {
    'currency': ['GBP'],
    'callingCode': ['44'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-gb',
    'name': {
      'eng': 'United Kingdom',
      'fra': 'Royaume-Uni',
      'ita': 'Regno Unito',
      'jpn': 'イギリス',
      'por': 'Reino Unido',
      'rus': 'Великобритания',
      'spa': 'Reino Unido',
      'zho': '英国',
      'kor': '영국'
    }
  },
  // 'US': {
  //   'currency': ['USD'],
  //   'callingCode': ['1'],
  //   'region': 'Americas',
  //   'subregion': 'North America',
  //   'flag': 'flag-us',
  //   'name': {
  //     'eng': 'United States',
  //     'fra': 'États-Unis',
  //     'ita': 'Stati Uniti d’America',
  //     'jpn': 'アメリカ合衆国',
  //     'por': 'Estados Unidos',
  //     'rus': 'Соединённые Штаты Америки',
  //     'spa': 'Estados Unidos',
  //     'zho': '美国',
  //     'kor': '미국'
  //   }
  // },
  'VI': {
    'currency': ['USD'],
    'callingCode': ['1340'],
    'region': 'Americas',
    'subregion': 'Caribbean',
    'flag': 'flag-vi',
    'name': {
      'eng': 'United States Virgin Islands',
      'fra': 'Îles Vierges des États-Unis',
      'ita': 'Isole Vergini Americane',
      'jpn': 'アメリカ領ヴァージン諸島',
      'por': 'Ilhas Virgens dos Estados Unidos',
      'rus': 'Виргинские Острова',
      'spa': 'Islas Vírgenes de los Estados Unidos',
      'zho': '美属维尔京群岛',
      'kor': '미국령 버진아일랜드'
    }
  },
  'UY': {
    'currency': ['UYU'],
    'callingCode': ['598'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-uy',
    'name': {
      'eng': 'Uruguay',
      'fra': 'Uruguay',
      'ita': 'Uruguay',
      'jpn': 'ウルグアイ',
      'por': 'Uruguai',
      'rus': 'Уругвай',
      'spa': 'Uruguay',
      'zho': '乌拉圭',
      'kor': '우루과이'
    }
  },
  'UZ': {
    'currency': ['UZS'],
    'callingCode': ['998'],
    'region': 'Asia',
    'subregion': 'Central Asia',
    'flag': 'flag-uz',
    'name': {
      'eng': 'Uzbekistan',
      'fra': 'Ouzbékistan',
      'ita': 'Uzbekistan',
      'jpn': 'ウズベキスタン',
      'por': 'Uzbequistão',
      'rus': 'Узбекистан',
      'spa': 'Uzbekistán',
      'zho': '乌兹别克斯坦',
      'kor': '우즈베키스탄'
    }
  },
  'VU': {
    'currency': ['VUV'],
    'callingCode': ['678'],
    'region': 'Oceania',
    'subregion': 'Melanesia',
    'flag': 'flag-vu',
    'name': {
      'eng': 'Vanuatu',
      'fra': 'Vanuatu',
      'ita': 'Vanuatu',
      'jpn': 'バヌアツ',
      'por': 'Vanuatu',
      'rus': 'Вануату',
      'spa': 'Vanuatu',
      'zho': '瓦努阿图',
      'kor': '바누아투'
    }
  },
  // 'VA': {
  //   'currency': ['EUR'],
  //   'callingCode': ['3906698', '379'],
  //   'region': 'Europe',
  //   'subregion': 'Southern Europe',
  //   'flag': 'flag-va',
  //   'name': {
  //     'eng': 'Vatican City',
  //     'fra': 'Cité du Vatican',
  //     'ita': 'Città del Vaticano',
  //     'jpn': 'バチカン市国',
  //     'por': 'Cidade do Vaticano',
  //     'rus': 'Ватикан',
  //     'spa': 'Ciudad del Vaticano',
  //     'zho': '梵蒂冈',
  //     'kor': '바티칸'
  //   }
  // },
  'VE': {
    'currency': ['VEF'],
    'callingCode': ['58'],
    'region': 'Americas',
    'subregion': 'South America',
    'flag': 'flag-ve',
    'name': {
      'eng': 'Venezuela',
      'fra': 'Venezuela',
      'ita': 'Venezuela',
      'jpn': 'ベネズエラ・ボリバル共和国',
      'por': 'Venezuela',
      'rus': 'Венесуэла',
      'spa': 'Venezuela',
      'zho': '委内瑞拉',
      'kor': '베네수엘라'
    }
  },
  'VN': {
    'currency': ['VND'],
    'callingCode': ['84'],
    'region': 'Asia',
    'subregion': 'South-Eastern Asia',
    'flag': 'flag-vn',
    'name': {
      'eng': 'Vietnam',
      'fra': 'Viêt Nam',
      'ita': 'Vietnam',
      'jpn': 'ベトナム',
      'por': 'Vietname',
      'rus': 'Вьетнам',
      'spa': 'Vietnam',
      'zho': '越南',
      'kor': '베트남'
    }
  },
  'WF': {
    'currency': ['XPF'],
    'callingCode': ['681'],
    'region': 'Oceania',
    'subregion': 'Polynesia',
    'flag': 'flag-wf',
    'name': {
      'eng': 'Wallis and Futuna',
      'fra': 'Wallis-et-Futuna',
      'ita': 'Wallis e Futuna',
      'jpn': 'ウォリス・フツナ',
      'por': 'Wallis e Futuna',
      'rus': 'Уоллис и Футуна',
      'spa': 'Wallis y Futuna',
      'zho': '瓦利斯和富图纳群岛',
      'kor': ''
    }
  },
  'EH': {
    'currency': ['MAD', 'DZD', 'MRO'],
    'callingCode': ['212'],
    'region': 'Africa',
    'subregion': 'Northern Africa',
    'flag': 'flag-eh',
    'name': {
      'eng': 'Western Sahara',
      'fra': 'Sahara Occidental',
      'ita': 'Sahara Occidentale',
      'jpn': '西サハラ',
      'por': 'Saara Ocidental',
      'rus': 'Западная Сахара',
      'spa': 'Sahara Occidental',
      'zho': '西撒哈拉',
      'kor': '서사하라'
    }
  },
  'YE': {
    'currency': ['YER'],
    'callingCode': ['967'],
    'region': 'Asia',
    'subregion': 'Western Asia',
    'flag': 'flag-ye',
    'name': {
      'eng': 'Yemen',
      'fra': 'Yémen',
      'ita': 'Yemen',
      'jpn': 'イエメン',
      'por': 'Iémen',
      'rus': 'Йемен',
      'spa': 'Yemen',
      'zho': '也门',
      'kor': '예멘'
    }
  },
  'ZM': {
    'currency': ['ZMW'],
    'callingCode': ['260'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-zm',
    'name': {
      'eng': 'Zambia',
      'fra': 'Zambie',
      'ita': 'Zambia',
      'jpn': 'ザンビア',
      'por': 'Zâmbia',
      'rus': 'Замбия',
      'spa': 'Zambia',
      'zho': '赞比亚',
      'kor': '잠비아'
    }
  },
  'ZW': {
    'currency': ['ZWL'],
    'callingCode': ['263'],
    'region': 'Africa',
    'subregion': 'Eastern Africa',
    'flag': 'flag-zw',
    'name': {
      'eng': 'Zimbabwe',
      'fra': 'Zimbabwe',
      'ita': 'Zimbabwe',
      'jpn': 'ジンバブエ',
      'por': 'Zimbabwe',
      'rus': 'Зимбабве',
      'spa': 'Zimbabue',
      'zho': '津巴布韦',
      'kor': '짐바브웨'
    }
  },
  'AX': {
    'currency': ['EUR'],
    'callingCode': ['358'],
    'region': 'Europe',
    'subregion': 'Northern Europe',
    'flag': 'flag-ax',
    'name': {
      'eng': 'Åland Islands',
      'fra': 'Ahvenanmaa',
      'ita': 'Isole Aland',
      'jpn': 'オーランド諸島',
      'por': 'Alândia',
      'rus': 'Аландские острова',
      'spa': 'Alandia',
      'zho': '奥兰群岛',
      'kor': '올란드 제도'
    }
  }
}
