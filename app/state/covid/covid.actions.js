import COVID_CONSTANTS from './covid.constants';

export const updateCovidData = data => ({
  type: COVID_CONSTANTS.SET_COVID_DATA,
  payload: data,
});

export const setFetchingCovidData = isFetching => ({
  type: COVID_CONSTANTS.SET_FETCHING_COVID_DATA,
  payload: isFetching,
});