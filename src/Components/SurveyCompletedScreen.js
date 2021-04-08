import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View,Button } from 'react-native';
import { Request, AlertMessage } from '../Helper/HelperMethods';


const GREEN = 'rgba(141,196,63,1)';
const PURPLE = 'rgba(108,48,237,1)';
const defaultAnswers = { favoriteColor: 'nothing', favoriteNumber: '0', favoritePet: 'nothing' };
export default class SurveyCompletedScreen extends Component {

    componentDidMount(){
        this.timer = setInterval(()=> this.GetThankYou(), 300000)
       }
       GetThankYou= async()=>{
        Request.get(`http://192.168.10.107:8965/api/Feedback/GetWelcomeAndThankyou`,this.Token)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
           console.error(err);
           AlertMessage("Something Went wrong");
        });
      }
      

    render() {
        const answers = this.props.navigation.getParam('surveyAnswers', defaultAnswers);

        return (
            <View style={styles.background}>
                <View style={styles.container}>
                    <ScrollView>
                        <Text style={styles.questionText}>The results are in!</Text>
                        <Text style={styles.questionText}>Your favorite color: {answers.favoriteColor}</Text>
                        <Text style={styles.questionText}>Your favorite number: {answers.favoriteNumber}</Text>
                        <Text style={styles.questionText}>You said No of color in Icube Logo : {answers.jugglingBalls} balls at once{answers.jugglingBalls > 1 ? '!' : '.'}</Text>
                        <Text style={styles.questionText}>Your favorite pet: {answers.favoritePet.value}</Text>
                        <Text style={styles.questionText}>Your favorite foods: {answers.favoriteFoods[0].value} and {answers.favoriteFoods[1].value}</Text>
                        <Text style={styles.questionText}>How you relax: {answers.relax[0].value} and {answers.relax[1].value}</Text>
                        <Text style={styles.questionText}>When confronted with a radio button you picked: {answers.radio.value}</Text>
                        <Text style={styles.questionText}>When given a default you chose: the {answers.singleDefault.value}</Text>
                        <Text style={styles.questionText}>When given a multiple defaults you chose: the {answers.multipleDefaults[0].value} and the {answers.multipleDefaults[1].value}</Text>
                        <Text>Raw JSON: {JSON.stringify(this.props.navigation.getParam('surveyAnswers', {}))}</Text>
                    </ScrollView>
                    <Button
        title="Homescreen"
        onPress={() => this.props.navigation.navigate('Home')}
/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PURPLE,
    },
    container: {
        minWidth: '70%',
        maxWidth: '90%',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    questionText: {
        marginBottom: 20,
        fontSize: 20
    },
});