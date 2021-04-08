// Aboutscreen.js

import React, { Component } from 'react';
import { StyleSheet, Button, ScrollView, Text, TextInput, View,TouchableOpacity,SafeAreaView } from 'react-native';
import { SimpleSurvey } from 'react-native-simple-survey';
import {  
    createSwitchNavigator,
    createAppContainer } from "react-navigation";

const GREEN = 'rgba(141,196,63,1)';
const PURPLE = 'rgba(108,48,237,1)';

const survey = [
    {
        questionType: 'Info',
        questionText: 'Welcome to the I-Cube Survey! Tap next to continue'
    },
    {
        questionType: 'TextInput',
        questionText: 'What is your favorite color?',
        questionId: 'favoriteColor',
        placeholderText: 'Tell me your favorite color!',
    },
    {
        questionType: 'NumericInput',
        questionText: 'It supports numeric input. Enter your favorite number here!',
        questionId: 'favoriteNumber',
        placeholderText: '42',
    },
    {
        questionType: 'NumericInput',
        questionText: 'How many color are avilable in the I-Cube Logo?',
        questionId: 'Icube Logo - Color',
        defaultValue: '0'
    },
    {
        questionType: 'SelectionGroup',
        questionText:
            'I-Cube Survey also has multiple choice questions. By default they acts like checkboxes, answers can be selected and deselected.\n\nWhat is your favorite pet?',
        questionId: 'favoritePet',
        options: [
            {
                optionText: 'Dogs',
                value: 'dog'
            },
            {
                optionText: 'Cats',
                value: 'cat'
            },
            {
                optionText: 'Ferrets',
                value: 'ferret'
            },
            {
                optionText: 'Snakes',
                value: 'snake'
            },
            {
                optionText: 'Rats',
                value: 'rats'
            }
        ]
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'Select two or three of your favorite foods!',
        questionId: 'favoriteFoods',
        questionSettings: {
            maxMultiSelect: 3,
            minMultiSelect: 2,
        },
        options: [
            {
                optionText: 'Sticky rice dumplings',
                value: 'sticky rice dumplings'
            },
            {
                optionText: 'Pad Thai',
                value: 'pad thai'
            },
            {
                optionText: 'Steak and Eggs',
                value: 'steak and eggs'
            },
            {
                optionText: 'Tofu',
                value: 'tofu'
            },
            {
                optionText: 'Ice cream!',
                value: 'ice cream'
            },
            {
                optionText: 'Injera',
                value: 'injera'
            },
            {
                optionText: 'Biryani',
                value: 'biryani'
            },
            {
                optionText: 'Tamales',
                value: 'tamales'
            },
        ]
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'Icube Survey can auto advance after a question has been answered. Select two things you do to relax:',
        questionId: 'relax',
        questionSettings: {
            maxMultiSelect: 2,
            minMultiSelect: 2,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'Reading a good book',
                value: 'reading'
            },
            {
                optionText: 'Going on vacation',
                value: 'vacations'
            },
            {
                optionText: 'Eating meals with family',
                value: 'meals'
            },
            {
                optionText: 'Heading to the ocean',
                value: 'ocean'
            }
        ]
    },
    {
        questionType: 'SelectionGroup',
        questionText:
            'Icube Survey can also simulate radio button behavior. Pick from below: ',
        questionId: 'radio',
        questionSettings: {
            allowDeselect: false,
        },
        options: [
            {
                optionText: 'I was forced to pick option 1',
                value: 'option 1'
            },
            {
                optionText: 'I have to pick option 2',
                value: 'option 2'
            },
            {
                optionText: 'I guess option 3',
                value: 'option 3'
            }
        ]
    },
    {
        questionType: 'SelectionGroup',
        questionText:
            'Icube Survey also supports default selections: ',
        questionId: 'singleDefault',
        questionSettings: {
            defaultSelection: 0
        },
        options: [
            {
                optionText: 'This is the default option',
                value: 'default'
            },
            {
                optionText: 'This is the alternative option',
                value: 'alternative'
            },
        ]
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'And of course it supports multiple defaults: ',
        questionId: 'multipleDefaults',
        questionSettings: {
            defaultSelection: [0, 2],
            maxMultiSelect: 2,
            minMultiSelect: 2,
        },
        options: [
            {
                optionText: 'This is the first default option',
                value: 'first default'
            },
            {
                optionText: 'This is the first alternate option',
                value: 'first alternative'
            },
            {
                optionText: 'This is the second default option',
                value: 'second default'
            },
            {
                optionText: 'This is the second alternate option',
                value: 'second alternative'
            },
        ]
    },
    {
        questionType: 'Info',
        questionText: 'That is all for the demo, tap finish to see your results!'
    },
];

export default class Surveyscreen extends Component {

    static navigationOptions = () => {
        return {
            headerStyle: {
                backgroundColor: GREEN,
                height: 40,
                elevation: 5,
            },
            headerTintColor: '#fff',
            headerTitle: 'Sample Survey',
            headerTitleStyle: {
                flex: 1,
            }
        };
    }

    constructor(props) {
        super(props);
        this.state = { backgroundColor: PURPLE, 
            displaystate:true,
            answersSoFar: '' 
        };
    }

    onSurveyFinished(answers) {
        /** 
         *  By using the spread operator, array entries with no values, such as info questions, are removed.
         *  This is also where a final cleanup of values, making them ready to insert into your DB or pass along
         *  to the rest of your code, can be done.
         * 
         *  Answers are returned in an array, of the form 
         *  [
         *  {questionId: string, value: any},
         *  {questionId: string, value: any},
         *  ...
         *  ]
         *  Questions of type selection group are more flexible, the entirity of the 'options' object is returned
         *  to you.
         *  
         *  As an example
         *  { 
         *      questionId: "favoritePet", 
         *      value: { 
         *          optionText: "Dogs",
         *          value: "dog"
         *      }
         *  }
         *  This flexibility makes SelectionGroup an incredibly powerful component on its own. If needed it is a 
         *  separate NPM package, react-native-selection-group, which has additional features such as multi-selection.
         */

        const infoQuestionsRemoved = [...answers];

        // Convert from an array to a proper object. This won't work if you have duplicate questionIds
        const answersAsObj = {};
        for (const elem of infoQuestionsRemoved) { answersAsObj[elem.questionId] = elem.value; }
         this.props.navigation.navigate('SurveyCompleted', { surveyAnswers: answersAsObj });
   
    }

    /**
     *  After each answer is submitted this function is called. Here you can take additional steps in response to the 
     *  user's answers. From updating a 'correct answers' counter to exiting out of an onboarding flow if the user is 
     *  is restricted (age, geo-fencing) from your app.
     */
    onAnswerSubmitted(answer) {
        this.setState({ answersSoFar: JSON.stringify(this.surveyRef.getAnswers(), 2) });
        switch (answer.questionId) {
            case 'favoriteColor': {
                if (answer.value) {
                    this.setState({ backgroundColor: answer.value });
                }
                break;
            }
            default:
                break;
        }
    }

    renderPreviousButton(onPress, enabled) {
        return (
            <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
                <Button
                    color={GREEN}
                    onPress={onPress}
                    disabled={!enabled}
                    backgroundColor={GREEN}
                    title={'Previous'}
                />
            </View>
        );
    }

    renderNextButton(onPress, enabled) {
        return (
            <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
                <Button
                    color={GREEN}
                    onPress={onPress}
                    disabled={!enabled}
                    backgroundColor={GREEN}
                    title={'Next'}
                />
            </View>
        );
    }

    renderFinishedButton(onPress, enabled) {
        return (
            <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
                <Button
                    title={'Finished'}

                    onPress={onPress}
                    disabled={!enabled}
                    color={GREEN}
                />
            </View>
        );
    }

    renderButton(data, index, isSelected, onPress) {
        return (
            <View
                key={`selection_button_view_${index}`}
                style={{ marginTop: 5, marginBottom: 5, justifyContent: 'flex-start' }}
            >
                <Button
                    title={data.optionText}
                    onPress={onPress}
                    color={isSelected ? GREEN : PURPLE}
                    style={isSelected ? { fontWeight: 'bold' } : {}} 
                    key={`button_${index}`}
                />
            </View>
        );
    }

    renderQuestionText(questionText) {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Text numLines={1} style={styles.questionText}>{questionText}</Text>
            </View>
        );
    }

    renderTextBox(onChange, value, placeholder, onBlur) {
        return (
            <View>
                <TextInput
                    style={styles.textBox}
                    onChangeText={text => onChange(text)}
                    numberOfLines={1}
                    underlineColorAndroid={'white'}
                    placeholder={placeholder}
                    placeholderTextColor={'rgba(184,184,184,1)'}
                    value={value}
                    multiline
                    onBlur={onBlur}
                    blurOnSubmit
                    returnKeyType='done'
                />
            </View>
        );
    }

    renderNumericInput(onChange, value, placeholder, onBlur) {
        return (<TextInput 
            style={styles.numericInput}
            onChangeText={text => { onChange(text); }}
            underlineColorAndroid={'white'}
            placeholderTextColor={'rgba(184,184,184,1)'}
            value={String(value)}
            placeholder={placeholder}
            keyboardType={'numeric'}
            onBlur={onBlur}
            maxLength={3}
        />);
    }

    renderInfoText(infoText) {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Text style={styles.infoText}>{infoText}</Text>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.containerMain}>
      {/* <View style={styles.bottomView}>
        <Text style={styles.textStyle}>JSON output</Text>
                    <Text>{this.state.answersSoFar}</Text>
        </View> */}
        <View style={styles.bottomView}>
            <TouchableOpacity style={styles.textStyle}>
            <Text style={{textAlign:'center'}}>List View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ActivetextStyle}>
            <Text style={{textAlign:'center'}}>Slide View</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.background, { backgroundColor: this.state.backgroundColor }]}>
           <SimpleSurvey
                ref={(s) => { this.surveyRef = s; }}
                survey={survey}
                renderSelector={this.renderButton.bind(this)}
                containerStyle={styles.surveyContainer}
                selectionGroupContainerStyle={styles.selectionGroupContainer}
                 navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
                renderPrevious={this.renderPreviousButton.bind(this)}
                renderNext={this.renderNextButton.bind(this)}
                renderFinished={this.renderFinishedButton.bind(this)}
                renderQuestionText={this.renderQuestionText}
                onSurveyFinished={(answers) => this.onSurveyFinished(answers)}
                onAnswerSubmitted={(answer) => this.onAnswerSubmitted(answer)}
                renderTextInput={this.renderTextBox}
                renderNumericInput={this.renderNumericInput}
                renderInfo={this.renderInfoText}
            /> 
        </View> 
      </View>
    </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      bottomView: {
          flexDirection:'row',
        width: '100%',
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
         position: 'absolute', //Here is the trick
     top: 0, //Here is the trick
      },
      textStyle: {
          backgroundColor:'#D3D3D3',
        fontSize: 18,
       width:"50%",
       height:50,
       justifyContent:'center'
      },
      ActivetextStyle: {
          backgroundColor:'green',
        fontSize: 18,
       width:"50%",
       height:50,
       justifyContent:'center'
     },
    welcom:{
        width:"100%",
         height:'100%',
    },
    container: {
        minWidth: '30%',
        maxWidth: '30%',
        alignItems: 'stretch',
        justifyContent: 'center',
        
        elevation: 20,
        borderRadius: 10,
        flex: 1, 
    },
     answersContainer: {
bottom:0
     },
    surveyContainer: {
        width: 'auto',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignContent: 'center',
        padding: 5,
        flexGrow: 0,
    },
    selectionGroupContainer: {
        flexDirection: 'column',
        backgroundColor: 'white',
        alignContent: 'flex-end',
    },
    background: {
        // height:'35%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        marginBottom: 20,
        fontSize: 20
    },
    textBox: {
        borderWidth: 1,
        borderColor: 'rgba(204,204,204,1)',
        backgroundColor: 'white',
        borderRadius: 10,
        
        padding: 10,
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 10
    },
    numericInput: {
        borderWidth: 1,
        borderColor: 'rgba(204,204,204,1)',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 10
    },
    infoText: {
        marginBottom: 20,
        fontSize: 20,
        marginLeft: 10
    },
});


