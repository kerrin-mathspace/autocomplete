import { StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  input: {
    outline: 'none',
    border: '1px solid rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    fontSize: 14,
    padding: '8px 12px',
    display: 'block',
    width: '100%',
    transition: 'all 150ms ease',
  },
  inputFocused: {
    border: '1px solid rgb(0, 132, 255)',
    // boxShadow: '0 0 0 3px rgba(0, 126, 255, 0.1)',
  },
  popover: {
    background: '#fff',
    boxShadow: '1px 1px 1px rgba(0,0,0,.05), -1px -1px 1px rgba(0,0,0,.05), 0 1px 3px rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    marginTop: 10,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  list: {
    padding: '5px 0',
  },
  listItem: {
    padding: 10,
    transition: 'all 150ms ease',
    ':hover': {
      cursor: 'default',
    },
  },
  listItemActive: {
    // background: 'rgba(0, 126, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.05)',
    // color: 'rgb(0, 132, 255)',
    color: '#222',
  },
});

export default styles;
