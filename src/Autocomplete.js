import React from 'react';
import { css } from 'aphrodite';

import styles from './Autocomplete.styles.js';

type Props = {
  dataSource: Array<Object>;
  searchTerm: string;
  filter: (searchTerm: string, dataSource: Array<Object>) => Array<Object>;
  onChange: (searchTerm: string) => void;
  onOptionChosen: (option?: Object) => void;
  placeholder: string;
  maxAutocompletionOptions: number;
  maxHeight: number;
}

type State = {
  isFocused: boolean;
  activeIndex?: number;
}

const initialState: State = {
  isFocused: false,
  activeIndex: undefined,
};

export default class Autocomplete extends React.Component {
  props: Props;
  state: State;
  lastChosenOption: Object;
  shouldDiscardNextBlurEvent: boolean;
  input: HTMLElement;

  state = {
    ...initialState,
  };

  componentWillReceiveProps(nextProps) {
    const nextFilteredData = this.getFilteredData(nextProps);
    this.setState({ activeIndex: isEmpty(nextFilteredData) ? undefined : 0 });
  }

  resetState = () => this.setState({ ...initialState })

  handleKeyDown = event => {
    const handler = this.keyHandlers[event.key];
    if (!handler) return;

    handler(event);
    event.preventDefault();
  }

  // :: { [keyName: string]: function }
  keyHandlers = {
    ArrowDown: () => this.setState(state => {
      const clampIndex = clamp(0, lastIndex(this.getOptions()));
      return {
        activeIndex: (state.activeIndex === undefined) ?
          0 :
          clampIndex(state.activeIndex + 1)
      };
    }),
    ArrowUp: () => this.setState(state => {
      const clampIndex = clamp(0, lastIndex(this.getOptions()));
      return {
        activeIndex: (state.activeIndex === undefined) ? undefined
          : clampIndex(state.activeIndex - 1)
      };
    }),
    Enter: () => {
      if (isEmpty(this.getFilteredData(this.props))) return;
      this.handleOptionChosen(this.state.activeIndex);
    },
    Escape: () => {
      if (this.lastChosenOption) {
        this.props.onChange(this.lastChosenOption.value);
      } else {
        this.props.onChange('');
      }

      this.shouldDiscardNextBlurEvent = true;
      this.closePopover()
    },
  };

  filteredData = () =>
    take(this.props.maxAutocompletionOptions, this.props.filter(
      this.props.searchTerm,
      this.props.dataSource,
    ))

  getFilteredData = (props) => props.filter(props.searchTerm, props.dataSource)

  getOptions = () => take(
    this.props.maxAutocompletionOptions,
    this.getFilteredData(this.props),
  )

  activateOption = (index) => {
    this.setState({ activeIndex: index });
  }

  handleOptionChosen = (idx) => {
    // const selectedOption = this.filteredData()[idx];
    const selectedOption = this.getFilteredData(this.props)[idx];


    this.lastChosenOption = selectedOption;
    this.shouldDiscardNextBlurEvent = true;

    this.props.onOptionChosen(selectedOption);
    this.closePopover();
  }

  closePopover = () => {
    this.resetState();
    this.input.blur();
  }

  handleOptionMouseDown = (idx) => this.handleOptionChosen(idx);

  toggleFocus = (event) => {
    event.preventDefault();
    if (!this.state.isFocused) {
      this.input.focus();
    } else {
      this.closePopover();
    }
  }

  handleBlur = (event) => {
    if (this.shouldDiscardNextBlurEvent) {
      this.shouldDiscardNextBlurEvent = false;
      return;
    }

    this.resetState();

    // Clear out any text in the input field UNLESS we had previously chosen an
    // an option and we haven't modified the text in any way.
    if (!this.lastChosenOption || this.lastChosenOption.value !== this.props.searchTerm) {
      this.props.onChange('');
    }
  }

  handleFocus = () => {
    const filteredData = this.getFilteredData(this.props);
    this.setState({
      isFocused: true,
      activeIndex: isEmpty(filteredData) ? undefined : 0
    });
  }

  render() {
    const options = this.getOptions();

    return (
      <div className={css(styles.root)}>
        <div className={css(styles.inputWrapper)}>
          <input
            ref={node => this.input = node}
            value={this.props.searchTerm}
            onChange={event => this.props.onChange(event.target.value)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.placeholder}
            className={css(
              styles.input,
              this.state.isFocused && styles.inputFocused,
              (this.state.isFocused && isEmpty(options)) && styles.noResults,
            )}
          />
          {!(this.state.isFocused && isEmpty(options)) && (
          <div
            className={css(styles.arrowWrapper)}
            onMouseDown={this.toggleFocus}
          >
            <svg
              width="10"
              height="5"
              viewBox="0 0 10 5"
              className={css(
                styles.arrow,
                this.state.isFocused && styles.arrowOpen
              )}
              >
              <polygon fill="currentColor" points="0,0 10,0 5,5 0,0" />
            </svg>
          </div>
          )}
        </div>
      {this.state.isFocused && !isEmpty(options) && (
        <div className={css(styles.popover)}>
          <div
            className={css(styles.list)}
            style={this.props.maxHeight ? { maxHeight: this.props.maxHeight } : {}}
          >
            {options.map((data, idx) => (
              <div
                key={idx}
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

// :: T[] -> boolean
function isEmpty(list) {
  return list.length === 0;
}

// :: T[] -> number
function lastIndex(list) {
  return (list.length > 0) ?
    list.length - 1 :
    0;
}

// :: (number, T[]) -> T[]
function take(n, xs) {
  if (n < 1 || isEmpty(xs)) return [];
  return xs.slice(0, n);
}

// :: (number, number) -> number -> number
// Produces a function whose argument will be clamped to the range [low, hi]
function clamp(low, hi) {
  return (n) => Math.min(Math.max(low, n), hi);
}
