import 'regenerator-runtime';
import 'core-js/modules/es.promise';
import 'core-js/modules/es.array.iterator';
import 'pepjs';

import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import './i18n';

import App from './App';

ReactDOM.render(<App />, document.getElementById('app'));
