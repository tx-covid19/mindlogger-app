import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Button,
  View,
  Header,
  Left,
  Right,
  Icon,
  Text,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Platform } from 'react-native';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import styles from './styles';
import { showToast } from '../../state/app/app.thunks';
import TestResultsForm from './form';
import config from '../../config';

class ReportTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanOpen: true,
    };
  }

  onSubmit = (body) => {
    const { showToast } = this.props;
    this.sendTestId(body);
    Actions.replace('applet_list');
    showToast({
      text: 'Test ID sent.',
      position: 'bottom',
      type: 'success',
      duration: 3000,
    });
  }

  onScan = (body) => {
    const { showToast } = this.props;
    this.sendTestId(body);
    Actions.replace('login');
    showToast({
      text: 'QR code recognized! Test ID sent.',
      position: 'bottom',
      type: 'success',
      duration: 3000,
    });
  }

  sendTestId = (body) => {
    console.log('setting test id', body);
    // TODO: send testID in body to server
  }

  toggleQrScanner = () => {
    const { scanOpen } = this.state;
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });

    if (!scanOpen) {
      Permissions.check(permission).then((response) => {
        if (response !== Permissions.RESULTS.GRANTED) {
          Permissions.request(permission).then((response) => {
            if (response === Permissions.RESULTS.GRANTED) {
              this.setState({ scanOpen: true });
            }
          });
        } else {
          this.setState({ scanOpen: true });
        }
      });
    } else {
      this.setState({ scanOpen: !scanOpen });
    }
  }

  render() {
    const skin = config.defaultSkin;
    const header = (
      <Header style={{ backgroundColor: skin.colors.primary }}>
        <Left>
          <Button transparent onPress={() => Actions.pop()}>
            <Icon
              ios="ios-arrow-back"
              android="md-arrow-back"
            />
          </Button>
        </Left>
        <Right>
          <Button transparent block onPress={this.toggleQrScanner}>
            <Text>{ this.state.scanOpen ? 'Enter Test ID Manually' : 'Scan QR' }</Text>
          </Button>
        </Right>
      </Header>
    );


    if (this.state.scanOpen) {
      return (
        <Container style={[styles.container, { backgroundColor: skin.colors.primary }]}>
          { header }
          <QRCodeScanner
            fadeIn
            showMarker
            onRead={this.onScan}
          />
        </Container>
      );
    } return (
      <Container style={[styles.container, { backgroundColor: skin.colors.primary }]}>
        { header }
        <View style={styles.formContainer}>
          <TestResultsForm
            onSubmit={this.onSubmit}
            primaryColor={skin.colors.primary}
          />
        </View>
      </Container>
    );
  }
}

ReportTest.propTypes = {
  showToast: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  showToast,
};

export default connect(null, mapDispatchToProps)(ReportTest);
