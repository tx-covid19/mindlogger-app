import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import {
  appletsSelector,
  invitesSelector,
  isDownloadingAppletsSelector,
} from '../../state/applets/applets.selectors';
import AppletListComponent from './AppletListComponent';
import { sync } from '../../state/app/app.thunks';
import { setCurrentApplet, toggleMobileDataAllowed } from '../../state/app/app.actions';
import { mobileDataAllowedSelector } from '../../state/app/app.selectors';
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
    Actions.push('applet_details');
  }

  handlePressCovid = () => {
    Actions.push('covid_details');
  }

  handleChangeCovidZipcode = async (zipcode) => {
    this.props.getCovidStats(zipcode);
  }

  render() {
    const {
      applets,
      invites,
      isDownloadingApplets,
      mobileDataAllowed,
      toggleMobileDataAllowed,
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
        onPressApplet={this.handlePressApplet}
        onPressCovid={this.handlePressCovid}
        onChangeCovidZipcode={this.handleChangeCovidZipcode}
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
  mobileDataAllowed: PropTypes.bool.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
  getCovidStats: PropTypes.func.isRequired,
  isFetchingStats: PropTypes.bool.isRequired,
  stats: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  zipcode: PropTypes.string.isRequired,
};

AppletList.defaultProps = {
  stats: null,
};

const mapStateToProps = state => ({
  applets: appletsSelector(state),
  invites: invitesSelector(state),
  isDownloadingApplets: isDownloadingAppletsSelector(state),
  mobileDataAllowed: mobileDataAllowedSelector(state),
  stats: statsSelector(state),
  zipcode: zipcodeSelector(state),
  isFetchingStats: isFetchingStatsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  sync,
  toggleMobileDataAllowed,
  setCurrentApplet: appletId => dispatch(setCurrentApplet(appletId)),
  getCovidStats: zipcode => dispatch(getCovidStats(zipcode)),
  clearCovidStats: zipcode => dispatch(clearCovidStats(zipcode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppletList);
