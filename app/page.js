'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Switch
} from "@nextui-org/react";
import Link from "next/link";

const Page = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('K');
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [icon, setIcon] = useState(null);
  const [bgClass, setBgClass] = useState('clear-bg');


  useEffect(() => {
    // Get user location using Geolocation API
    const getUserLocation = async () => {
      if (navigator.geolocation) {
        try {
          await navigator.geolocation.getCurrentPosition(
              (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
              },
              (error) => {
                console.error("Error getting location:", error);
                setError("Unable to determine your location. Please try again or enter it manually.");
              }
          );
        } catch (error) {
          console.error("Error accessing Geolocation API:", error);
          setError("Geolocation is not supported in your browser.");
        }
      } else {
        console.error("Geolocation API is not supported in this browser.");
        setError("Geolocation is not supported in your browser.");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    // Fetch weather data only after latitude and longitude are available
    if (latitude && longitude) {
      const fetchWeather = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Replace with your actual API key
          const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
          );
          setWeatherData(response.data);
          setCurrentTemperature(response.data.main.temp);
          const src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
          setIcon(src);
          console.log(icon);
        } catch (error) {
          setError(error);
        }
      };

      fetchWeather();
    }
  }, [latitude, longitude]);

  const handleUnitChange = () => {
    setTemperatureUnit(temperatureUnit === 'K' ? 'C' : 'K');
    setCurrentTemperature(
        temperatureUnit === 'K'
            ? weatherData.main.temp - 273.15 // Convert to Celsius
            : weatherData.main.temp + 273.15 // Convert to Kelvin
    );
  };

  useEffect(() => {
    if (weatherData) {
      const mainWeather = weatherData.weather[0].main;
      setBgClass(
          mainWeather === 'Clear'
              ? 'min-h-screen w-full clear-bg'
              : mainWeather === 'Thunderstorm' || mainWeather === 'Clouds'
                  ? 'min-h-screen w-full thunderstorm-bg'
                  : 'min-h-screen w-full clouds-bg'
      );
    }
  }, [weatherData]);



  return (
      <div className={bgClass}>
        <div className="flex items-center justify-end md:w-1/2 h-screen">
          <div className="w-full md:w-2/3">
            {error ? (
                <p>Error fetching weather data: {error.message}</p>
            ) : weatherData ? (
                <Table aria-label="Example empty table" className="w-full h-full">
                  <TableHeader>
                    <TableColumn>
                      <p className="text-2xl md:text-5xl m-2">{weatherData.name}</p>
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <p className="text-lg md:text-4xl">
                          {currentTemperature.toFixed(1)}
                          {temperatureUnit}
                        </p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Switch onValueChange={handleUnitChange}></Switch>
                          <p className="text-xs md:text-small text-default-500">
                            {temperatureUnit === 'K'
                                ? 'change to celsius'
                                : 'change to kelvin'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p className="text-xs md:text-2xl">
                          {weatherData.weather[0].description}
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
            ) : (
                <p>Loading weather data...</p>
            )}
          </div>
        </div>
      </div>

  );
};

export default Page;
