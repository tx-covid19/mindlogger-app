import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import { Container, Header, Title, Button, Icon, Body, Right, Left } from 'native-base';
import { useNetInfo } from '@react-native-community/netinfo';
import { colors } from '../../theme';
import AppletListItem from '../../components/AppletListItem';
import AppletInvite from '../../components/AppletInvite';
import { connectionAlert, mobileDataAlert } from '../../services/networkAlerts';
import config from '../../config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
  },
  activityList: {
    // flex: 1,
    // backgroundColor: colors.lightGrey,
  },
  activityListContainer: {
    // backgroundColor: colors.secondary,
    // flex: 1,
    paddingTop: 10,
    // paddingBottom: 30,
  },
  sync: {
    padding: 50,
    textAlign: 'center',
    fontSize: 18,
  },
  menu: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const backgroundImage = require('../../../img/bevoEdited.jpg');

const AppletListComponent = ({
  applets,
  invites,
  isDownloadingApplets,
  title,
  onPressDrawer,
  onPressReportTest,
  onPressRefresh,
  onPressAbout,
  onPressCovid,
  onPressGps,
  onPressApplet,
  mobileDataAllowed,
  toggleMobileDataAllowed,
}) => {
  const netInfo = useNetInfo();
  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        style={{ width: '100%', height: '100%', flex: 1 }}
        source={backgroundImage}
      >
        <SafeAreaView>
          <Header>
            <Left />
            <Body>
              <Title>{title}</Title>
            </Body>
            <Right style={{ flexDirection: 'row' }}>
              <Button transparent onPress={onPressDrawer}>
                <Icon type="FontAwesome" name="user" />
              </Button>
              <Button transparent onPress={onPressReportTest}>
                <Icon type="FontAwesome" name="qrcode" />
              </Button>
            </Right>
          </Header>
          {/* <View style={{ flex: 1, backgroundColor: 'transparent' }}> */}

          {/* <BackgroundBlobs /> */}
          <ScrollView
            style={styles.activityList}
            refreshControl={(
              <RefreshControl
                refreshing={isDownloadingApplets}
                onRefresh={() => {
                  if (!netInfo.isConnected) {
                    connectionAlert();
                  } else if (netInfo.type === 'cellular' && !mobileDataAllowed) {
                    mobileDataAlert(toggleMobileDataAllowed);
                  } else {
                    onPressRefresh();
                  }
                }}
              />
            )}
            contentContainerStyle={styles.activityListContainer}
          >

            {applets.map(applet => (
              <AppletListItem applet={applet} onPress={onPressApplet} key={applet.id} />
            ))}
            {/* {
              applets.length === 0 && isDownloadingApplets
                ? <BodyText style={styles.sync}>Synchronizing...</BodyText>
                : <JoinDemoApplets />
            } */}
            {
              invites.length
                ? <AppletInvite /> : null
            }

            <View
              style={{
                marginTop: 20,
                marginBottom: 40,
                alignItems: 'center',
                alignContent: 'center',
                textAlign: 'center',
              }}
            >
              <TouchableOpacity onPress={onPressGps}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  View GPS Data
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressCovid}>
                <Text
                  style={styles.menu}
                >
                  View Covid Data
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressAbout}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  About {config.defaultSkin.name}
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

    </Container>
  );
};

AppletListComponent.propTypes = {
  applets: PropTypes.array.isRequired,
  invites: PropTypes.array.isRequired,
  isDownloadingApplets: PropTypes.bool.isRequired,
  onPressDrawer: PropTypes.func.isRequired,
  onPressReportTest: PropTypes.func.isRequired,
  onPressAbout: PropTypes.func.isRequired,
  onPressCovid: PropTypes.func.isRequired,
  onPressGps: PropTypes.func.isRequired,
  onPressRefresh: PropTypes.func.isRequired,
  onPressApplet: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  mobileDataAllowed: PropTypes.bool.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
};

export default AppletListComponent;
