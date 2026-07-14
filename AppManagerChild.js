import React, {useRef, useState, useEffect} from 'react';
import {
  Linking,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import {Link} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Clipboard from '@react-native-clipboard/clipboard';

export default function AppManagerChild({navigation, route}) {
  const linkRefresh = route.params.data;
  const userAgent = route.params.userAgent;
  const webViewRef = useRef(null);

  // В source WebView допустимы только http(s)-ссылки. Любая другая схема
  // (mailto:, tel:, банковские deep links и т.д.) при установке в source
  // вызывает нативный краш (loadFileURL: "... is not a file URL").
  const isWebUrl = /^https?:\/\//i.test(linkRefresh || '');

  const [isTwoClick, setTwoClick] = useState(false);

  const redirectDomens = ['https://ninecasino.life/#deposit'];

  const openInBrowser = [
    'mailto:',
    'itms-appss://',
    'conexus://',
    'bmoolbb://',
    'cibcbanking://',
    'bncmobile://',
    'rbcmobile://',
      'nl.abnamro.deeplink.psd2.consent',
      'snsbank.nl',
      'asnbank.nl',
      'nl-asnbank-sign',
      'revolut',
      'myaccount.ing.com',
      'bankieren.rabobank.nl',
      'regiobank.nl',
    'scotiabank://',

    'pcfbanking://',
    'tdct://',
    'nl.abnamro.deeplink.psd2.consent://',
    'nl-snsbank-sign://',
    'nl-asnbank-sign://',
    'triodosmobilebanking',
      'paytmmp://',
      'phonepe://',
      'upi://',
      'gpay://*',
      'bhim://*',
      'bybit://',
      'bybitapp://',

    // 'wise',
    // 'skrill',
  ];

  function backHandlerButton() {
    if (isTwoClick) {
      navigation.goBack();
      return;
    }
    setTwoClick(true);
    webViewRef.current.goBack();
    setTimeout(() => {
      setTwoClick(false);
    }, 1000);
  }

  const checkLinkInArray = (link, array) => {
    for (let i = 0; i < array.length; i++) {
      if (link.includes(array[i])) {
        return true;
      }
    }
    return false;
  };

  const openURLInBrowser = async url => {
    await Linking.openURL(url);
  };

  const socialLinks = [
      'https://m.facebook.com/',
      'https://www.facebook.com/',
      'https://www.instagram.com/',
      'https://twitter.com/',
      'https://www.whatsapp.com/',
      'https://whatsapp.com/',
      'wa.me/',
      'api.whatsapp.com/',
      'web.whatsapp.com/',
      'chat.whatsapp.com/',
      'https://t.me/',
      'https://x.com/',
      'fb://',
  ];
  console.log(linkRefresh);

  // Функция для открытия соц сетей в приложениях
  const openSocialLink = (url) => {
    // WhatsApp
    if (url.includes('wa.me/') || url.includes('api.whatsapp.com/') || url.includes('chat.whatsapp.com/') || url.includes('whatsapp.com/')) {
      let whatsappUrl = url;
      if (url.includes('wa.me/')) {
        const match = url.match(/wa\.me\/(\d+)/);
        if (match) whatsappUrl = `whatsapp://send?phone=${match[1]}`;
      } else if (url.includes('api.whatsapp.com/send')) {
        whatsappUrl = url.replace(/https?:\/\/api\.whatsapp\.com\/send/, 'whatsapp://send');
      } else if (url.includes('chat.whatsapp.com/')) {
        const match = url.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        if (match) whatsappUrl = `whatsapp://chat?code=${match[1]}`;
      } else if (url.includes('whatsapp.com/channel/')) {
        const match = url.match(/whatsapp\.com\/channel\/([a-zA-Z0-9]+)/);
        if (match) whatsappUrl = `whatsapp://channel/${match[1]}`;
      }
      return Linking.openURL(whatsappUrl).catch(() => Linking.openURL(url));
    }
    // Instagram
    if (url.includes('instagram.com/')) {
      const match = url.match(/instagram\.com\/([^/?]+)/);
      if (match && !['p', 'reel', 'stories'].includes(match[1])) {
        return Linking.openURL(`instagram://user?username=${match[1]}`).catch(() => Linking.openURL(url));
      }
    }
    // Facebook
    if (url.includes('facebook.com/')) {
      const match = url.match(/facebook\.com\/([^/?]+)/);
      if (match) {
        return Linking.openURL(`fb://profile/${match[1]}`).catch(() => Linking.openURL(url));
      }
    }
    // Twitter/X
    if (url.includes('twitter.com/') || url.includes('x.com/')) {
      const match = url.match(/(?:twitter|x)\.com\/([^/?]+)/);
      if (match) {
        return Linking.openURL(`twitter://user?screen_name=${match[1]}`).catch(() => Linking.openURL(url));
      }
    }
    // Telegram
    if (url.includes('t.me/')) {
      const match = url.match(/t\.me\/([^/?]+)/);
      if (match) {
        return Linking.openURL(`tg://resolve?domain=${match[1]}`).catch(() => Linking.openURL(url));
      }
    }
    // Fallback - открываем в браузере
    return Linking.openURL(url);
  };

  useEffect(() => {
    if (linkRefresh.startsWith('bitcoin:') ||
        linkRefresh.startsWith('ethereum:') ||
        linkRefresh.startsWith('litecoin:') ||
        linkRefresh.startsWith('dogecoin:') ||
        linkRefresh.startsWith('bitcoincash:') ||
        linkRefresh.startsWith('tether:') ||
        linkRefresh.startsWith('bch:') ||
        linkRefresh.startsWith('dash:') ||
        linkRefresh.startsWith('ripple:') ||
        linkRefresh.startsWith('monero:') ||
        linkRefresh.startsWith('zcash:') ||
        linkRefresh.startsWith('stellar:') ||
        linkRefresh.startsWith('usdcoin:')) {
        try {
          const address = linkRefresh.split(':')[1]?.split('?')[0] || '';
          if (address && Clipboard?.setString) {
            Clipboard.setString(address);
          }
        } catch (e) {
          console.log('crypto copy error:', e);
        }
        navigation.goBack();
        return;
    }

    if (checkLinkInArray(linkRefresh, socialLinks)) {
        openSocialLink(linkRefresh);
        navigation.goBack();
        return;
    }

    // Любая не-http(s) ссылка (mailto:, tel:, банковские deep links и т.д.)
    // не должна попадать в WebView — открываем её во внешнем приложении.
    if (!isWebUrl) {
        Linking.openURL(linkRefresh).catch(err => {
            console.log('openURL error:', err);
        });
        navigation.goBack();
    }
  }, [linkRefresh]);

  const cryptoSchemes = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'bitcoincash', 'tether', 'bch', 'dash', 'ripple', 'monero', 'zcash', 'stellar', 'usdcoin'];

  const onShouldStartLoadWithRequest = event => {
    const urlScheme = event.url.split(':')[0].toLowerCase();
    if (cryptoSchemes.includes(urlScheme)) {
      try {
        const address = event.url.split(':').slice(1).join(':').split('?')[0] || '';
        if (address && Clipboard?.setString) {
          Clipboard.setString(address);
          console.log('crypto address copied:', address);
        }
      } catch (e) {
        console.log('crypto copy error:', e);
      }
      return false;
    }

    if (checkLinkInArray(event.url, openInBrowser)) {
      try {
        openURLInBrowser(event.url);
      } catch (error) {
        Alert.alert(
          'Ooops',
          "It seems you don't have the bank app installed, wait for a redirect to the payment page",
        );
      }
      return false;
    }

    if (checkLinkInArray(event.mainDocumentURL, redirectDomens)) {
      navigation.navigate('main');
      return false;
    }
    return true;
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <StatusBar barStyle={'light-content'} />
        {isWebUrl && (
        <WebView
          originWhitelist={[
            '*',
            'http://*',
            'https://*',
            'intent://*',
            'tel:*',
            'mailto:*',
            'itms-appss://*',
            'https://m.facebook.com/*',
            'https://www.facebook.com/*',
            'https://www.instagram.com/*',
            'https://twitter.com/*',
            'https://x.com/*',
            'https://www.whatsapp.com/*',
            'https://t.me/*',
            'fb://*',
          ]}
          source={{uri: linkRefresh}}
          textZoom={100}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'crypto_address', address: address }));
                }
              }, true);
            })();
            true;
          `}
          onMessage={(e) => {
            try {
              const msg = JSON.parse(e.nativeEvent.data);
              if (msg.type === 'crypto_address') {
                const address = msg.address || '';
                if (address && Clipboard?.setString) {
                  Clipboard.setString(address);
                  console.log('crypto address copied from JS:', address);
                }
              }
            } catch (_) {}
          }}
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
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
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          allowFileAccess={true}
          showsVerticalScrollIndicator={false}
          javaScriptCanOpenWindowsAutomatically={true}
          style={{flex: 1}}
          ref={webViewRef}
          userAgent={
            userAgent
          }
        />
        )}
      </SafeAreaView>
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          position: 'absolute',
          bottom: 0,
          left: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          backHandlerButton();
        }}>
          <Ionicons name="arrow-back" size={21} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          position: 'absolute',
          bottom: 5,
          right: 25,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
        }}
        onPress={() => {
          webViewRef.current.reload();
        }}>
          <Ionicons name="reload" size={21} color="white" />
      </TouchableOpacity>
    </View>
  );
}
