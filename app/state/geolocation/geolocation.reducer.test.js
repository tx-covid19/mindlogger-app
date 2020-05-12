import geolocationReducer, { initialState } from './geolocation.reducer';
import { setGeolocationData, setStatistics, setStatisticsSentDate } from './geolocation.actions';

test('it has an initial state', () => {
  expect(geolocationReducer(undefined, { type: 'foo' })).toEqual(initialState);
});

test('it sets geolocation data', () => {
  expect(geolocationReducer(initialState, setGeolocationData('777'))).toEqual({
    ...initialState,
    data: '777',
  });
});

test('it sets geolocation statistics', () => {
  expect(geolocationReducer(initialState, setStatistics('777'))).toEqual({
    ...initialState,
    statistics: '777',
  });
});

test('it sets the last date statistics were sent', () => {
  expect(geolocationReducer(initialState, setStatisticsSentDate('777'))).toEqual({
    ...initialState,
    statisticsLastSent: '777',
  });
});
