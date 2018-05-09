import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import React from 'react';
import axios from 'axios';

export interface Props { }
export interface State {
  joke: string;
  fetching: boolean;
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#40003b'
  },
  welcome: {
    fontSize: 48,
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
    marginBottom: 32
  }
});

export default class SecondTabScreen extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      joke: '',
      fetching: false
    };
  }

  componentDidMount() {
    this.fetchJoke();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
          <View style={{ marginTop: 32 }} />
          <Icon
            name='rocket'
            size={64}
            type='font-awesome'
            color='#ff00b0' />
          <View style={{ margin: 32 }}>
            <Text style={styles.welcome}>
              {this.state.joke}
            </Text>
          </View>
          {this.state.fetching ? this.getActivityIndicator() : undefined}
        </ScrollView>
        <Button raised
          containerViewStyle={{ width: '100%', marginLeft: 0, marginRight: 0 }}
          icon={{ name: 'whatshot' }}
          title='Give me more...'
          backgroundColor='#009b72'
          onPress={() => this.fetchJoke()} />
      </View>
    );
  }

  private getActivityIndicator(): any {
    return (
      <View style={{ margin: 32 }}>
        <ActivityIndicator size='large' animating={this.state.fetching} />
      </View>
    );
  }

  private async fetchJoke() {
    try {
      this.setState({ joke: '' });
      this.setState({ fetching: true });
      let jokeResponse = await axios.get('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } });
      console.log(jokeResponse);
      this.setState({ joke: jokeResponse.data.joke });
    } catch (error) {
      console.log(error);
      this.setState({ joke: 'Error!\n\nCould not establish a internet connection!' });
    }
    this.setState({ fetching: false });
  }
}