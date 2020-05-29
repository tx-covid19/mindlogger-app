import { getCovidStats as getCovidStatsCall, getCovidTimeseries as getCovidTimeseriesCall } from '../../services/network';
import { authSelector } from '../user/user.selectors';

import {
  setFetchingCovidStats,
  updateCovidStats,
  setFetchingCovidTimeseries,
  updateCovidTimeseries,
} from './covid.actions';

export const getCovidStats = zipcode => (dispatch, getState) => {
  const state = getState();
  const auth = authSelector(state);

  if (!zipcode) {
    dispatch(updateCovidStats(null, null));
    return;
  }

  dispatch(setFetchingCovidStats(true));
  dispatch(updateCovidStats(zipcode, null));
  getCovidStatsCall({ authToken: auth.token, zipcode }).then((resp) => {
    dispatch(updateCovidStats(zipcode, resp));
  }).catch(() => {
    dispatch(updateCovidStats(zipcode, false));
  }).finally(() => {
    dispatch(setFetchingCovidStats(false));
  });
};

export const getCovidTimeseries = zipcode => (dispatch, getState) => {
  const state = getState();
  const auth = authSelector(state);

  if (!zipcode) {
    dispatch(updateCovidTimeseries(null, null));
    return;
  }

  dispatch(setFetchingCovidTimeseries(true));
  dispatch(updateCovidTimeseries(zipcode, null));
  getCovidTimeseriesCall({ authToken: auth.token, zipcode }).then((resp) => {
    dispatch(updateCovidTimeseries(zipcode, resp));
  }).catch(() => {
    dispatch(updateCovidTimeseries(zipcode, false));
  }).finally(() => {
    dispatch(setFetchingCovidTimeseries(false));
  });
};
