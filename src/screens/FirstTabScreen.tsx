import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import React from 'react';
import axios from 'axios';

export interface Props { }
export interface State {
  setup: string;
  punchline: string;
  fetching: boolean;
  fadeAnim: Animated.Value;
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002B3E'
  },
  welcome: {
    fontSize: 48,
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
    marginBottom: 32
  }
});

export default class FirstTabScreen extends React.Component<Props, State> {

  static navigatorStyle = {
    navBarHidden: true,
    statusBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      setup: '',
      punchline: '',
      fetching: false,
      fadeAnim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.fetchJoke();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ marginTop: 32 }} />
          <Icon
            name='gamepad'
            size={64}
            type='font-awesome'
            color='#cfff00' />
          <Animated.View
            style={{
              left: this.state.fadeAnim
            }}>
            <View style={{ margin: 32 }}>
              <Text style={styles.welcome}>
                {this.state.setup}{'\n\n'}{this.state.punchline}
              </Text>
            </View>
          </Animated.View>
          {this.state.fetching ? this.getActivityIndicator() : undefined}
        </ScrollView>
        <Button raised
          containerViewStyle={{ width: '100%', marginLeft: 0, marginRight: 0 }}
          icon={{ name: 'whatshot' }}
          title='Give me more...'
          backgroundColor='#b31049'
          onPress={() => this.newJokeButtonPressed()} />
      </View>
    );
  }

  private async animateChangeOut() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: Dimensions.get('window').width,
        duration: 500
      }
    ).start(this.fetchJoke.bind(this));
  }

  private async animateChangeIn() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 0,
        duration: 500
      }
    ).start();
  }

  private getActivityIndicator(): any {
    return (
      <View>
        <ActivityIndicator size='large' animating={this.state.fetching} />
      </View>
    );
  }

  private newJokeButtonPressed() {
    this.animateChangeOut();
  }

  private async fetchJoke() {
    try {
      this.setState({ setup: '', punchline: '' });
      this.setState({ fetching: true });
      let jokeResponse = await axios.get('https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke');
      this.setState({ setup: jokeResponse.data.setup, punchline: jokeResponse.data.punchline });
    } catch (error) {
      console.log(error);
      this.setState({ setup: 'Error!', punchline: 'Could not establish a internet connection!' });
    }
    this.setState({ fetching: false });
    this.animateChangeIn();
  }
}