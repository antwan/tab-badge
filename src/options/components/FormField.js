import { h } from 'hyperapp';

const FormField = ({ label, labelFor }, children) =>
  h('div', { class: 'field is-horizontal' },
    h('div', { class: 'field-label is-normal' },
      label && h('label', { for: labelFor, class: 'label' }, label),
    ),
    h('div', { class: 'field-body' },
      h('div', { class: 'field is-narrow' }, children),
    ),
  );

export default FormField;
