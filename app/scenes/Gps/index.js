import React from 'react';
import PropTypes from 'prop-types';
import {
  StatusBar,
  Text,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
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
  List,
  ListItem,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { setGeolocationAllowed } from '../../state/geolocation/geolocation.actions';
import { geolocationAllowedSelector } from '../../state/geolocation/geolocation.selectors';
import LocationServices from '../../services/LocationServices';

const GpsData = ({ isGeolocationAllowed, setGeolocationAllowed }) => {
  const toggleSwitch = () => {
    if (isGeolocationAllowed) {
      LocationServices.stop();
    }
    setGeolocationAllowed(!isGeolocationAllowed);
  };

  const onClose = () => {
    Actions.pop();
  };

  const locationText = 'HornSense uses location tracking to privately and anonymously monitor social distancing practices.\n\nHornSense will never export your location without your explicit permission.';

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
          <Title>Geolocation Tracking</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <List>
          <ListItem
            button
            bordered
          >
            <Left>
              <Text>
                {locationText}
              </Text>
            </Left>
          </ListItem>
          <ListItem
            bordered
          >
            <Left>
              <Text>
                Allow location tracking
              </Text>
            </Left>
            <Right>
              <Switch
                onValueChange={toggleSwitch}
                value={isGeolocationAllowed}
                style={{ padding: 8 }}
              />
            </Right>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
};

GpsData.propTypes = {
  isGeolocationAllowed: PropTypes.bool.isRequired,
  setGeolocationAllowed: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isGeolocationAllowed: geolocationAllowedSelector(state),
});

const mapDispatchToProps = {
  setGeolocationAllowed,
};

export default connect(mapStateToProps, mapDispatchToProps)(GpsData);
