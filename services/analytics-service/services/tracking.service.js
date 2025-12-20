const axios = require("axios");

const TRACKING_URL = process.env.TRACKING_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

const headers = {
  "x-internal-token": INTERNAL_TOKEN
};

const getMealHistory = (clientId) =>
  axios.get(
    `${TRACKING_URL}/internal/tracking/meal-log/history/${clientId}`,
    { headers }
  ).then(res => res.data);

const getWorkoutHistory = (clientId) =>
  axios.get(
    `${TRACKING_URL}/internal/tracking/workout-log/history/${clientId}`,
    { headers }
  ).then(res => res.data);

const getWeightHistory = (clientId) =>
  axios.get(
    `${TRACKING_URL}/internal/tracking/weight-log/history/${clientId}`,
    { headers }
  ).then(res => res.data);

const getTodayDaySelection = (clientId) =>
  axios.get(
    `${TRACKING_URL}/internal/tracking/day-selection/today/${clientId}`,
    { headers }
  ).then(res => res.data);

module.exports = {
  getMealHistory,
  getWorkoutHistory,
  getWeightHistory,
  getTodayDaySelection
};
