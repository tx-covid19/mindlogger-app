import { getCovidData as getCovidDataNetwork } from '../../services/network';
import { authSelector } from '../../state/user/user.selectors';

import {
  setFetchingCovidData,
  updateCovidData
} from './covid.actions';

export const getCovidData = zipcode => (dispatch, getState) => {
  const state = getState();
  const auth = authSelector(state);

  dispatch(setFetchingCovidData(true));
  getCovidDataNetwork({ authToken: auth.token, zipcode }).then((resp) => {
    dispatch(updateCovidData(resp));
  }).catch((err) => {
    console.warn(err.message);
  }).finally(() => {
    dispatch(setFetchingCovidData(false));
  });
};
