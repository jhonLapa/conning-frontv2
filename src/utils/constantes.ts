import { StylesConfig } from 'react-select';

// Si tus opciones son de tipo { label: string; value: string }
export const defaultSelectStyles: StylesConfig<any, false> = {
  control: (base, state) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : base.boxShadow,
    borderColor: state.isFocused ? '#2684FF' : base.borderColor,
    minHeight: '38px'
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px'
  })
};