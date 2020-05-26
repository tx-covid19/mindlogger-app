import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Icon, BodyText, Text, Left, Body, Right, View, Tabs, Tab } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import { skinSelector } from '../../state/app/app.selectors';
import { statsSelector, zipcodeSelector, isFetchingStatsSelector } from '../../state/covid/covid.selectors';

import {
  LineChart,
} from 'react-native-chart-kit'

const fmt = (n) => n.toLocaleString('en-US');

class CovidDetails extends Component {

  render() {
    const { skin, stats, loading, zipcode } = this.props;

    console.log(stats)

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
            <Tabs>
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
            </Tabs>
          </View>
          <View style={{  }}>
            <LineChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    data: [20, 45, 28, 80, 99, 43],
                    strokeWidth: 2,
                  },
                ],
              }}
              bezier
              width={Dimensions.get('window').width}
              height={300}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#000",
                  fill: "#fff",
                }
              }}
              style={{
                marginVertical: 0,
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
  zipcode: zipcodeSelector(state),
  loading: isFetchingStatsSelector(state),
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CovidDetails);
