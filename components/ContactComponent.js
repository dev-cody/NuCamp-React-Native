import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Card } from 'react-native-elements';

class Contact extends Component{

    static navigationOptions = {
        title: 'Contact Us'
    }

    render() {
        return(
            <ScrollView>
                <Card title='Contact information' wrapperStyle={{ margin: 20 }}>
                    <Text>
                            1 Nucamp Way{'\n'}
                            Seattle, WA 98001{'\n'}
                            U.S.A.{'\n'}

                            Phone: 1-206-555-1234{'\n'}
                            Email: campsites@nucamp.co{'\n'}
                    </Text>
                </Card>
            </ScrollView>
        );
    }
}

export default Contact;