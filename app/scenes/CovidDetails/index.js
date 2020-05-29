import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Icon, BodyText, Text, Left, Body, Right, View, Tabs, Tab } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import { skinSelector } from '../../state/app/app.selectors';
import { statsSelector, timeseriesSelector, zipcodeSelector, isFetchingStatsSelector, isFetchingTimeseriesSelector } from '../../state/covid/covid.selectors';
import { getCovidStats, getCovidTimeseries } from '../../state/covid/covid.thunks';
import { clearCovidStats } from '../../state/covid/covid.actions';

import {
  LineChart,
} from 'react-native-chart-kit'

const fmt = (n) => n.toLocaleString('en-US');

function numFormatter(num) {
  if(num > 999 && num < 1000000){
      return (num/1000).toFixed(0) + 'K'; // convert to K for number from > 1000 < 1 million 
  }else if(num > 1000000){
      return (num/1000000).toFixed(0) + 'M'; // convert to M for number from > 1 million 
  }else if(num < 900){
      return num; // if value < 1000, nothing to do
  }
}

class CovidDetails extends Component {
  constructor(props) {
    super(props);
    const { zipcode, getCovidStats, getCovidTimeseries } = this.props;
    if (zipcode) {
      getCovidStats(zipcode);
      getCovidTimeseries(zipcode);
    }
  }

  render() {
    const { skin, stats, timeseries, loadingStats, loadingTimeseries, zipcode } = this.props;

    console.log(stats, timeseries)

    if (loadingStats || loadingTimeseries) {
      return null;
    }

    // [
    //   {
    //     data: [20, 45, 28, 80, 99, 43],
    //     strokeWidth: 2,
    //   },
    // ]

    let graphLabels = timeseries.country.timeseries.map(
      (p) => p.date.split('-')[2] == '10' ? p.date.split('-').slice(1).join('/') : ''
    )

    let graphTimeseries = [
      {
        data: timeseries.country.timeseries.map((p) => p.confirmed),
        strokeWidth: 2,
      },
      {
        data: timeseries.country.timeseries.map((p) => p.deaths),
        strokeWidth: 2,
      },
      {
        data: timeseries.country.timeseries.map((p) => p.recovered),
        strokeWidth: 2,
      },
    ]

    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header style={{ backgroundColor: skin.colors.primary }}>
          <Left>
            <Button transparent onPress={Actions.pop}>
              <Icon
                ios="ios-arrow-back"
                android="md-arrow-back"
              />
            </Button>
          </Left>
          <Body>
            <Title>COVID19 Stats</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, width: Dimensions.get('window').width }}>
            {/* <Tabs>
              <Tab heading="Country" style={{ flex: 1 }}>
                <View style={{ padding: 16, paddingTop: 30 }}>
                  <Text style={{ textAlign: 'center', fontSize: 30 }}>{fmt(stats.country.confirmed)}</Text>
                  <Text style={{ textAlign: 'center' }}>Confirmed</Text>
                </View>
                <View style={{ padding: 16 }}>
                  <Text style={{ textAlign: 'center', fontSize: 30 }}>{fmt(stats.country.confirmed)}</Text>
                  <Text style={{ textAlign: 'center' }}>Deaths</Text>
                </View>
              </Tab>
              <Tab heading="State">
                <View style={{ padding: 16 }}>
                  <Text>Confirmed: {fmt(stats.state.confirmed)}</Text>
                  <Text>Deaths: {fmt(stats.state.confirmed)}</Text>
                </View>
              </Tab>
              <Tab heading="County">
                <View style={{ padding: 16 }}>
                  <Text>Confirmed: {fmt(stats.county.confirmed)}</Text>
                  <Text>Deaths: {fmt(stats.county.confirmed)}</Text>
                </View>
              </Tab>
            </Tabs> */}
          </View>
          <View style={{  }}>
            <LineChart
              data={{
                labels: graphLabels,
                datasets: graphTimeseries,
              }}
              bezier
              width={Dimensions.get('window').width}
              height={300}
              withDots={false}
              withInnerLines={false}
              formatYLabel={(label) => numFormatter(label)}
              fromZero={true}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                // propsForDots: {
                //   r: "4",
                //   strokeWidth: "2",
                //   stroke: "#000",
                //   fill: "#fff",
                // },
              }}
              style={{
                marginVertical: 0,
                marginHorizontal: 0,
              }}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

CovidDetails.defaultProps = {
};

CovidDetails.propTypes = {
  skin: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  skin: skinSelector(state),
  stats: statsSelector(state),
  timeseries: timeseriesSelector(state),
  zipcode: zipcodeSelector(state),
  loadingStats: isFetchingStatsSelector(state),
  loadingTimeseries: isFetchingTimeseriesSelector(state),
});

const mapDispatchToProps = dispatch => ({
  getCovidStats: zipcode => dispatch(getCovidStats(zipcode)),
  getCovidTimeseries: zipcode => dispatch(getCovidTimeseries(zipcode)),
  clearCovidStats: zipcode => dispatch(clearCovidStats(zipcode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CovidDetails);
