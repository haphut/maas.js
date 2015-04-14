/**
 * Use this file to browserify a global object.
 */

import maas from '../index';

var maasInWindow = window.maas || {};
maasInWindow = maas;
window.maas = maasInWindow;
