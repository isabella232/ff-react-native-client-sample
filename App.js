import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';

import cfClientInstance, {
  CfConfiguration,
  CfTarget,
} from 'ff-react-native-client-sdk';
import FeatureView from './FeatureView';

const client = cfClientInstance;

//You need to add only those fields that you want to override. The rest of them are displayed here, only as an example of default values.
const cfConfiguration = new CfConfiguration();
cfConfiguration.streamEnabled = true;

const cfTarget = new CfTarget();
cfTarget.identifier = 'Harness';

const apiKey = '5d59cb10-66cb-405b-ab54-b4d48132f383';

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  SubtitleTextStyle: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '500',
    alignSelf: 'center',
  },

  ButtonContainer: {
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#000000',
    backgroundColor: '#0073ed',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '90%',
  },

  ButtonTextStyle: {
    textAlign: 'center',
    color: '#FFFF',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 30,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: 'black',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const CustomButton = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={props.onPress}
      style={styles.ButtonContainer}>
      <Text style={styles.ButtonTextStyle}>{props.name}</Text>
    </TouchableOpacity>
  );
};
const Loader = props => {
  const {loading} = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size={60} animating={loading} color="#0073ed" />
        </View>
      </View>
    </Modal>
  );
};

var ceEvaluation = {
  lightImgSrc: require('./assets/ce.png'),
  darkImgSrc: require('./assets/ce_dark.png'),
  targetImgSrc: {},
  description:
    'Efficiency Spot and quickly debug inefficiencies and optimize them to reduce costs.',
  isNew: false,
  id: 'ce',
};
var cvEvaluation = {
  lightImgSrc: require('./assets/cv.png'),
  darkImgSrc: require('./assets/cv_dark.png'),
  targetImgSrc: {},
  description:
    'Deploy in peace, verify activities that take place in system. Identify risk early.',
  isNew: false,
  id: 'cv',
};
var cfEvaluation = {
  lightImgSrc: require('./assets/cf.png'),
  darkImgSrc: require('./assets/cf_dark.png'),
  targetImgSrc: {},
  description:
    'Decouple release from deployment and rollout features safely and quickly.',
  isNew: false,
  id: 'cf',
};
var ciEvaluation = {
  lightImgSrc: require('./assets/ci.png'),
  darkImgSrc: require('./assets/ci_dark.png'),
  targetImgSrc: {},
  description: 'Commit, build, and test your code at a whole new level',
  isNew: false,
  id: 'ci',
};

var cdEvaluation = {
  lightImgSrc: require('./assets/cd.png'),
  darkImgSrc: require('./assets/cd_dark.png'),
  targetImgSrc: {},
  description: '',
  isNew: false,
  enabled: true,
  isCD: true,
};
var needHelp = {
  lightImgSrc: require('./assets/cd.png'),
  darkImgSrc: require('./assets/cd_dark.png'),
  enabled: true,
  isHelp: true,
  id: 'need_help',
};

var evaluationDataState = {
  darkTheme: false,
  evaluationData: [],
};

var globalAuth = false;

const Home = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [evaluationData, setEvaluationData] = useState(undefined);

  async function didTapAccount(title) {
    setLoading(true);
    console.log('start js init with ' + JSON.stringify(cfConfiguration));

    try {
      var newTarget = Object.assign({}, cfTarget);
      newTarget.identifier = title;

      const result = await client.initialize(
        apiKey,
        cfConfiguration,
        newTarget,
      );

      if (result) {
        setLoading(false);
        console.log('setting auth');

        setIsAuthorized(true);
        globalAuth = true;
        reloadData()
          .then(data => {
            setEvaluationData(data);
            if (data != undefined) {
              console.log('start navigation');
              navigation.navigate('FeatureView', {
                evaluations: data,
                name: {title},
              });
            }
          })
          .catch(e => {
            console.log('error ', e);
            showAlert();
          });
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed check internet connection', [
        {
          text: 'OK',
          onPress: () => setLoading(false),
        },
      ]);
    }
  }
  function showAlert() {
    setLoading(false);
    Alert.alert('Error', 'Something happened try again later', [
      {
        text: 'OK',
      },
    ]);
  }

  return (
    <SafeAreaView>
      {getView(isAuthorized, isLoading, didTapAccount, evaluationData)}
    </SafeAreaView>
  );
};

function reloadData() {
  return Promise.all([
    cdEvaluation,
    client.boolVariation('harnessappdemoenableglobalhelp', false).then(
      evaluate =>
        new Promise(resolve => {
          needHelp.enabled = evaluate.value;
          resolve(needHelp);
        }),
    ),
    client.boolVariation('harnessappdemoenablecvmodule', false).then(evaluate =>
      client.numberVariation('harnessappdemocvtriallimit', 7).then(
        trialEvaluate =>
          new Promise(resolve => {
            cvEvaluation.enabled = evaluate.value;
            cvEvaluation.trialLimit = trialEvaluate.value;
            resolve(cvEvaluation);
          }),
      ),
    ),
    client.boolVariation('harnessappdemoenablecimodule', false).then(evaluate =>
      client.numberVariation('harnessappdemocitriallimit', 7).then(
        trialEvaluate =>
          new Promise(resolve => {
            ciEvaluation.enabled = evaluate.value;
            ciEvaluation.trialLimit = trialEvaluate.value;
            resolve(ciEvaluation);
          }),
      ),
    ),
    client
      .boolVariation('harnessappdemoenablecfmodule', false)
      .then(evaluate =>
        client.numberVariation('harnessappdemocftriallimit', 7).then(
          trialEvaluate =>
            new Promise(resolve => {
              cfEvaluation.trialLimit = trialEvaluate.value;
              cfEvaluation.enabled = evaluate.value;
              resolve(cfEvaluation);
            }),
        ),
      )
      .then(
        client.boolVariation('harnessappdemocfribbon', false).then(
          isNew =>
            new Promise(resolve => {
              cfEvaluation.isNew = isNew.value;
              resolve(cfEvaluation);
            }),
        ),
      ),
    client.boolVariation('harnessappdemoenablecemodule', false).then(evaluate =>
      client.numberVariation('harnessappdemocetriallimit', 7).then(
        trialEvaluate =>
          new Promise(resolve => {
            ceEvaluation.trialLimit = trialEvaluate.value;
            ceEvaluation.enabled = evaluate.value;
            resolve(ceEvaluation);
          }),
      ),
    ),
  ]).then(evaluationList =>
    client.boolVariation('harnessappdemodarkmode', false).then(
      darkEvaluation =>
        new Promise(resolve => {
          evaluationDataState.darkTheme = darkEvaluation.value;
          evaluationDataState.evaluationData = evaluationList;

          evaluationDataState.evaluationData.forEach(element => {
            if (darkEvaluation.value == true) {
              element.targetImgSrc = element.darkImgSrc;
            } else {
              element.targetImgSrc = element.lightImgSrc;
            }
          });

          resolve(evaluationDataState);
        }),
    ),
  );
}

function getView(isAuth, loading, invoker, data) {
  return <AuthView isLoading={loading} invoker={invoker} />;
}

const AuthView = ({isLoading, invoker}) => (
  <View>
    <Loader loading={isLoading} />
    <View styles={styles.Container}>
      <View style={{height: 20}} />
      <Text style={styles.SubtitleTextStyle}> Choose your account </Text>
      <View style={{height: 20}} />
      <CustomButton name="Aptiv" onPress={() => invoker('Aptiv')} />
      <View style={{height: 20}} />
      <CustomButton name="Experian" onPress={() => invoker('Experian')} />
      <View style={{height: 20}} />
      <CustomButton name="Fiserv" onPress={() => invoker('Fiserv')} />
      <View style={{height: 20}} />
      <CustomButton name="Harness" onPress={() => invoker('Harness')} />
      <View style={{height: 20}} />
      <CustomButton
        name="Palo Alto Networks"
        onPress={() => invoker('Palo Alto Networks')}
      />
    </View>
  </View>
);

const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Home}
          name="CF mobile SDK Demo"
          options={{
            headerStyle: {
              backgroundColor: '#0073ed',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="FeatureView"
          component={FeatureView}
          options={{
            title: 'Evaluations',
            headerStyle: {
              backgroundColor: '#0073ed',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
