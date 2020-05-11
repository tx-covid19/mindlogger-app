import * as R from 'ramda';

export const dataSelector = R.path(['geolocation', 'data']);

export const statisticsSelector = R.path(['geolocation', 'statistics']);

export const statisticsLastSentSelector = R.path(['geolocation', 'statisticsLastSent']);
