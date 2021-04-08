import {
  Alert,
  AsyncStorage,
  Dimensions,
  UIManager,
  findNodeHandle,
  Keyboard,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import TinyToast from 'react-native-tiny-toast';

import CryptoJS from './EncryptionAlgorithm/aes';
import RNFetchBlob from 'rn-fetch-blob';
// import Share from 'react-native-share';

const Encrypter = {};
const Request = {};

Encrypter.EncryptCredentials = (Username, Password) => {
  var key = CryptoJS.enc.Utf8.parse('5656565656565656');
  var iv = CryptoJS.enc.Utf8.parse('5656565656565656');

  var encryptedUsername = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(Username),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  var encryptedPassword = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(Password),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  console.log(encryptedUsername, encryptedPassword);
  return {encryptedUsername, encryptedPassword};
};

export const getIPAndTokenFromAsyncStorage = async () => {
  const [[, IP], [, Token]] = await AsyncStorage.multiGet(['IP', 'Token']);
  return {IP, Token};
};

export const getItemsFromAsyncStorage = async itemArray => {
  const mappedValues = await (await AsyncStorage.multiGet(itemArray)).reduce(
    (prev, cur) => prev.set(cur[0], cur[1]),
    new Map(),
  );
  const result = {};
  itemArray.forEach(elem => {
    result[elem] = mappedValues.get(elem);
  });
  return result;
};

Request.get = async (url, Token) => {
  const res = await fetch(url, {
    headers: {
      Authorization: Token,
    },
  });
  const json = await res.json();
  return {
    status: res.status,
    data: json,
  };
};

Request.get_File = async (url, Token) => {
  return await fetch(url, {
    headers: {
      Authorization: Token,
    },
  });
};

Request.post = async (url, data, Token) => {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: Token,
    },
  });
};

Request.login = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: data,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return await res.json();
};

Request.fetchAccessForms = async () => {
  const [[, IP], [, Token], [, RoleId = '']] = await AsyncStorage.multiGet([
    'IP',
    'Token',
    'RoleId',
  ]);
  // if(IP && Token && RoleId !== ""){
  return (
    IP &&
    Token &&
    RoleId !== '' &&
    Request.get(
      `${IP}/api/common/FormsAccessForUserRole?RoleId=${RoleId}`,
      Token,
    )
      .then(HandleResponseStatus)
      .then(data => data)
      .catch(AlertError)
  );
  // } else return undefined;
};

export const LogoutUser = async callback => {
  await AsyncStorage.multiRemove(
    ['UserCode', 'UserId', 'RoleId', 'UserName', 'EmployeeName', 'Token'],
    callback,
  );
};

export const getFormsForModule = async MIndex => {
  const forms = await Request.fetchAccessForms();
  return forms && forms.filter(elem => elem.MINDEX === MIndex);
};

export const GroupValuesByKey = (arr, key) => {
  return arr.reduce((prev, cur) => {
    const curKey = cur[key];
    (prev[curKey] && prev[curKey].push(cur)) || (prev[curKey] = [cur]);
    return prev;
  }, {});
};

const prepareGroupedFields = data => {
  const groupedFields = {};
  data.map(grp => {
    groupedFields[grp.Group] = grp.Fields.sort(sortConfigFields);
  });
  return groupedFields;
};

const sortConfigFields = (a, b) => {
  return a.Order - b.Order;
};

const handleGroupFieldsResponse = res => {
  if (res.status === 200) {
    if (res.data.length) {
      return prepareGroupedFields(res.data);
    } else {
      AlertMessage('No Configured Fields found');
    }
  } else {
    AlertStatusError(res);
  }
};

Request.loadConfiguredFields = async callFrom => {
  const IP = await AsyncStorage.getItem('IP');
  const Token = await AsyncStorage.getItem('Token');
  const res = await Request.get(
    `${IP}/api/FieldConfiguration/GetVisibleFieldsForForm?CallFrom=Mobile&FormName=${callFrom}`,
    Token,
  );
  return handleGroupFieldsResponse(res);
};

//  to get specific properties from an array of Objects
export const getPropsFromArray = (arr, props) => {
  let result = {};
  const returnProps = [...props];
  returnProps.map(p => {
    result[p] = [];
  });
  [...arr].map(i => {
    returnProps.map(p => result[p].push(i[p] || 'Property Not Found'));
  });
  return result;
};

export const ShowToastMsg = (msg, duration = 'SHORT') =>
  TinyToast.show(msg, {duration: TinyToast.duration[duration]});

export const ShowSuccessToastMsg = (msg, duration = 'SHORT') =>
  TinyToast.showSuccess(msg, {duration: TinyToast.duration[duration]});

export const HandleResponseStatus = res => {
  if (res.status === 200) {
    return res.data;
  } else {
    AlertStatusError(res);
  }
};

export const AlertMessage = (msg, callback) =>
  Alert.alert('iCube Alert', msg, [
    {text: 'Ok', onPress: () => callback && callback()},
  ]);
export const Confirmation = (msg, callback) => {
  Alert.alert('iCube Alert', msg, [
    {text: 'Cancel'},
    {text: 'Ok', onPress: callback},
  ]);
};
export const AlertError = err => {
  AlertMessage(`Something went wrong\n${JSON.stringify(err, null, 2)}`);
  return err;
};
export const AlertStatusError = ({status, data}) =>
  AlertMessage(`${status} - ${data.Message}`);

export const dismissKeyboard = () => Keyboard.dismiss();

// to calculate the Orientation of the device and to check whether or not Orientation changed
export const getOrientation = wasPotrait => {
  const {width, height} = Dimensions.get('window');
  const isPotrait = height - width > 0;
  return {
    width,
    height,
    isPotrait,
    orientationChanged: wasPotrait !== isPotrait,
  };
};

// to calculate width of the control based on the layout ( width & height )
export const getResponsiveLayout = wasPotrait => {
  const {width, height, isPotrait, orientationChanged} = getOrientation(
    wasPotrait,
  );
  let dynamicWidth,
    dynamicMiniWidth,
    dynamicInputFont,
    dynamicLabelFont,
    dynamicCardItemWidth,
    dynamicCardFixedItemWidth;
  if (width < 600) {
    dynamicWidth = 100;
    dynamicMiniWidth = 33;
    dynamicInputFont = 14;
    dynamicLabelFont = 12;
    dynamicCardItemWidth = 25;
    dynamicCardFixedItemWidth = 100;
  } else if (width < 700) {
    dynamicWidth = 50;
    dynamicMiniWidth = 20;
    dynamicInputFont = 14;
    dynamicLabelFont = 12;
    dynamicCardItemWidth = 20;
    dynamicCardFixedItemWidth = 40;
  } else if (width < 960) {
    dynamicWidth = 50;
    dynamicMiniWidth = 10;
    dynamicInputFont = 16;
    dynamicLabelFont = 13;
    dynamicCardItemWidth = 16.6;
    dynamicCardFixedItemWidth = 35;
  } else {
    dynamicWidth = 33.33;
    dynamicMiniWidth = 10;
    dynamicInputFont = 18;
    dynamicLabelFont = 14;
    dynamicCardItemWidth = 10;
    dynamicCardFixedItemWidth = 22;
  }
  return {
    width,
    height,
    isPotrait,
    dynamicWidth,
    dynamicMiniWidth,
    dynamicInputFont,
    dynamicLabelFont,
    dynamicCardItemWidth,
    dynamicCardFixedItemWidth,
    orientationChanged,
  };
};

// to calculate the position of the dropDown whether at the top of the textInput or at the bottom of the textInput based on the position of the Input
export const calculateDropdownPosition = async (
  containerRef,
  compRef,
  callBack,
) => {
  const container = findNodeHandle(containerRef);
  const comp = findNodeHandle(compRef);
  UIManager.measure(container, (px, py, pw, ph, ppx, ppy) => {
    UIManager.measure(comp, (cx, cy, cw, ch, cpx, cpy) => {
      const actualY = cpy - ppy;
      if (ph - (actualY + ch) < 75 && actualY > 75) {
        callBack({bottom: '100%'});
      } else {
        callBack({top: '100%'});
      }
    });
  });
};

// to calculate the dimension of Image to have three images in a row
export const getLayoutImageDimension = () => {
  const {width} = Dimensions.get('window');
  return width / 3;
};

// Share file based on callinf from
export const sharefileForCallFRom = async (
  CallFrom,
  InvoiceID,
  InvoiceNO,
  InvoiceDate,
  FormIndex,
  Loccode,
) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'External Permission',
        message: 'To Save File.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let dirs = RNFetchBlob.fs.dirs;
      const [[, IP], [, Token]] = await AsyncStorage.multiGet(['IP', 'Token']);
      try {
        // console.log(
        //   `${IP}/api/Common/CallPrint?PassPindex_Cindex_GCindex=${FormIndex}&FileId=0&FormSaveID=${InvoiceID}&FormSaveCode=${InvoiceNO}&FormSaveDate=${InvoiceDate}&FormSaveLoccode=${Loccode}&FormExtraString1=${CallFrom}&ContentTypeName=pdf&LocationCode=${Loccode}`,
        // );
        await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'pdf',
          // response data will be saved to this path if it has access right.
          path:
            dirs.DownloadDir +
            '/iCube/Share/' +
            CallFrom +
            '/' +
            InvoiceNO +
            '_' +
            InvoiceDate +
            '.pdf',
        })
          .fetch(
            'GET',
            `${IP}/api/Common/CallPrint?PassPindex_Cindex_GCindex=${FormIndex}&FileId=0&FormSaveID=${InvoiceID}&FormSaveCode=${InvoiceNO}&FormSaveDate=${InvoiceDate}&FormSaveLoccode=${Loccode}&FormExtraString1=${CallFrom}&ContentTypeName=pdf&LocationCode=${Loccode}`,
            {
              Authorization: Token,
            },
          )
          .then(res => {
            console.log(res)
            // Share.open({
            //   title: CallFrom + ' - ' + InvoiceNO,
            //   message: CallFrom + ' Report',
            //   url:
            //     Platform.OS === 'android'
            //       ? 'file://' + res.path()
            //       : '' + res.path(),
            //   subject: 'Report',
            // });
          })
          .catch(err => {
            AlertError(err);
          });
      } catch (err) {
        console.error(err);
        AlertMessage('Error while generate file.');
      }
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.error(err);
  }
};
export {Encrypter};
export {Request};
