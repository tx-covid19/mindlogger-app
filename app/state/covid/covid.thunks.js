import { getCovidData } from '../../services/network';
import { authSelector } from '../../state/user/user.selectors';

import {
  setFetchingCovidStats,
  updateCovidStats,
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
  getCovidData({ authToken: auth.token, zipcode }).then((resp) => {
    dispatch(updateCovidStats(zipcode, resp));
  }).catch((err) => {
    dispatch(updateCovidStats(zipcode, false));
  }).finally(() => {
    dispatch(setFetchingCovidStats(false));
  });
};
