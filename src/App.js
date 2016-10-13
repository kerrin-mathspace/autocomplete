import React, { Component } from 'react';
import Autocomplete from './Autocomplete.js';

class App extends Component {
  state = {
    list: [
      { value: 'hey' },
      { value: 'hoo' },
      { value: 'holly' },
      { value: 'hey1' },
      { value: 'hoo1' },
      { value: 'holly1' },
      { value: 'hey2' },
      { value: 'hoo2' },
      { value: 'holly2' },
    ],
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
          onAcceptSelection={option => this.setState({ searchTerm: option.value })}
          placeholder="Search for a hint"
          maxAutocompletionOptions={4}
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
