import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Icon, Text, Left, Body, Right, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import { skinSelector } from '../../state/app/app.selectors';

import { LineChart, Grid, YAxis } from 'react-native-svg-charts'
import { Circle, Path } from 'react-native-svg'
import * as shape from 'd3-shape'

class CovidDetails extends Component {

  render() {
    const { skin } = this.props;

    const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
    const contentInset = { top: 20, bottom: 20 }

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
          <View style={{ height: 200, flexDirection: 'row' }}>
            <YAxis
              data={data}
              contentInset={contentInset}
              svg={{
                  fill: 'grey',
                  fontSize: 10,
              }}
              numberOfTicks={10}
              />
            <LineChart
                style={{ flex: 1, marginLeft: 16 }}
                data={data}
                contentInset={contentInset}
                curve={shape.curveNatural}
                svg={{ stroke: skin.colors.primary }}
            >
              <Grid/>
              <Line/>
              <Decorator/>
            </LineChart>
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
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CovidDetails);
