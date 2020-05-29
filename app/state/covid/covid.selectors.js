import * as R from 'ramda';

export const isFetchingStatsSelector = R.path(['covid', 'isFetchingStats']);

export const isFetchingTimeseriesSelector = R.path(['covid', 'isFetchingTimeseries']);

export const statsSelector = R.path(['covid', 'stats']);

export const timeseriesSelector = R.path(['covid', 'timeseries']);

export const zipcodeSelector = R.path(['covid', 'zipcode']);
