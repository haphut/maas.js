/**
 * maas.js - Client for maas-server
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

import fetch from 'isomorphic-fetch';
import _ from 'lodash';

const ENDPOINT_SPEEDS = '/reports/speed-averages';
const ENDPOINT_ROUTES = '/routes';
const ENDPOINT_PLANS = '/plans';
const ENDPOINT_TRACES = '/traces';

const transformToUrlParameters = (obj) => {
  let arr = [];
  _.forOwn(obj, (value, key) =>
    arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));
  return arr.join('&');
};

const checkStatus = (response) => {
  // FIXME: Once the fetch polyfill supports response.ok, change to that.
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(response.statusText);
};

const post = (url, payload) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(payload)
  })
  .then(checkStatus);
};

const get = (urlBeforeParameters, parameters) => {
  let url = urlBeforeParameters;
  if (parameters) {
    url += '?' + transformToUrlParameters(parameters);
  }
  return fetch(url, {
    headers: {
      'Accept': 'application/json'
    },
    mode: 'cors'
  })
  .then(checkStatus);
};

const getPlan = (baseUrl, planId) => {
  const url = baseUrl + ENDPOINT_PLANS + '/' + planId;
  return get(url, null);
};

const sendPlan = (baseUrl, payload) => {
  const url = baseUrl + ENDPOINT_PLANS;
  return post(url, payload);
};

const sendOneOrMoreTraces = (baseUrl, payload) => {
  const url = baseUrl + ENDPOINT_TRACES;
  return post(url, payload);
};

const sendOneOrMoreRoutes = (baseUrl, payload) => {
  const url = baseUrl + ENDPOINT_ROUTES;
  return post(url, payload);
};

const getSpeedAverages = (baseUrl, parameters) => {
  const url = baseUrl + ENDPOINT_SPEEDS;
  return get(url, parameters);
};

export {
  getPlan,
  getSpeedAverages,
  sendOneOrMoreRoutes,
  sendOneOrMoreTraces,
  sendPlan
};
