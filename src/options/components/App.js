import { h } from 'hyperapp';

import Badge from './Badge';
import FormField from './FormField';
import FormControl from './FormControl';

const handleResetClick = (fields, saveOptions) => () => {
  const defaultOptions = fields.reduce(
    (opts, { key, defaultValue }) => ({
      ...opts,
      [key]: defaultValue,
    }),
    {},
  );

  saveOptions(defaultOptions);
};

const App = () => ({ fields, options, exampleValues }, actions) =>
  h('div', null,
    h('section', { class: 'hero is-primary' },
      h('div', { class: 'hero-body' },
        h('div', { class: 'container' },
          h('h1', { class: 'title is-3' }, 'Options'),
          h('h2', { class: 'subtitle is-5' }, 'Tab Badge'),
        ),
      ),
    ),
    h('section', { class: 'section' },
      h('div', { class: 'container' },
        h('div', { class: 'box' },
          h('h3', { class: 'title is-4' }, 'Example'),
          h(FormField, null,
            h(Badge, { badgeNum: exampleValues.badgeNum, options }),
          ),
          h(FormField, { label: 'Badge number', labelFor: 'badgeNum' },
            h(FormControl, {
              type: 'number',
              id: 'badgeNum',
              value: exampleValues.badgeNum,
              onChange: actions.setExampleValue,
            }),
          ),
          h('hr', null),
          h('h3', { class: 'title is-4' }, 'Options'),
          fields.map(({ key, label, ...field }) =>
            h(FormField, { key, label, labelFor: key },
              h(FormControl, {
                id: key,
                value: options[key],
                onChange: actions.saveOption,
                ...field,
              }),
            ),
          ),
          h(FormField, null,
            h('button', {
              class: 'button is-primary',
              onclick: handleResetClick(fields, actions.saveOptions),
            }, 'Reset to defaults'),
          ),
        ),
      ),
    ),
  );

export default App;
