import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Icon, View, Header, Right, Body, Title, Left, Button, Item, Input, Form, Grid, Row, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { dataSelector } from '../../state/covid/covid.selectors';
import { getCovidData } from '../../state/covid/covid.thunks';

const styles = StyleSheet.create({
  intro: {
    padding: 16,
    paddingBottom: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    padding: 16,
  },
  grid: {
    borderWidth: 0,
  },
  titleRow: {
    width: '100%',
    display: 'flex',
    textAlign: 'center',
    paddingTop: 20,
  },
  row: {
    padding: 16,
  },
  col: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5
  },
  icon: {
    fontSize: 20,
    flexShrink: 1,
  },
  count: {
    textAlign: 'center',
    flexGrow: 1,
    fontSize: 18,
  }
});

class Covid extends Component {
  constructor(props) {
    super(props);

    // TODO check for stored zipcode
    this.props.getCovidData('78704');
  }

  onSearch = async (zipcode) => {
    this.props.getCovidData(zipcode);
  }


  onClose = () => {
    Actions.pop();
  }
  render() {
    const { country, state, county } = this.props.data || {};
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Header>
          <Left>
            <Button transparent onPress={this.onClose}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Covid Stats</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            <Text style={styles.intro}>Find the last COVID-19 stats of your county:</Text>
            {/* TODO move to a form object */}
            <Form style={styles.form}>
              <Input
                placeholder="Please inform your Zip Code"
              />
              <Button><Text>Search</Text></Button>
            </Form>
            { this.props.data ? (
              <Grid style={styles.grid}>
                <Row>
                  <Title style={styles.titleRow}>{'United States'}</Title>
                </Row>
                <Row style={styles.row}>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="disease" style={styles.icon} />
                    <Text style={styles.count}>{'1329225'}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="angel" style={styles.icon} />
                    <Text style={styles.count}>{'79525'}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="head-side-mask" style={styles.icon} />
                    <Text style={styles.count}>{'216169'}</Text>
                  </Col>
                </Row>
                <Row>
                  <Title style={styles.titleRow}>{'Texas'}</Title>
                </Row>
                <Row style={styles.row}>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="disease" style={styles.icon} />
                    <Text style={styles.count}>{'1329225'}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="angel" style={styles.icon} />
                    <Text style={styles.count}>{'79525'}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="head-side-mask" style={styles.icon} />
                    <Text style={styles.count}>{'-'}</Text>
                  </Col>
                </Row>
                <Row>
                  <Title style={styles.titleRow}>{'Travis'}</Title>
                </Row>
                <Row style={styles.row}>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="disease" style={styles.icon} />
                    <Text style={styles.count}>{'1329225'}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="angel" style={styles.icon} />
                    <Text style={styles.count}>{'79525'}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Icon type="FontAwesome" name="head-side-mask" style={styles.icon} />
                    <Text style={styles.count}>{'-'}</Text>
                  </Col>
                </Row>
              </Grid>
            ) : null }
          </View>
        </Content>
      </Container>
    );
  }
}

Covid.propTypes = {
  data: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  data: dataSelector(state),
});

const mapDispatchToProps = dispatch => ({
  getCovidData: (zipcode) => dispatch(getCovidData(zipcode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Covid);
