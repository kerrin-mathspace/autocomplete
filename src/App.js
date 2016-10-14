import React, { Component } from 'react';
import Autocomplete from './Autocomplete.js';

let list = [
  { value: 'hey' },
  { value: 'hoo' },
  { value: 'holly' },
  { value: 'hey1' },
  { value: 'hoo1' },
  { value: 'holly1' },
  { value: 'hey2' },
  { value: 'hoo2' },
  { value: 'holly2' },
];
list = list.concat(list.map(item => ({ value: item.value + '3' })));

class App extends Component {
  state = {
    list,
    searchTerm: '',
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <Autocomplete
          dataSource={this.state.list}
          searchTerm={this.state.searchTerm}
          filter={(term, data) =>
            data.filter(item => item.value.includes(term))}
          onChange={searchTerm => this.setState({ searchTerm })}
          onAcceptSelection={(option) => {
            this.setState({ searchTerm: option ? option.value : '' });
          }}
          placeholder="Select a hint... (type to narrow down the list of options)"
          // maxAutocompletionOptions={4}
          maxHeight={200}
        />
        <div>
          <h1>Bunch of stuff</h1>
          <p>To test that we go over</p>
          <p>To test that we go over</p>
          <p>To test that we go over</p>
          <p>To test that we go over</p>
        </div>
      </div>
    );
  }
}

export default App;
