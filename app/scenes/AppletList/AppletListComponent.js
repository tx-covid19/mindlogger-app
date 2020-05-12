import React, { useState } from 'react';
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
import { Container, Header, Title, Button, Icon, Body, Right, Left, BodyText } from 'native-base';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  Menu,
  Provider,
} from 'react-native-paper';
import { colors } from '../../theme';
import AppletListItem from '../../components/AppletListItem';
import CovidItem from '../../components/CovidItem';
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
  isFetchingStats,
  title,
  stats,
  zipcode,
  onPressDrawer,
  onPressReportTest,
  onPressRefresh,
  onPressAbout,
  onPressApplet,
  onChangeZipcode,
  mobileDataAllowed,
  toggleMobileDataAllowed,
}) => {
  const netInfo = useNetInfo();
  const [visible, setVisible] = useState(false);

  return (
    <Provider>
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
                <View>
                  <Menu
                    visible={visible}
                    onDismiss={() => setVisible(!visible)}
                    anchor={(
                      <Button transparent onPress={() => setVisible(!visible)}>
                        <Icon type="FontAwesome" name="ellipsis-v" />
                      </Button>
                    )}
                  >
                    <Menu.Item onPress={onPressReportTest} title="Scan QR" />
                    <Menu.Item onPress={() => {}} title="COVID-19 Statistics" />
                    <Menu.Item onPress={onPressDrawer} title="Settings" />
                  </Menu>
                </View>
              </Right>
            </Header>
            {/* <View style={{ flex: 1, backgroundColor: 'transparent' }}> */}
            
            <CovidItem stats={stats} zipcode={zipcode} loading={isFetchingStats} onChangeZipcode={onChangeZipcode} />

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
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>

      </Container>
    </Provider>

  );
};

AppletListComponent.propTypes = {
  applets: PropTypes.array.isRequired,
  invites: PropTypes.array.isRequired,
  isDownloadingApplets: PropTypes.bool.isRequired,
  onPressDrawer: PropTypes.func.isRequired,
  onPressReportTest: PropTypes.func.isRequired,
  onPressAbout: PropTypes.func.isRequired,
  onPressRefresh: PropTypes.func.isRequired,
  onPressApplet: PropTypes.func.isRequired,
  onChangeZipcode: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  mobileDataAllowed: PropTypes.bool.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
};

export default AppletListComponent;
