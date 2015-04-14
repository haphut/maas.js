/**
 * maas.js - Communicate with maas-server
 * Copyright (C) 2015 haphut <haphut@gmail.com>
 *
 * This file is part of maas.js.
 *
 * maas.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * maas.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with maas.js.  If not, see <http://www.gnu.org/licenses/>.
 */

import request from 'superagent';

const ENDPOINT_SPEEDS = '/reports/speed-averages';
const ENDPOINT_ROUTES = '/routes';
const ENDPOINT_PLANS = '/plans';
const ENDPOINT_TRACES = '/traces';

const post = (url, payload, callback) => {
  return request
    .post(url)
    .send(payload)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .end(callback);
};

const get = (url, parameters, callback) => {
  return request
    .get(url)
    .query(parameters)
    .set('Accept', 'application/json')
    .end(callback);
};

const getPlan = (baseUrl, planId, callback) => {
  const url = baseUrl + ENDPOINT_PLANS + '/' + planId;
  return get(url, null, callback);
};

const sendPlan = (baseUrl, payload, callback) => {
  const url = baseUrl + ENDPOINT_PLANS;
  return post(url, payload, callback);
};

const sendOneOrMoreTraces = (baseUrl, payload, callback) => {
  const url = baseUrl + ENDPOINT_TRACES;
  return post(url, payload, callback);
};

const sendOneOrMoreRoutes = (baseUrl, payload, callback) => {
  const url = baseUrl + ENDPOINT_ROUTES;
  return post(url, payload, callback);
};

const getSpeedAverages = (baseUrl, parameters, callback) => {
  const url = baseUrl + ENDPOINT_SPEEDS;
  return get(url, parameters, callback);
};

export {
  getPlan,
  getSpeedAverages,
  sendOneOrMoreRoutes,
  sendOneOrMoreTraces,
  sendPlan
};
