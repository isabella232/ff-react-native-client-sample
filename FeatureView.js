import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native';
import cfClientInstance from 'ff-react-native-client-sdk';
import {ScrollView} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  titleLightTheme: {
    width: '95%',
    textAlign: 'left',
    alignSelf: 'center',
    color: 'black',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 5,
  },
  titleDarktheme: {
    width: '95%',
    textAlign: 'left',
    alignSelf: 'center',
    color: 'lightslategrey',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 5,
  },
  bottomPart: {
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
  },
  bottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: '#33b5e5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#33b5e5',
    textAlign: 'center',
    padding: 5,
    marginBottom: 12,
    marginRight: 5,
    // elevation: 10,
    shadowColor: 'black',
    fontSize: 12,
  },
  bottomLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    marginLeft: 10,
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 12,
  },
  imgStyle: {
    width: '90%',
    marginTop: 10,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  containerLightTheme: {
    backgroundColor: 'white',
  },
  containerDarkTheme: {
    backgroundColor: 'black',
  },

  boxLightTheme: {
    // shadowColor: 'black',
    backgroundColor: 'white',
  },
  boxDarkTheme: {
    backgroundColor: 'black',
    shadowColor: 'white',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
    backgroundColor: 'red',
  },
  main: {
    flex: 1,
    backgroundColor: 'red',
  },

  labelLighTheme: {
    color: 'black',
  },
  labelDarkTheme: {
    color: 'lightsteelblue',
  },
  box: {
    marginRight: '5%',
    marginLeft: '5%',
    width: '40%',
    marginTop: 20,
    borderRadius: 8,
    height: 220,
    elevation: 10,
  },
  newImageStyle: {
    resizeMode: 'contain',
    height: '20%',
    width: '20%',
    position: 'absolute',
    right: 0,
    top: 0,
  },

  needHelpBox: {
    position: 'absolute',
    backgroundColor: 'green',
    borderRadius: 15,
    padding: 20,
    right: 0,
  },
  needHelpText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

const FeatureView = ({route, navigation}) => {
  const {evaluations, name} = route.params;
  var evaluationData = evaluations;
  var isDarkTheme = evaluationData.darkTheme;
  var theme = isDarkTheme
    ? styles.containerDarkTheme
    : styles.containerLightTheme;
  var titleTheme = isDarkTheme ? styles.titleDarktheme : styles.titleLightTheme;
  var boxTheme = isDarkTheme ? styles.boxDarkTheme : styles.boxLightTheme;
  var labelTheme = isDarkTheme ? styles.labelDarkTheme : styles.labelLighTheme;

  useFocusEffect(
    React.useCallback(() => {
      console.log('Registering events listener');
      cfClientInstance.registerEventsListener(detectFlagFrom);
      return () => {
        console.log('Unregistering events listener');
        cfClientInstance.unregisterListener(detectFlagFrom);
      };
    }, []),
  );

  const [evaluationState, setEvaluationState] = useState(evaluationData);

  function detectFlagFrom(type, flags) {
    if (type == 'evaluation_change' || type == 'evaluation_polling') {
      var array = [];
      if (Array.isArray(flags)) {
        array = flags;
      } else {
        array.push(flags);
      }

      array.forEach((x) => {
        switch (x.flag) {
          case 'harnessappdemoenablecvmodule':
            enableCVModule(x.value);
            break;
          case 'harnessappdemoenablecimodule':
            enableCIModule(x.value);
            break;
          case 'harnessappdemoenablecfmodule':
            enableCFModule(x.value);
            break;
          case 'harnessappdemoenablecemodule':
            enableCEModule(x.value);
            break;
          case 'harnessappdemocfribbon':
            enableCFRibbon(x.value);
            break;
          case 'harnessappdemodarkmode':
            enableDarkMode(x.value);
            break;
          case 'harnessappdemoenableglobalhelp':
            enableGlobalHelp(x.value);
            break;
          case 'harnessappdemocvtriallimit':
            setCVTrial(x.value);
            break;
          case 'harnessappdemocitriallimit':
            setCITrial(x.value);
            break;
          case 'harnessappdemocftriallimit':
            setCFTrial(x.value);
            break;
          case 'harnessappdemocetriallimit':
            setCETrial(x.value);
            break;
        }
        copy();
      });
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          onPress={() => {
            cfClientInstance.destroy();
            navigation.popToTop();
          }}
          style={{color: '#fff', fontSize: 18, marginRight: 10}}>
          Destroy
        </Text>
      ),
      title: name.title,
    });
  });

  function enableModule(moduleId, value) {
    module = evaluationState.evaluationData.find(
      (element) => element.id == moduleId,
    );
    if (module != undefined) {
      module.enabled = value;
    }
  }

  function enableModuleTrial(moduleId, trialValue) {
    module = evaluationState.evaluationData.find(
      (element) => element.id == moduleId,
    );
    if (module != undefined) {
      module.trialLimit = trialValue;
    }
  }
  function newToggle(moduleId, value) {
    module = evaluationState.evaluationData.find(
      (element) => element.id == moduleId,
    );
    if (module != undefined) {
      module.isNew = value;
    }
  }

  function copy() {
    state = {};
    state.darkTheme = evaluationState.darkTheme;
    state.evaluationData = evaluationState.evaluationData;
    setEvaluationState(state);
  }

  function enableCVModule(val) {
    enableModule('cv', val);
  }

  function enableCIModule(val) {
    enableModule('ci', val);
  }

  function enableCFModule(val) {
    enableModule('cf', val);
  }

  function enableCEModule(val) {
    enableModule('ce', val);
  }

  function enableCFRibbon(val) {
    newToggle('cf', val);
  }

  function enableDarkMode(val) {
    evaluationState.darkTheme = val;
  }

  function enableGlobalHelp(val) {
    enableModule('need_help', val);
  }

  function setCVTrial(val) {
    enableModuleTrial('cv', val);
  }

  function setCITrial(val) {
    enableModuleTrial('ci', val);
  }

  function setCFTrial(val) {
    enableModuleTrial('cf', val);
  }

  function setCETrial(val) {
    enableModuleTrial('ce', val);
  }

  function imgThemeForElement(evaluation, index) { 
    console.log(JSON.stringify(isDarkTheme));
    return isDarkTheme === true
      ? evaluation.darkImgSrc
      : evaluation.lightImgSrc;
  }

  function renderFeatureView(evaluation, index) {
    return <MyView
        key={index}
        title={evaluation.description}
        bottomLeft={evaluation.trialLimit + '-Day Trial'}
        imgSrc={imgThemeForElement(evaluation, index)}
        theme={boxTheme}
        labelTheme={labelTheme}
        titleTheme={titleTheme}
        isNew={evaluation.isNew}
        isCD={evaluation.isCD}
        isHelpVisible={evaluation.isHelp && evaluation.enabled}
        id={evaluation.id}
        isDarkTheme={isDarkTheme}
      />;
  }
  var filtered = evaluationData.evaluationData.filter(
    (data) => data.enabled == true || (data.id == 'need_help'),
  );
  return (
    <SafeAreaView style={[styles.main, theme]}>
      <View style={[styles.container, theme]}> 
      <Text style={ 
        {
        textAlign: 'left', 
         marginLeft: 10, 
         fontWeight: 'bold',
         fontSize: 20,     
        }
        }>Enabled Modules</Text>
      <FlatList
          data={filtered.slice(0, 2)}
          renderItem={({item, index}) => renderFeatureView(item, index)}
          numColumns={2}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      <Text style={ 
        {
          textAlign: 'left', 
           marginLeft: 10, 
           fontWeight: 'bold',
           fontSize: 20,     
          }
      }>Enable More Modules</Text>
      <FlatList
          data={filtered.slice(2, 22)}
          renderItem={({item, index}) => renderFeatureView(item, index)}
          numColumns={2}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const NeedHelpView = (isDarkTheme) => {
  return (
    <View
      style={[
        styles.box,
        {
          elevation: 0,
          shadowRadius: 0,
        },
      ]}>
      <View
        style={[
          styles.needHelpBox,
          {
            transform: [
              {rotateZ: '270deg'},
              {translateY: 40},
              {translateX: -80},
            ],
          },
          {
            shadowColor: isDarkTheme ? 'white' : 'black',
            elevation: 10,
            shadowOpacity: 0.3,
            shadowRadius: 10,
            shadowOffset: {
              width: 5,
              height: 5,
            },  
          }
        ]}>
        <Text style={styles.needHelpText}>Need help? 👋</Text>
      </View>
    </View>
  );
};

const MyView = ({
  title,
  bottomLeft,
  imgSrc,
  theme,
  labelTheme,
  titleTheme,
  isNew,
  isCD,
  isHelpVisible,
  id,
  isDarkTheme,
}) => {
  const isCDView = () => {
    if (isCD === true) {
      return <View />;
    } else {
      return (
        <View style={styles.bottomPart}>
          <Text style={[labelTheme, styles.bottomLeft]}>{bottomLeft}</Text>
          <Text style={styles.bottomRight}>Enable</Text>
        </View>
      );
    }
  };
  
  if (id == "need_help") {
    return isHelpVisible == true ? NeedHelpView(isDarkTheme) : <View style={[styles.box, 
      {
        elevation: 0,
        shadowRadius: 0,
      }
    ]}/>;
  } else {
    return (
      <View
        style={[
          styles.box,
          {
            elevation: 10,
            shadowOpacity: 0.3,
            shadowRadius: 5,
            shadowOffset: {
              width: 5,
              height: 5,
            },
          },
          theme,
        ]}>
        {getImg(imgSrc)}
        {getNewImg(isNew)}
        {isCDView()}
        <Text style={titleTheme}> {title} </Text>
      </View>
    );
  }
};

function getImg(src) {
  if (src == undefined) {
    return null;
  } else {
    return <Image style={styles.imgStyle} source={src} />;
  }
}
function getNewImg(isNew) {
  if (isNew === undefined || isNew === false) {
    return null;
  } else {
    return (
      <Image
        style={styles.newImageStyle}
        source={require('./assets/new.png')}
      />
    );
  }
}

export default FeatureView;