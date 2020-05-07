import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Button, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};


const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment:  (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
};

function RenderCampsite(props) {

    const {campsite} = props;

    const view = React.createRef();

    const recognizeDrag = ({ dx }) => (dx < -200) ? true : false;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
        },  
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + campsite.name + ' to favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel pressed')
                        },
                        {
                            text: 'Ok',
                            onPress: () => props.favorite ?
                                console.log('Already set a fav') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                );
            }
            return true;
        }
    });

    if(campsite) {
        return (
            <Animatable.View 
                animation='fadeInDown' 
                duration={2000} delay={1000}
                ref={view}
                {...panResponder.panHandlers}
            >
                <Card
                    featuredTitle={ campsite.title }
                    image={{ uri: baseUrl + campsite.image }} 
                >
                    <Text style={{margin:10}}>
                        { campsite.description }
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#8e7d69'
                            raised
                            reverse
                            onPress={() => props.favorite ? 
                            console.log('already a favorite') : props.markFavorite()}
                        />
                        <Icon   
                            name='pencil'
                            type='font-awesome'
                            color='#8e7d69'
                            raised
                            reverse
                            onPress={() => props.onShowModal()}
                            style={styles.cardItem}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    return <View />;

}


function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return(
            <View style={{ maring: 10 }}>
                <Rating
                    startingValue={item.rating}
                    imageSize={10}
                    style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                    readonly
                />
                <Text style={{ fontSize: 14 }}>{ item.text }</Text>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return(
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={ comments }
                    renderItem={ renderCommentItem }
                    keyExtractor={ item => item.id.toString() }
                />
            </Card>
        </Animatable.View>
    );
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        }
    }

    toggleModal = () => {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(campsiteId) {
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm(){
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: '' 
        });
    }

    markFavorite(campsiteId){
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {

        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={ campsite } 
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={ comments } />
                <Modal
                animationType={'slide'}
                transparent={false}
                visible={this.state.showModal}
                onRequestClose={() => this.toggleModal()}>

                    <View style={{margin: 10, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight}}>
                        <View style={styles.modal}>
                            <Rating
                                showRating
                                startingValue={this.state.rating}
                                imageSize={40}
                                onFinishRating={(rating)=>this.setState({rating: rating})}
                                style={{paddingVertical: 10}}
                            />
                            <Input
                                placeholder='Author'
                                leftIcon={{type:'font-awesome', name: 'user-o'}}
                                leftIconContainerStyle={{paddingRight: 10}}
                                style={{paddingVertical: 10}}
                                onChangeText={(author) => this.setState({author: author})}
                                value={this.state.author}
                            />
                            <Input
                                placeholder='Comment'
                                leftIcon={{type:'font-awesome', name: 'comment-o'}}
                                leftIconContainerStyle={{paddingRight: 10}}
                                style={{paddingVertical: 10}}
                                onChangeText={(text) => this.setState({text: text})}
                                value={this.state.text}
                            />
                            <View>
                                <Button
                                    title='Sumbit'
                                    buttonStyle={{marginTop: 10}}
                                    onPress={() => {
                                        this.handleComment(campsiteId)
                                        this.resetForm()
                                    }}
                                />
                                <Button
                                    title='Cancel'
                                    buttonStyle={{marginTop: 10}}
                                    onPress={() => {
                                        this.toggleModal()
                                        this.resetForm()
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>   
        );

    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);