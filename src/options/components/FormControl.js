import { h } from 'hyperapp';

const getTargetValue = ({ type, value }) => {
  switch (type) {
    case 'number':
      return parseInt(value, 10);
    default:
      return value;
  }
};

const FormControl = ({ type, id, name, value, options, onChange }) => {
  const handleChange = ({ target }) => {
    const newValue = getTargetValue(target);

    if (newValue !== value) onChange({ name: target.name, value: newValue });
  };

  if (type === 'select') {
    return h('div', { class: 'control' },
      h('div', { class: 'select is-fullwidth' },
        h('select', { id, name: name || id, value, onchange: handleChange },
          options.map(opt =>
            h('option', { key: opt.value, value: opt.value }, opt.label),
          ),
        ),
      ),
    );
  }

  const handleInput = e => {
    if (e.target.value) handleChange(e);
  };

  const handleBlur = e => {
    if (e.target.value) handleChange(e);
    else {
      e.target.value = value;
    }
  };

  return h('div', { class: 'control' },
    h('input', {
      type,
      id,
      class: 'input',
      name: name || id,
      value,
      oninput: handleInput,
      onblur: handleBlur,
    }),
  );
};

export default FormControl;
