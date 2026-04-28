import { h, app } from 'hyperapp';

import OPTIONS from '../constants/options';

import actions from './actions';
import App from './components/App';

const { storage } = browser;

const run = options => {
  const state = {
    fields: OPTIONS,
    options,
    exampleValues: {
      badgeNum: 15,
    },
  };

  const view = () => h(App, null);

  app(state, actions, view, document.getElementById('main'));
};

storage.local.get().then(run);
