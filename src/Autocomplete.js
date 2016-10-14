import React from 'react';
import { css } from 'aphrodite';

import styles from './Autocomplete.styles.js';

type Props = {
  dataSource: Array<Object>;
  searchTerm: string;
  filter: (searchTerm: string, dataSource: Array<Object>) => Array<Object>;
  onChange: (searchTerm: string) => void;
  onAcceptSelection: (option?: Object) => void;
  placeholder: string;
  maxAutocompletionOptions: number;
  maxHeight: number;
}

const initialState = {
  isFocused: false,
  activeIndex: undefined,
};

export default class Autocomplete extends React.Component {
  props: Props;

  state = { ...initialState };

  resetState = () => this.setState({ ...initialState })

  handleKeyDown = event => {
    const handler = this.keyHandlers[event.key];
    if (!handler) return;

    handler(event);
    event.preventDefault();
  }

  keyHandlers = {
    ArrowDown: _ => this.setState(state => ({
      activeIndex: state.activeIndex === undefined
        ? 0
        : state.activeIndex === lastIndex(this.filteredData())
          ? state.activeIndex
          : state.activeIndex + 1
    })),
    ArrowUp: _ => this.setState(state => ({
      activeIndex: (state.activeIndex === undefined)
        ? undefined
        : state.activeIndex === 0
          ? state.activeIndex
          : state.activeIndex - 1
    })),
    Enter: _ => {
      if (isEmpty(this.filteredData())) return;
      this.handleAcceptSelection(this.state.activeIndex);
    },
    Escape: _ => this.closePopover(),
  };

  // Thought: Should our filter actually be the iteratee applied
  // in a filter on the data array instead?
  filteredData = () =>
    take(this.props.maxAutocompletionOptions, this.props.filter(
      this.props.searchTerm,
      this.props.dataSource,
    ))

  activateOption = (index) => {
    this.setState({ activeIndex: index });
  }

  handleAcceptSelection = (idx) => {
    const selectedOption = this.filteredData()[idx];
    this.props.onAcceptSelection(selectedOption);
    this.closePopover();
  }

  closePopover = () => {
    this.resetState();
    this.input.blur();
  }

  handleOptionMouseDown = (idx) => this.handleAcceptSelection(idx);

  toggleFocus = (event) => {
    event.preventDefault();
    if (!this.state.isFocused) {
      this.input.focus();
    } else {
      this.closePopover();
    }
  }

  handleBlur = () => {
    this.resetState();
    this.props.onChange('');
  }

  render() {
    const filteredData = this.filteredData();

    return (
      <div className={css(styles.root)}>
        <div style={{ position: 'relative' }}>
          <input
            ref={node => this.input = node}
            value={this.props.searchTerm}
            onChange={event => this.props.onChange(event.target.value)}
            onFocus={_ => this.setState({ isFocused: true })}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.placeholder}
            className={css(
              styles.input,
              this.state.isFocused && styles.inputFocused,
              (this.state.isFocused && isEmpty(filteredData)) && styles.noResults,
            )}
          />
          {!(this.state.isFocused && isEmpty(filteredData)) && (
            <div
              onMouseDown={this.toggleFocus}
              className={css(styles.arrow)}
            />
          )}
        </div>
      {this.state.isFocused && !isEmpty(filteredData) && (
        <div className={css(styles.popover)}>
          <div
            className={css(styles.list)}
            style={this.props.maxHeight ? { maxHeight: this.props.maxHeight } : {}}
          >
            {filteredData.map((data, idx) => (
              <div
                key={data.value}
                className={css(
                  styles.listItem,
                  idx === this.state.activeIndex && styles.listItemActive
                )}
                onMouseDown={_ => this.handleOptionMouseDown(idx)}
                onMouseOver={_ => this.activateOption(idx)}
              >
                {data.value}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    )
  }
}

// Helpers
function isEmpty(list) {
  return list.length === 0;
}

// cases
// []
// [1]
// [1,2,3]
function lastIndex(list) {
  return (list.length > 0) ?
    list.length - 1 :
    0;
}

// :: (number, T[]) -> T[]
function take(n, xs) {
  if (n < 1 || isEmpty(xs)) return [];
  return [head(xs), ...take(n - 1, tail(xs))];
}

// :: T[] -> T | undefined
function head(xs) {
  return xs[0];
}

// :: T[] -> T[]
function tail(xs) {
  return xs.slice(1);
}
