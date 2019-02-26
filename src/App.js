import React, { Component } from 'react';
import './App.css';
import MyCalendar from './Calendar/Calendar';

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      dataPickFlag: false
    }
  }
 /*  componentDidMount() {
    document.addEventListener('click', this.handleCalendar()) //window
  }
  componentWillMount() {
    document.removeEventListener('click', this.handleCalendar());
  }
 */
  handleCalendar = () => {
    console.log(11)
    this.setState({
      dataPickFlag: false
    })
    console.log(this.state.dataPickFlag)
  }
  render() {
    return (
      <div className="App" onClick={this.handleCalendar.bind(this)}>
        111
        <hr></hr>
        <MyCalendar dataPickFlag={this.state.dataPickFlag} />
      </div>
    );
  }
}

export default App;
