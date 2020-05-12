import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import {
  appletsSelector,
  invitesSelector,
  isDownloadingAppletsSelector,
} from '../../state/applets/applets.selectors';
import { userInfoSelector } from '../../state/user/user.selectors';
import AppletListComponent from './AppletListComponent';
import { sync } from '../../state/app/app.thunks';
import { setCurrentApplet, toggleMobileDataAllowed } from '../../state/app/app.actions';
import { skinSelector, mobileDataAllowedSelector } from '../../state/app/app.selectors';
import LocationServices from '../../services/LocationServices';

import { statsSelector, zipcodeSelector, isFetchingStatsSelector } from '../../state/covid/covid.selectors';
import { getCovidStats } from '../../state/covid/covid.thunks';
import { clearCovidStats } from '../../state/covid/covid.actions';

class AppletList extends Component {
  constructor(props) {
    super(props);
    const { zipcode, getCovidStats } = this.props;
    if (zipcode) {
      getCovidStats(zipcode);
    }
  }

  refresh = () => {
    const { sync } = this.props;
    sync();
  }

  handlePressApplet = (applet) => {
    const { setCurrentApplet } = this.props;
    setCurrentApplet(applet.id);
    console.log('current applet id', applet.id);
    Actions.push('applet_details');
  }

  handleChangeZipcode = async (zipcode) => {
    this.props.getCovidStats(zipcode);
  }

  render() {
    const {
      applets,
      invites,
      isDownloadingApplets,
      skin,
      mobileDataAllowed,
      toggleMobileDataAllowed,
      user,
      zipcode,
      stats,
      isFetchingStats,
    } = this.props;

    return (
      <AppletListComponent
        applets={applets}
        invites={invites}
        zipcode={zipcode}
        stats={stats}
        isFetchingStats={isFetchingStats}
        isDownloadingApplets={isDownloadingApplets}
        title="HornSense"
        onPressDrawer={() => Actions.push('settings')}
        onPressReportTest={() => Actions.push('report_test')}
        onPressRefresh={this.refresh}
        onPressAbout={() => { Actions.push('about_app'); }}
        onPressApplet={this.handlePressApplet}
        onChangeZipcode={this.handleChangeZipcode}
        mobileDataAllowed={mobileDataAllowed}
        toggleMobileDataAllowed={toggleMobileDataAllowed}
      />
    );
  }
}

AppletList.propTypes = {
  applets: PropTypes.array.isRequired,
  invites: PropTypes.array.isRequired,
  isDownloadingApplets: PropTypes.bool.isRequired,
  sync: PropTypes.func.isRequired,
  setCurrentApplet: PropTypes.func.isRequired,
  skin: PropTypes.object.isRequired,
  mobileDataAllowed: PropTypes.bool.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  applets: appletsSelector(state),
  invites: invitesSelector(state),
  isDownloadingApplets: isDownloadingAppletsSelector(state),
  skin: skinSelector(state),
  mobileDataAllowed: mobileDataAllowedSelector(state),
  user: userInfoSelector(state),
  stats: statsSelector(state),
  zipcode: zipcodeSelector(state),
  isFetchingStats: isFetchingStatsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  sync,
  setCurrentApplet,
  toggleMobileDataAllowed,
  getCovidStats: (zipcode) => dispatch(getCovidStats(zipcode)),
  clearCovidStats: (zipcode) => dispatch(clearCovidStats(zipcode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppletList);
