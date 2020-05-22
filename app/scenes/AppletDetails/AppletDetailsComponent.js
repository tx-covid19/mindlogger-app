import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, StatusBar, View } from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Left, Body, Right } from 'native-base';
import moment from 'moment';
import { colors } from '../../theme';
import ActivityList from '../../components/ActivityList';
// import AppletSummary from '../../components/AppletSummary';
import AppletCalendar from '../../components/AppletCalendar';
import { getResponseInApplet } from '../../state/responses/responses.actions';


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: colors.alert,
    position: 'absolute',
  },
});


// eslint-disable-next-line
class AppletDetailsComponent extends React.Component {

  getResponseDates() {
    // TODO: a quick hack to add a dot for today's date
    // if the user has responded today. This is instead of
    // refreshing all the applets
    const { applet } = this.props;
    const allDates = [];

    if (allDates.length) {
      const maxDate = moment.max(allDates.map(d => moment(d)));
      if (applet.responseDates.indexOf(maxDate) < 0) {
        applet.responseDates.push(maxDate);
      }
    }

    return applet.responseDates;
  }

  // eslint-disable-next-line
  renderProtocols() {
    const { onPressActivity } = this.props;

    const responseDates = this.getResponseDates() || [];

    return (
      <View style={{ flex: 1 }}>
        <AppletCalendar responseDates={responseDates} />
        <ActivityList
          onPressActivity={onPressActivity}
        />
      </View>
    );
  }

  handlePress() {
    const { onPressBack, getResponseInApplet } = this.props;
    getResponseInApplet(false);
    onPressBack();
  }

  render() {
    const {
      applet,
      hasInvites,
      primaryColor,
    } = this.props;
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header style={{ backgroundColor: primaryColor }}>
          <Left>
            <Button transparent onPress={() => this.handlePress()}>
              <Icon
                ios="ios-home"
                android="md-home"
              />
              {hasInvites ? <View style={styles.circle} /> : null}
            </Button>
          </Left>
          <Body>
            <Title>{applet.name.en}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.renderProtocols()}
        </Content>
      </Container>
    );
  }
}

AppletDetailsComponent.propTypes = {
  applet: PropTypes.object.isRequired,
  onPressActivity: PropTypes.func.isRequired,
  onPressBack: PropTypes.func.isRequired,
  primaryColor: PropTypes.string.isRequired,
  hasInvites: PropTypes.bool.isRequired,
  getResponseInApplet: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  getResponseInApplet,
};

export default connect(null, mapDispatchToProps)(AppletDetailsComponent);
