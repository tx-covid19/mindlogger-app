import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Text, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Icon, View, Header, Right, Body, Title, Left, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import {
  PERMISSIONS,
  RESULTS,
  check,
} from 'react-native-permissions';
import styles from './styles';
import { dataSelector } from '../../state/geolocation/geolocation.selectors';
import LocationServices from '../../services/LocationServices';


class GpsData extends Component {
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

  onStart = () => {
    LocationServices.start();
    console.log('starting recording');
  }

  onStop = () => {
    LocationServices.stop();
    console.log('stopping recording');
  }

  checkCurrentState() {
    // NEED TO TEST ON ANDROID
    let locationPermission;
    if (Platform.OS === 'ios') {
      locationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    } else {
      locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }

    // If user has location enabled & permissions, start logging
    check(locationPermission)
      .then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            LocationServices.start();
            return;
          case RESULTS.UNAVAILABLE:
          case RESULTS.BLOCKED:
            console.log('NO LOCATION');
            LocationServices.stop();
            return;
          default:
            console.log('default');
            return;
        }
      }).catch(error => {
        console.log('error checking location: ' + error);
      });
  }

  render() {
    const data = JSON.stringify(this.props.data);
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header hasSubtitle>
          <Left>
            <Button transparent onPress={this.onClose}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>GPS Data</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => this.onStart()}
            >
              <Text>start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onStop()}
            >
              <Text>stop</Text>
            </TouchableOpacity>

            <Text>
              {data}
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

GpsData.propTypes = {
  data: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  data: dataSelector(state),
});

export default connect(mapStateToProps, null)(GpsData);
