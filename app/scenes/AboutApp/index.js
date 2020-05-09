import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { Container, Content, Button, Icon, View, Header, Right, Body, Title, Left } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import packageJson from '../../../package.json';
import { Markdown } from '../../components/core';
import config from '../../config';

const mindloggerAbout = `
### What is MindLogger?

This app is part of the open source MindLogger data collection and analysis platform designed by the MATTER Lab at the Child Mind Institute (https://matter.childmind.org).

### What can MindLogger do?

MindLogger's feature set is growing, and currently supports a wide variety of input types. Each screen in a MindLogger activity can include any of the following:
  - Text, picture, and audio
  - Question followed by image and/or text response options
  - Slider bar
  - Text entry
  - Table entry
  - Audio record
  - Photo/video capture
  - Drawing or tapping
  - Current geolocation
  - Simple cognitive task
  - Delay before response
  - Timer
  - Conditional logic to determine where to go next

### Where can I learn more?

Please visit https://mindlogger.org for more information.

Cheers,
MindLogger Team
Child Mind Institute`;

class AboutApp extends Component { // eslint-disable-line

  onClose = () => {
    Actions.pop();
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header hasSubtitle style={{ backgroundColor: config.defaultSkin.colors.primary }}>
          <Left>
            <Button transparent onPress={this.onClose}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>About {config.defaultSkin.name} {packageJson.version}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={styles.content}>
            <Markdown>
              {mindloggerAbout}
            </Markdown>
          </View>
        </Content>
      </Container>
    );
  }
}
export default AboutApp;
