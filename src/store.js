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

const LOCAL_STORAGE_SYNC_INTERVAL_IN_FIXES = 20;
const LOCAL_STORAGE_KEY = 'maas.js_fixes';

/**
 * Stores fixes for later retrieval. Syncs every localStorageSyncIntervalInFixes
 * into localStorage.
 */
const createFixStorage =
  (localStorageSyncIntervalInFixes = LOCAL_STORAGE_SYNC_INTERVAL_IN_FIXES,
   localStorageKey = LOCAL_STORAGE_KEY) => {
  let fixesInMemory = [];
  let nFixesSinceSync = 0;

  /**
   * Transform an array of fixes into a string.
   */
  const transformFixesToString = (fixes) => {
    return JSON.stringify(fixes);
  };

  /**
   * Transform a string into an array of fixes.
   */
  const transformStringToFixes = (string) => {
    return JSON.parse(string);
  };

  const syncToLocalStorage = () => {
    if (!_.isEmpty(fixesInMemory)) {
      const filedString = localStorage.getItem(localStorageKey);
      let toFileFixes;
      if (filedString) {
        const filedFixes = transformStringToFixes(filedString);
        toFileFixes = filedFixes.concat(fixesInMemory);
      } else {
        toFileFixes = fixesInMemory;
      }
      const toFileString = transformFixesToString(toFileFixes);
      localStorage.setItem(localStorageKey, toFileString);
      fixesInMemory = [];
    }
  };

  const storeFix = (fix) => {
    fixesInMemory.push(fix);
    if (nFixesSinceSync >= localStorageSyncIntervalInFixes) {
      nFixesSinceSync = 0;
      syncToLocalStorage();
    } else {
      ++nFixesSinceSync;
    }
  };

  const getFixes = () => {
    const filedString = localStorage.getItem(localStorageKey);
    let toGiveFixes;
    if (filedString) {
      const filedFixes = transformStringToFixes(filedString);
      toGiveFixes = filedFixes.concat(fixesInMemory);
    } else {
      toGiveFixes = _.clone(fixesInMemory);
    }
    return toGiveFixes;
  };

  const purgeAllFixes = () => {
    localStorage.removeItem(localStorageKey);
    fixes = [];
  };

  return {
    getFixes,
    purgeAllFixes,
    storeFix,
    syncToLocalStorage
  };
};

export {createFixStorage};
