import * as R from 'ramda';

export const geolocationAllowedSelector = R.path(['geolocation', 'isGeolocationAllowed']);

export const dataSelector = R.path(['geolocation', 'data']);

export const statisticsSelector = R.path(['geolocation', 'statistics']);

export const statisticsLastSentSelector = R.path(['geolocation', 'statisticsLastSent']);
