import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import Weather from './components/Weather';
import { weatherConditions } from './utils/WeatherConditions';
import {WEATHER_API_KEY} from './utils/ApiKeys';

class App extends Component {
  state = {
	  isLoading: false,
    temperature: 0,
    weatherCondition: null,
		error: null
	};

  componentDidMount() {
		Geolocation.getCurrentPosition(
			position => {
				this.fetchWeather(position.coords.latitude, position.coords.longitude);
			},
			error => {
				this.setState({
					error: 'Error Getting Weather Conditions'
				});
			}
		);
	}

	fetchWeather(lat = 25, lon = 25) {
		fetch(
			`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${WEATHER_API_KEY}&units=metric`
		)
			.then(res => res.json())
			.then(json => {
				this.setState({
					temperature: json.main.temp,
					weatherCondition: json.weather[0].main,
					isLoading: false
				});
			});
	}

	render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    const backgroundColor = weatherConditions[weatherCondition]
      ? weatherConditions[weatherCondition].color
      : weatherConditions.Unknown.color;
		return (
			<View style={[
        styles.container,
        { backgroundColor }
      ]}>
				{isLoading ? (
          <Text>Fetching the Weather</Text>
        ) : (
					<View>
						<Weather
              weather={weatherCondition}
	            temperature={temperature}
            />
					</View>
				)}
			</View>
		);
	}
}

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f7b733',
		alignItems: 'center',
		justifyContent: 'center'
	}
});