import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const API_KEY = "978942596f9c38280f32938c1b539334";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #87677b;
  border-style: dashed;
  border-color: black;
  border-radius: 10px;
  height: 100%;
`;

const WeatherCard = styled.div`
  border: 1px solid black;
  padding: 0;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
`;
const WeatherTempStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Weather = styled.p`
  font-size: 1rem;
  font-weight: bold;
`;

const Weather2 = styled.p`
  margin-left: 10px;
  font-size: 1rem;
  font-weight: light;
`;

const Temperature = styled.p`
  font-size: 3rem;
  font-weight: bold;
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 24px;
`;

const Detail = styled.div`
  font-size: 1rem;
  line-height: 24px;
  justify-content: space-between;
  margin-bottom: 16px;
  font-weight: bold;
  border-style: none none dashed;
`;

const Value = styled.span`
  font-weight: light;
  color: grey;
  font-size: 0.75rem;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: black;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: 1px solid black;
  padding: 10px;
  margin-right: 10px;
  border-style: none none dashed;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 2px solid black;
  padding: 10px;
  font-weight: bold;
  background-color: grey;
  color: #fff;
  cursor: pointer;
`;

const WeatherContainer = styled(Card)`
  width: 500px;
  margin-bottom: 10px;
`;
const WeatherIcon = styled.img`
  width: 100px;
  height: 100px;
`;

const WeatherSty = styled.div`
  display: flex;
  margin-left: 10px;
  flex-direction: column;
  align-items: center;
`;

const City = styled.h2`
  font-size: 1.5rem;
  margin-left: 10px;
`;
const TimeZ = styled.h2`
  font-size: 0.8rem;
  color: grey;
  margin-left: 10px;
`;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  timezone: number;
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value);
  };
  const getTimeInTimeZone = (timezone: number) => {
    const newDate = new Date();
    newDate.setUTCHours(newDate.getUTCHours() + timezone / 3600);
    newDate.setUTCMinutes(newDate.getUTCMinutes() + (timezone % 3600) / 60);
    return newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  };
  const getIconUrl = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}.png`;

  const handleSearch = () => {
    axios
      .get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`
      )
      .then((response) => {
        setWeatherData(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container>
      <Title>Weather App</Title>
      <SearchContainer>
        <Input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleCityChange}
        />
        <Input
          type="text"
          placeholder="Enter country"
          value={country}
          onChange={handleCountryChange}
        />
        <Button onClick={handleSearch}>Submit</Button>
      </SearchContainer>
      {weatherData && (
        <WeatherContainer>
          <WeatherCard>
            <City>{weatherData.name}, IN. Weather</City>
            <TimeZ>As of {getTimeInTimeZone(weatherData.timezone)}</TimeZ>
            <WeatherTempStyle>
              <Temperature>
                {Math.round(weatherData.main.temp - 273.15)}°
              </Temperature>
              <WeatherSty>
                <WeatherIcon src={getIconUrl(weatherData.weather[0].icon)} />
                <Weather>{weatherData.weather[0].description}</Weather>
              </WeatherSty>
            </WeatherTempStyle>
            <Weather2>{weatherData.weather[0].description}</Weather2>
          </WeatherCard>
          <Details>
            <Detail>
              High/Low :{" "}
              <Value>
                {Math.round(weatherData.main.temp_max - 273.15)}/
                {Math.round(weatherData.main.temp_min - 273.15)}
              </Value>
            </Detail>
            <Detail>
              wind: <Value>{weatherData.wind.speed}km/hr</Value>
            </Detail>

            <Detail>
              Humidity: <Value>{weatherData.main.humidity}%</Value>
            </Detail>

            <Detail>
              Wind Direction: <Value>{weatherData.wind.deg}° deg</Value>
            </Detail>
            <Detail>
              Pressure: <Value>{weatherData.main.pressure} hPa</Value>
            </Detail>
            <Detail>
              sunrise:{" "}
              <Value>
                {new Date(weatherData.sys.sunrise * 1000).toLocaleString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true
                  }
                )}
              </Value>
            </Detail>
            <Detail>
              Visibility: <Value>{weatherData.visibility}</Value>
            </Detail>

            <Detail>
              sunset:{" "}
              <Value>
                {new Date(weatherData.sys.sunset * 1000).toLocaleString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true
                  }
                )}
              </Value>
            </Detail>
          </Details>
        </WeatherContainer>
      )}
    </Container>
  );
};

export default WeatherApp;
