import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { Container, Header, Title, Button, Icon, Body, Right, Left } from 'native-base';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  Menu,
  Provider,
} from 'react-native-paper';
import { colors } from '../../theme';
import AppletListItem from '../../components/AppletListItem';
import CovidItem from '../../components/CovidItem';
import GeolocationItem from '../../components/GeolocationItem';
import AppletInvite from '../../components/AppletInvite';
import { connectionAlert, mobileDataAlert } from '../../services/networkAlerts';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: window.width,
    height: window.width,
  },
  activityList: {
  },
  activityListContainer: {
    paddingTop: 10,
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
        <Image resizeMode="contain" source={backgroundImage} style={styles.background} />
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
                  <Menu.Item onPress={onPressDrawer} title="Settings" />
                </Menu>
              </View>
            </Right>
          </Header>
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
            {invites.length ? <AppletInvite /> : null}

            <CovidItem
              stats={stats}
              zipcode={zipcode}
              loading={isFetchingStats}
              onChangeZipcode={onChangeZipcode}
            />
            <GeolocationItem />
          </ScrollView>
        </SafeAreaView>
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
  onPressRefresh: PropTypes.func.isRequired,
  onPressApplet: PropTypes.func.isRequired,
  onChangeZipcode: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  mobileDataAllowed: PropTypes.bool.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
  isFetchingStats: PropTypes.bool.isRequired,
  stats: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  zipcode: PropTypes.string.isRequired,
};

AppletListComponent.defaultProps = {
  stats: null,
};

export default AppletListComponent;
