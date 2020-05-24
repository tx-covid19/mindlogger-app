import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Icon, Text, Left, Body, Right, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import { skinSelector } from '../../state/app/app.selectors';

import {
  LineChart,
} from 'react-native-chart-kit'

const linedata = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      strokeWidth: 2, // optional
    },
  ],
};

class CovidDetails extends Component {

  render() {
    const { skin } = this.props;

    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
    const YAxisInset = { top: 20, bottom: 20 }
    const XAxisInset = { left: 20, right: 20 }
    const graphInset = { ...YAxisInset, ...XAxisInset }

    const Decorator = ({ x, y, data }) => {
      return data.map((value, index) => (
          <Circle
              key={ index }
              cx={ x(index) }
              cy={ y(value) }
              r={ 4 }
              stroke={ skin.colors.primary }
              fill={ 'white' }
          />
      ))
    }

    const Line = ({ line }) => (
      <Path
          d={ line }
          stroke={ skin.colors.primary }
          fill={ 'none' }
      />
    )

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
        <Content>
          <LineChart
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43],
                  strokeWidth: 2,
                },
              ],
            }}
            bezier
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height}
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
              marginVertical: 20,
            }}
          />
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
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CovidDetails);
