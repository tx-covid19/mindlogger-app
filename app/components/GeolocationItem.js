import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';
import TouchBox from './core/TouchBox';
import {
  BodyText,
  SubHeading,
} from './core';
import theme from '../themes/variables';
import { colors } from '../theme';
import LocationServices from '../services/LocationServices';
import { geolocationAllowedSelector } from '../state/geolocation/geolocation.selectors';

const icon = require('../../img/location.png');

const styles = StyleSheet.create({
  box: {
    position: 'relative',
    fontFamily: theme.fontFamily,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    fontFamily: theme.fontFamily,
    overflow: 'hidden',
  },
  image: {
    height: 64,
    width: 64,
    resizeMode: 'contain',
  },
  textBlock: {
    flex: 1,
    flexGrow: 1,
    marginLeft: 16,
    fontFamily: theme.fontFamily,
  },
  zipBlock: {
    fontFamily: theme.fontFamily,
    textAlign: 'center',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  zipInput: {
    fontSize: 12,
    lineHeight: 14,
    height: 12,
    width: 70,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 2,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  zipButton: {
    fontSize: 14,
    margin: 0,
    paddingTop: 2,
    paddingBottom: 2,
    height: 'auto',
    width: 70,
  },
  zipButtonText: {
    fontSize: 16,
    margin: 0,
    padding: 0,
    textAlign: 'center',
  },
  notification: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
});

const GeolocationItem = ({ isGeolocationAllowed }) => {
  const locationPermission = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  });

  useEffect(() => {
    if (isGeolocationAllowed) {
      check(locationPermission).then((response) => {
        if (response !== RESULTS.GRANTED) {
          request(locationPermission).then((response) => {
            if (response === RESULTS.GRANTED) {
              LocationServices.start();
            }
          });
        } else {
          LocationServices.start();
        }
      });
    }
  });

  return (
    <View style={styles.box}>
      <TouchBox
        onPress={() => {
          Actions.push('gps');
        }}
      >
        <View style={styles.inner}>
          <Image style={styles.image} source={icon} />
          <View style={styles.textBlock}>
            <SubHeading>
              Geolocation Tracking
            </SubHeading>
            <BodyText>
              Manage your location permissions
            </BodyText>
          </View>
        </View>
      </TouchBox>
    </View>
  );
};

GeolocationItem.propTypes = {
  isGeolocationAllowed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isGeolocationAllowed: geolocationAllowedSelector(state),
});

export default connect(mapStateToProps, null)(GeolocationItem);
