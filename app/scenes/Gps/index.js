import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Icon, View, Header, Right, Body, Title, Left, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import {
  PERMISSIONS,
  RESULTS,
  check,
} from 'react-native-permissions';
import styles from './styles';
import { clearGeolocationData } from '../../state/geolocation/geolocation.actions';
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

  onClear = () => {
    this.props.clearGeolocationData();
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
            <Title>GPS Data</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            <Button
              onPress={() => this.onStart()}
              style={styles.button}
            >
              <Text
                style={styles.buttonText}
              >
                Start
              </Text>
            </Button>
            <Button
              onPress={() => this.onStop()}
              style={styles.button}
            >
              <Text
                style={styles.buttonText}
              >
                Stop
              </Text>
            </Button>

            <Button
              onPress={() => this.onClear()}
              style={styles.button}
            >
              <Text
                style={styles.buttonText}
              >
                Clear
              </Text>
            </Button>

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
  clearGeolocationData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  data: dataSelector(state),
});

const mapDispatchToProps = {
  clearGeolocationData,
};

export default connect(mapStateToProps, mapDispatchToProps)(GpsData);
