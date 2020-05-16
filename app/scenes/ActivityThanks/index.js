import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  BodyText,
  Heading,
} from '../../components/core';
import theme from '../../themes/base-theme';
import FunButton from '../../components/core/FunButton';
import { getResponseInActivity } from '../../state/responses/responses.actions';

const backgroundImage = require('../../../img/tower.jpg');

const styles = StyleSheet.create({
  box: {
    padding: 20,
    paddingTop: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
    fontFamily: theme.fontFamily,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});

const ActivityThanks = ({ getResponseInActivity }) => {
  const onPressStart = () => {
    getResponseInActivity(false);
    Actions.replace('applet_details');
  };
  return (
    <ImageBackground
      style={{ width: '100%', height: '100%', flex: 1 }}
      source={backgroundImage}
    >
      <View style={styles.box}>
        <Heading style={{ color: 'white', fontFamily: theme.fontFamily }}>Thanks!</Heading>
        <BodyText style={{ color: 'white' }}>
          We've saved your answers.
        </BodyText>

        <FunButton onPress={onPressStart}>
          Close
        </FunButton>

      </View>
    </ImageBackground>
  );
};

ActivityThanks.propTypes = {
  getResponseInActivity: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  getResponseInActivity,
};

export default connect(null, mapDispatchToProps)(ActivityThanks);
