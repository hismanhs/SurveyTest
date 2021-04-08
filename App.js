import React from 'react';
import {StyleSheet} from 'react-native';
import {  
  createSwitchNavigator,
  createAppContainer } from "react-navigation";
import HomeScreen from './src/Components/Homescreen';
import Surveyscreen from './src/Components/Surveyscreen';
import SurveyCompletedScreen from './src/Components/SurveyCompletedScreen';


export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createSwitchNavigator({
  Home: {
    screen: HomeScreen
  },
  Survey: {
    screen: Surveyscreen
  },
  SurveyCompleted: {
    screen: SurveyCompletedScreen
}
});

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});