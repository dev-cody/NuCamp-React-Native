import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';

import { View, Platform, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation';
import { Icon } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { connect } from 'react-redux';
import { fetchCampsites, fetchComments, fetchPromotions, fetchPartners } from '../redux/ActionCreators';

const mapDispatchToProps = {
    fetchCampsites,
    fetchComments,
    fetchPartners,
    fetchPromotions
};

const DirectoryNavigator = createStackNavigator(
    {
        Directory: { 
            screen: Directory,
            navigationOptions:({ navigation }) => ({
                headerLeft: <Icon 
                    name='list'
                    type='font-awesome'
                    iconStyle={styles.stackIcon}
                    onPress={() => navigation.toggleDrawer()}
                />
            })
        },
        CampsiteInfo: { screen: CampsiteInfo },
    }, 
    {
        initialRouteName: 'Directory',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#2c4943'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            }
        }
    }
);

const HomeNavigator = createStackNavigator (
    {
        Home: { screen: Home},
    }, 
    {
        navigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: '#2c4943'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            },
            headerLeft: <Icon 
            name='home'
            type='font-awesome'
            iconStyle={styles.stackIcon}
            onPress={() => navigation.toggleDrawer()}
            />
        })
    }
);

const AboutNavigator = createStackNavigator(
    {
        About: { screen: About }
    },
    {
        navigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: '#2c4943'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            },
            headerLeft: <Icon 
            name='info-circle'
            type='font-awesome'
            iconStyle={styles.stackIcon}
            onPress={() => navigation.toggleDrawer()}
            />
        })
    }

);

const ContactNavigator = createStackNavigator(
    {
        Contact: { screen: Contact }
    },
    {
        navigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: '#2c4943'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            },
            headerLeft: <Icon 
            name='address-card'
            type='font-awesome'
            iconStyle={styles.stackIcon}
            onPress={() => navigation.toggleDrawer()}
            />
        })
    }
);

const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView
            style={styles.container}
            forceInset={{top: 'always', horizontal: 'never'}}>
            <View style={styles.drawerHeader}>
                <View style={{flex: 1}}>
                    <Image source={require('./images/logo.png')} style={styles.drawImage} />
                </View>
                <View style={{flex: 2}}>
                    <Text style={styles.drawerHeaderText}>NuCamp</Text>
                </View>
            </View>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
)

const MainNavigator = createDrawerNavigator(
    {
        Home: { 
            screen: HomeNavigator,
            navigationOptions: {
                drawerIcon:
                <Icon
                    name='home'
                    type='font-awesome'
                    size={24}
                    color='#f5e1b9'
                />
            }
        },
        Directory: { 
            screen: DirectoryNavigator, 
            navigationOptions: {
                drawerIcon:
                <Icon
                    name='list'
                    type='font-awesome'
                    size={24}
                    color='#f5e1b9'
                />
            }
        },
        About: { 
            screen: AboutNavigator,
            navigationOptions: {
                drawerLabel: 'About Us',
                drawerIcon:
                <Icon
                    name='info-circle'
                    type='font-awesome'
                    size={24}
                    color='#f5e1b9'
                />
            }
        },
        Contact: { 
            screen: ContactNavigator, 
            navigationOptions: {
                drawerLabel: 'Contact Us',
                drawerIcon:
                    <Icon
                        name='address-card'
                        type='font-awesome'
                        size={24}
                        color='#f5e1b9'
                    />
            }
        }
    },
    {
        drawerBackgroundColor: '#315545',
        contentOptions: {
            labelStyle: {
                color: '#fff'
            }
        },
        contentComponent: CustomDrawerContentComponent
    }
);


class Main extends Component {

    componentDidMount(){
        this.props.fetchCampsites();
        this.props.fetchComments();
        this.props.fetchPromotions();
        this.props.fetchPartners();
    }

    render() {
        return (
            <View style={{ 
                flex: 1,
                paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight 
            }}>
                <MainNavigator />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    stackIcon: {
        marginLeft: 20,
        color: '#fff',
        fontSize: 24
    },
    container: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#8e7d69',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        height: 60,
        width: 60
    }
});

export default connect(null, mapDispatchToProps)(Main);