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

/**
 * Stores objects for later retrieval. The objects are stored in memory before
 * synchronizing them to localStorage. The synchronization is done either once n
 * objects have been stored since last synchronization or once t seconds have
 * passed since last synchronization, whichever happens first.
 *
 * The objects to be stored must be serializable to strings with JSON.stringify.
 *
 * This function does NOT remove previous data stored with the same localStorage
 * key. This is to enable storing data with the same key over several sessions.
 *
 * It is recommended not to modify localStorage with the given key without using
 * the functions provided by createSyncStorage.
 *
 * @param localStorageKey {String} The key under which the data will be stored
 *   in localStorage.
 * @param syncIntervalInObjects {Number} The objects stored in memory will be
 *   synced to localStorage once syncIntervalInObjects objects have been
 *   received since last synchronization. The value must be a positive number.
 *   Value Infinity means that synchronization is not done unless
 *   syncIntervalInSeconds has a finite value. Default value of
 *   syncIntervalInObjects is 1 so that synchronization is done every time an
 *   object is stored.
 * @param syncIntervalInSeconds {Number} The objects stored in memory will be
 *   synced to localStorage once syncIntervalInSeconds seconds have passed since
 *   last synchronization. The value must be a positive Number. Default value of
 *   syncIntervalInSeconds is 20. Due to the limitations of setTimeout any given
 *   value above 2147483 (about 25 days) will result in turning off time-based
 *   synchronizing.
 */
const createSyncStorage = (localStorageKey, syncIntervalInObjects = 1,
                           syncIntervalInSeconds = 20) => {
  if (!_.isString(localStorageKey)) {
    throw new Error('localStorageKey must be a string.');
  }
  if (!_.isNumber(syncIntervalInObjects) || syncIntervalInObjects <= 0) {
    throw new Error('syncIntervalInObjects must be a positive number.');
  }
  if (!_.isNumber(syncIntervalInSeconds) || syncIntervalInSeconds <= 0) {
    throw new Error('syncIntervalInSeconds must be a positive number.');
  }

  // setTimeout expects a 32-bit int so the highest sensible value in
  // milliseconds is 2147483647.
  const isTimerValid = syncIntervalInSeconds <= 2147483;
  const syncIntervalInMilliseconds = 1e3 * syncIntervalInSeconds;

  let memory = [];
  let nObjectsSinceSync = 0;
  let hasTimePassed = false;
  let timeoutId = null;

  const transformToString = JSON.stringify;

  const transformToArray = JSON.parse;

  /**
   * Concatenate the array in memory onto the array in localStorage. Empty the
   * memory in array.
   */
  const forceSync = () => {
    if (!_.isEmpty(memory)) {
      const filedString = localStorage.getItem(localStorageKey);
      let toFile;
      if (filedString) {
        const filedObjects = transformToArray(filedString);
        toFile = filedObjects.concat(memory);
      } else {
        toFile = memory;
      }
      const toFileString = transformToString(toFile);
      localStorage.setItem(localStorageKey, toFileString);
      memory = [];
    }
  };

  /**
   * If there are any objects stored in memory, synchronize now. Otherwise set a
   * flag for store() to synchronize on next received object.
   */
  const syncOrFlag = () => {
    if (_.isEmpty(memory)) {
      // store() has the responsibility to set this flag back to false.
      hasTimePassed = true;
    } else {
      forceSync();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(syncOrFlag, syncIntervalInMilliseconds);
    }
  };

  /**
   * Set the synchronization timer.
   */
  const setTimer = () => {
    if (isTimerValid) {
      hasTimePassed = false;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(syncOrFlag, syncIntervalInMilliseconds);
    }
  };

  /**
   * Add a new object into memory. If synchronization conditions are met,
   * synchronize.
   */
  const store = (object) => {
    memory.push(object);
    ++nObjectsSinceSync;
    if (nObjectsSinceSync >= syncIntervalInObjects || hasTimePassed) {
      forceSync();
      setTimer();
      nObjectsSinceSync = 0;
    }
  };

  /**
   * Return the objects from localStorage and memory, concatenated in that
   * order.
   */
  const getAll = () => {
    const filedString = localStorage.getItem(localStorageKey);
    let toGive;
    if (filedString) {
      const filedObjects = transformToArray(filedString);
      toGive = filedObjects.concat(memory);
    } else {
      toGive = _.cloneDeep(memory);
    }
    return toGive;
  };

  /**
   * Remove all objects from localStorage and memory.
   */
  const purgeAll = () => {
    localStorage.removeItem(localStorageKey);
    memory = [];
  };

  // Set the initial timer.
  setTimer();

  return {
    forceSync,
    getAll,
    purgeAll,
    store
  };
};

export {createSyncStorage};
