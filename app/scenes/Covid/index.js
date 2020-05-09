import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Icon, View, Header, Right, Body, Title, Left, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

import styles from './styles';


class Covid extends Component {
  constructor(props) {
    super(props);
    try {
      this.checkCurrentState();
    } catch (e) {
      console.log(e);
    }
  }

  onClose = () => {
    Actions.pop();
  }
  render() {
    const data = JSON.stringify(this.props.data, undefined, 4);
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Header hasSubtitle>
          <Left>
            <Button transparent onPress={this.onClose}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Covid Stats</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            <Text>Test</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

Covid.propTypes = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Covid);
