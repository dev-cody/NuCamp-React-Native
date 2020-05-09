import React, { Component } from 'react';
import { Text, View, Picker, Switch, StyleSheet, Animated, Alert } from "react-native";
import { Button } from 'react-native-elements'
import DatePicker from 'react-native-datepicker';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            campers: 1,
            hikIn: false,
            date: '',
            scaleValue: new Animated.Value(0)
        };
    }

    static navigationOptions = {
        title: 'Reserve Campsite'
    }

    HandleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Begin Search?',
            'Number of Campers: ' + this.state.campers + '\n'
            + 'Hike-In: ' + this.state.hikIn + '\n'
            + 'Date: ' + this.state.date + '\n',
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'Search',
                    onPress: () => this.resetForm()
                }
            ],
            { cancelable: false }
            )
    }

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: '',
            showModal: false,
        });
    }

    animate() {
        Animated.timing (
            this.state.scaleValue,
            {
                toValue: 1,
                duration: 750,
                delay: 500
            }
        ).start();
    }

    componentDidMount() {
        this.animate();
    }

    render() {
        return(
            <Animated.ScrollView style={{transform: [{scale: this.state.scaleValue}]}}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Campers</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.campers}
                        onValueChange={itemValue => this.setState({campers: itemValue})}>
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' value='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                        <Picker.Item label='6' value='6' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Hike in?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.hikeIn}
                        trackColor={'#495636'}
                        onValueChange={value => this.setState({hikeIn: value})}>
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format='YYYY-MM-DD'
                        mode='date'
                        placeholder='Select Date'
                        minDate={new Date().toISOString()}
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={date => {this.setState({date: date})}}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.HandleReservation()}
                        buttonStyle={styles.button}
                        title='Search'
                        color='#495636'
                        accessibilityLabel='Tap me to search for an available campsites to reserve'
                    />
                </View>
            </Animated.ScrollView>
        );
    }

}


const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row', 
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    button: {
        backgroundColor: '#495636',
    }
})

export default Reservation;