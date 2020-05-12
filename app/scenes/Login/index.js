import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Text,
  View,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import moment from 'moment';
import { fcmFcmTokenSelector } from '../../state/fcm/fcm.selectors';
import styles from './styles';
import { signInSuccessful } from '../../state/user/user.thunks';
import { signIn } from '../../services/network';
import LoginForm from './LoginForm';
import { mobileDataAllowedSelector } from '../../state/app/app.selectors';
import { toggleMobileDataAllowed } from '../../state/app/app.actions';
import config from '../../config';

const logo = require('../../../img/textLogo.png');

class Login extends Component {
  onAbout = () => {
    Actions.about_app();
  }

  onSubmit = async (body) => {
    const { signInSuccessful, fcmToken } = this.props;
    const timezone = this.getTimezone();

    return signIn({ ...body, deviceId: fcmToken, timezone })
      .then((response) => {
        if (typeof response.exception !== 'undefined') {
          throw response.exception;
        } else {
          signInSuccessful(response);
        }
      })
      .catch((e) => {
        if (typeof e.status !== 'undefined') {
          throw new SubmissionError({
            password: 'Login failed.',
          });
        } else {
          throw new SubmissionError({
            password: 'Login failed.',
          });
        }
      });
  }

  getTimezone = () => {
    return moment().utcOffset() / 60;
  }

  render() {
    const { mobileDataAllowed, toggleMobileDataAllowed } = this.props;
    const skin = config.defaultSkin;
    const title = skin.name;
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Content
          style={[styles.container, { backgroundColor: skin.colors.primary }]}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.header}>{title}</Text>
          <LoginForm
            onSubmit={this.onSubmit}
            primaryColor={skin.colors.primary}
            mobileDataAllowed={mobileDataAllowed}
            toggleMobileDataAllowed={toggleMobileDataAllowed}
          />
          <View>
            <TouchableOpacity onPress={this.onAbout}>
              <Text style={styles.whiteText}>{`What is ${title}?`}</Text>
            </TouchableOpacity>
            <Image style={styles.logo} source={logo} />
          </View>
        </Content>
      </Container>
    );
  }
}

Login.propTypes = {
  signInSuccessful: PropTypes.func.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
  skin: PropTypes.object.isRequired,
  mobileDataAllowed: PropTypes.bool.isRequired,
  fcmToken: PropTypes.string,
};
Login.defaultProps = {
  fcmToken: null,
};
const mapStateToProps = state => ({
  mobileDataAllowed: mobileDataAllowedSelector(state),
  fcmToken: fcmFcmTokenSelector(state),
});

const mapDispatchToProps = {
  signInSuccessful,
  toggleMobileDataAllowed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
