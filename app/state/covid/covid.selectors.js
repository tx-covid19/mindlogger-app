import * as R from 'ramda';

export const isFetchingDataSelector = R.path(['covid', 'isFetchingData']);

export const dataSelector = R.path(['covid', 'data']);
