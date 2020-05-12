import * as R from 'ramda';

export const isFetchingStatsSelector = R.path(['covid', 'isFetchingStats']);

export const statsSelector = R.path(['covid', 'stats']);

export const zipcodeSelector = R.path(['covid', 'zipcode']);
