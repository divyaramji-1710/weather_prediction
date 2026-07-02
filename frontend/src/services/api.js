import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const fetchCurrentWeather = async (
  city,
  units = "metric"
) => {
  const response = await axios.get(
    `${API_URL}/weather/current`,
    {
      params: {
        city,
        units,
      },
    }
  );

  return response.data;
};

export const fetchForecast = async (
  city,
  units = "metric"
) => {
  const response = await axios.get(
    `${API_URL}/weather/forecast`,
    {
      params: {
        city,
        units,
      },
    }
  );

  return response.data;
};