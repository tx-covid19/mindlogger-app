import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import TouchBox from './core/TouchBox';
import {
  BodyText,
  SubHeading,
} from './core';
import theme from '../themes/variables';
import { colors } from '../theme';

const icon = require('../../img/contact_diary_icon.png');

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

const ContactDiaryItem = () => {
  return (
    <View style={styles.box}>
      <TouchBox onPress={() => {
        Actions.push('contact_diary');
      }}>
        <View style={styles.inner}>
          <Image style={styles.image} source={icon} />
          <View style={styles.textBlock}>
            <SubHeading>
              Contact Diary
            </SubHeading>
            <BodyText>
              Keep track human interactions and monitor your location history.
            </BodyText>
          </View>
        </View>
      </TouchBox>
    </View>
  );
};

export default ContactDiaryItem;
