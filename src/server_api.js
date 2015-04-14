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

import _ from 'lodash';

import {
  getPlan,
  sendPlan,
  sendOneOrMoreTraces,
  sendOneOrMoreRoutes,
  getSpeedAverages,
} from './internal_server_api.js';

const addReportParameters = (parameters, after, before, type) => {
  if (after) {
    parameters.after = after.toISOString();
  }
  if (before) {
    parameters.before = before.toISOString();
  }
  if (type) {
    parameters.type = type;
  }
  return parameters;
};

const getSpeedAveragesForBoundary = (baseUrl, boundary, after, before, type,
                                     callback) => {
  let parameters = {
    boundary_sw_lon: boundary.swLongitude, // jshint ignore:line
    boundary_sw_lat: boundary.swLatitude, // jshint ignore:line
    boundary_ne_lon: boundary.neLongitude, // jshint ignore:line
    boundary_ne_lat: boundary.neLatitude // jshint ignore:line
  };
  parameters = addReportParameters(parameters, after, before, type);
  return getSpeedAverages(baseUrl, parameters, callback);
};

const getSpeedAveragesForItinerary = (baseUrl, itineraryId, after, before, type,
                                      callback) => {
  let parameters = {
    planID: itineraryId
  };
  parameters = addReportParameters(parameters, after, before, type);
  return getSpeedAverages(baseUrl, parameters, callback);
};

const sendFixes = (baseUrl, journeyId, fixes, callback) => {
  const payload = _.map(fixes, fix => {
    const coordinates = fix.geometry.coordinates;
    let obj = {
      journey_id: journeyId, // jshint ignore:line
      longitude: coordinates[0],
      latitude: coordinates[1],
      timestamp: fix.properties.timestamp.toISOString()
    };
    if (coordinates.length > 2) {
      obj.altitude = coordinates[2];
    }
    return obj;
  });
  return sendOneOrMoreTraces(baseUrl, payload, callback);
};

const sendItinerary = (baseUrl, journeyId, lineString, timestamp, callback) => {
  const payload = {
    journey_id: journeyId, // jshint ignore:line
    coordinates: lineString.geometry.coordinates,
    timestamp: timestamp.toISOString()
  };
  return sendPlan(baseUrl, payload, callback);
};

const sendSegments = (baseUrl, journeyId, segments, analysisName, modes,
                      callback) => {
  const payload = _(segments)
    .zip(modes)
    .map(([segment, mode]) => {
      const start = segment.start;
      const end = segment.end;
      return {
        journey_id: journeyId, // jshint ignore:line
        coordinates: [start.geometry.coordinates, end.geometry.coordinates],
        timestamp: end.properties.timestamp.toISOString(),
        speed: segment[analysisName],
        mode
      };
    })
    .value();
  return sendOneOrMoreRoutes(baseUrl, payload, callback);
};

const createConnector = (baseUrl) => {
  const setUrl = (f) => _.partial(f, baseUrl);
  return {
    getItinerary: setUrl(getPlan),
    getSpeedAveragesForBoundary: setUrl(getSpeedAveragesForBoundary),
    getSpeedAveragesForItinerary: setUrl(getSpeedAveragesForItinerary),
    sendFixes: setUrl(sendFixes),
    sendItinerary: setUrl(sendItinerary),
    sendSegments: setUrl(sendSegments)
  };
};

export {createConnector};
