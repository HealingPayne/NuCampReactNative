import React, { Component } from 'react';
import {
    Text, View, ScrollView, FlatList,
    Modal, Button, StyleSheet
} from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
// import { CAMPSITES } from '../shared/campsites';
// import { COMMENTS } from '../shared/comments';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
};

function RenderCampsite(props) {
    const { campsite } = props;
    if (campsite) {
        return (
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                <Card
                    featuredTitle={campsite.name}
                    image={{ uri: baseUrl + campsite.image }} >
                    <Text style={{ margin: 10 }}>
                        {campsite.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            raised
                            reverse
                            onPress={() => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()}
                        />
                        <Icon
                            name='pencil'
                            type='font-awesome'
                            color='#5637DD'
                            raised
                            reverse
                            onPress={() => props.onShowModal()}
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
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14, color: 'navy' }}>{item.text}</Text>
                <Text style={{ fontSize: 12 }}>CampID: {item.campsiteId}</Text>
                <Text style={{ fontSize: 12 }}>CommentID: {item.id}</Text>
                <Rating
                    readonly
                    type='star'
                    startingValue={item.rating}
                    imageSize={20}
                    style={{ padding: 10, alignItems: 'flex-start' }}
                />
                <Text style={{ fontSize: 12, color: 'purple' }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()} />
            </Card>
        </Animatable.View>
    );
}
class CampsiteInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 2.5,
            author: '',
            text: ''
        }
    }
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }
    handleComment(campsiteId) {
        console.log(JSON.stringify(this.state));
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
        this.toggleModal()
    }
    resetForm() {
        this.setState({
            rating: 2.5,
            author: '',
            text: '',
            showModal: false
        });
    }
    markFavorite(campsiteId) {
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
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'fade'}
                    //animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            type='star'
                            ratingCount={5}
                            fractions={1}
                            ratingTextColor='purple'
                            imageSize={40}
                            showRating={true}
                            startingValue={this.state.rating}
                            style={{ paddingVertical: 10 }}
                            onFinishRating={rating => this.setState({ rating: rating })}
                        />
                        <Input
                            placeholder='User'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={value => this.setState({ author: value })}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={value => this.setState({ text: value })}
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    console.log(campsiteId)
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}
                                color='#5637DD'
                                title='Submit'
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    //this.toggleModal(); 
                                    this.resetForm()
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    cardRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);