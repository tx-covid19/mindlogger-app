import React from 'react';
import { StatusBar } from 'react-native';
import {
  Container,
  Content,
  Icon,
  Header,
  Right,
  Body,
  Title,
  Left,
  Button,
} from 'native-base';
import { Actions } from 'react-native-router-flux';

const ContactDiary = () => {
  const onClose = () => {
    Actions.pop();
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" />
      <Header hasSubtitle>
        <Left>
          <Button transparent onPress={onClose}>
            <Icon name="close" />
          </Button>
        </Left>
        <Body>
          <Title>Contact Diary</Title>
        </Body>
        <Right />
      </Header>
      <Content />
    </Container>
  );
};

export default ContactDiary;
