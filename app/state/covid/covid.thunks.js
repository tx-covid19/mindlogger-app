import { getCovidData } from '../../services/network';
import { sync } from '../app/app.thunks';
import { authSelector, userInfoSelector } from '../user/user.selectors';

import {
  setFetchingCovidData,
  updateCovidData
} from './covid.actions';

export const getCovidData = zipcode => (dispatch, getState) => {
  const state = getState();
  const auth = authSelector(state);

  dispatch(setFetchingCovidData(true));
  getCovidData({ authToken: auth.token, zipcode }).then((resp) => {
    dispatch(updateCovidData(resp));
  }).catch((err) => {
    console.warn(err.message);
  }).finally(() => {
    dispatch(setFetchingCovidData(false));
  });
};
