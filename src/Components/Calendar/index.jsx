import React, {Component} from 'react';
import moment from 'moment'
import './calender.css'

class Calendar extends Component {

  constructor(props) {
    super(props)
    this.width = props.width || "350px";
    this.style = props.style || {}
    this.style.width = this.width
  }

  state = {
    dateContext: moment(),
    showMonthPopup: false,
    showYearPopup: false,

    titleEvent: "",
    descEvent: "",
    dateEvent: "",

    dataEvent: []
  }

  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort();
  months = moment.months();

  year = () => {
    return this.state.dateContext.format('Y');
  }

  month = () => {
    return this.state.dateContext.format('MMMM');
  }

  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  }

  currentDate = () => {
    return this.state.dateContext.get('date');
  }

  currentDay = () => {
    return this.state.dateContext.format('D')
  }

  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext).startOf('month').format('d')  
    return firstDay
  }

  // Start Change Month
  setMonth = (month) => {
    let monthNo = this.months.indexOf(month)
    let dateContext = Object.assign({}, this.state.dateContext)
    dateContext = moment(dateContext).set('month', monthNo)
    this.setState({
      dateContext : dateContext
    })
    
  }

  onSelectChange = (e, data) => {
    this.setMonth(data)
    this.props.onChangeMonth && this.props.onChangeMonth()
  }

  selectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a href="#" onClick={(e) => this.onSelectChange(e, data)}>
            {data}
          </a>
        </div>
      )
    })

    return (
      <div className="month-popup">
        {popup}
      </div>
    )
  }

  onChangeMonth = (e, month) => {
    this.setState({
      showMonthPopup: !this.state.showMonthPopup
    })
  } 

  monthNav = () => {
    return (
      <span className="label-month" onClick={(e) => this.onChangeMonth(e, this.month())}>
        {this.month()}
        {this.state.showMonthPopup &&
          <this.selectList data={this.months}/>
        }
      </span>
    )
  }
  //End Change Month

  //Start Change Year
  showYaerEditor = () => {
    this.setState({
      showYearNav: true
    })
  }

  setYear = (year) => {
    let dateContext = Object.assign({}, this.state.dateContext)
    dateContext = moment(dateContext).set('year', year)
    this.setState({
      dateContext : dateContext
    })
  }

  onYearChange = (e) => {
   this.setYear(e.target.value);
  //  this.props.onYearChange && this.props.onYearChange(e, e.target.value )
  } 

  onKeyUpyear = (e) => {
    if(e.which === 13 || e.which === 27) {
      this.setYear(e.target.value)
      this.setState({
        showYearNav: false
      })
    }
    
  }
  //End Change Year

  nextMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext)
    dateContext = moment(dateContext).add(1, 'month')
    this.setState({
      dateContext: dateContext
    })
  }

  prevMonth = () => {
    let dateContext = Object.assign({}, this.state.dateContext)
    dateContext = moment(dateContext).subtract(1, 'month')
    this.setState({
      dateContext: dateContext
    })
  }

  yearNav = () => {
    return (
      this.state.showYearNav ? 
      <input
            defaultValue={this.year()}
            className="editor-year"
            ref={(yearinput) => {this.yearinput = yearinput}}
            onKeyUp={(e) => this.onKeyUpyear(e)}
            onChange={(e) => this.onYearChange(e)}
            type="number"
            placeholder="year"/>
      :
      <span
          className="label-year"
          onDoubleClick={(e) => {this.showYaerEditor()}}>
        {this.year()}
      </span>
    )
  }
  
  // Action Event
  openModalCreateEvent = (numDate) => {
    let dateContext = Object.assign({}, this.state.dateContext)
    dateContext = moment(dateContext).set('date', numDate)
    let onDate = dateContext._d
    
    this.setState({
      dateEvent: new Date(onDate)
    })
  }

  setStateCreate = (key, e) => {
    this.setState({
      [key] : e.target.value
    })
  }

  actCreateEvent = () => {
    let dataEvent = {
      title: this.state.titleEvent,
      desc: this.state.descEvent,
      date: this.state.dateEvent
    }

    this.setState({
      titleEvent: "",
      descEvent: "",
      dateEvent: "",
      dataEvent: [...this.state.dataEvent, dataEvent]
    })

  }

  openModaDetailEvent = (title, desc, date) => {
    this.setState({
      titleEvent: title,
      descEvent: desc,
      dateEvent: date
    })
  }

  render() {

    let weekdays = this.weekdaysShort.map((day) => {
      return (
        <td key={day} className="week-day">{day}</td>
      )
    })

    let blanks = []
    for(let i = 0; i < this.firstDayOfMonth(); i++){
      blanks.push(<td key={i *  80} className="emptySlot">{""}</td>)
    }

    let daysInMonth = []
    for(let j = 1; j <= this.daysInMonth(); j++){
      // let className = (j === Number(this.currentDay()) ? "day current-day" : "day")
      daysInMonth.push(
        <td key={j} className="day">
          <span  data-toggle="modal" data-target="#createEventModal" onClick={() => this.openModalCreateEvent(j)}>{j}</span>
        </td>
      )

    }

    if(this.state.dataEvent.length > 0) {

      for(let j = 1; j <= this.daysInMonth(); j++){

        for(let dateTemp = 0; dateTemp < this.state.dataEvent.length; dateTemp++){

          let date = new Date(this.state.dataEvent[dateTemp].date).getDate()
          let month = new Date(this.state.dataEvent[dateTemp].date).getMonth()
          let year = new Date(this.state.dataEvent[dateTemp].date).getFullYear()
          let secondMonth = moment.months().indexOf(this.month())
  
          if(date === j && Number(secondMonth) === Number(month) && String(year) === this.year()) {
    
            let index = daysInMonth.map(function(e) { return e.key; }).indexOf(String(daysInMonth[j-1].key));    
            daysInMonth.splice(index, 1,  <td key={j} className="day current-day">
              <span  data-toggle="modal" data-target="#createEventModal" onClick={() => this.openModaDetailEvent(this.state.dataEvent[dateTemp].title, this.state.dataEvent[dateTemp].desc, this.state.dataEvent[dateTemp].date)}>{j}</span>
            </td>)
          }
      
        }

      }
      
    }

    let totalSlots = [...blanks, ...daysInMonth]
   
    let rows = []
    let cells = []

    totalSlots.forEach((row, i) => {
      if((i % 7 !== 0)){       
        cells.push(row)
      } else {
        let insertRow = cells.slice()
        rows.push(insertRow)
        cells = []
        cells.push(row)
      }

      if(i === totalSlots.length - 1){
        let insertRow = cells.slice()
        rows.push(insertRow)
      }
    })

    let trElements = rows.map((d, i) => {
      return (
        <tr key={i * 100}>
          {d}
        </tr>
      )
    })
    

    return (
      <div className="calendar-container" style={this.style}>
        <table className="calendar">
          <thead>
            <tr className="calenda r-header">
              <td colSpan="5">
                <this.monthNav/>
                {" "}
                <this.yearNav/>
              </td>
              <td colSpan="2" className="nav-month">
                <i className="prev fa fa-fw fa-chevron-left"
                   onClick={(e) => {this.prevMonth()}}></i>
                <i className="prev fa fa-fw fa-chevron-right"
                   onClick={(e) => {this.nextMonth()}}></i>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekdays}
            </tr>
            {trElements}
          </tbody>
        </table>


        {/* MODAL CREATE */}
        <div className="modal fade" id="createEventModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Event</h5>
              </div>
              <div className="modal-body">
                  <div className="form-group">
                    <label>Event Name</label>
                    <input value={this.state.titleEvent} onChange={(e) => this.setStateCreate('titleEvent', e)} type="text" className="form-control"/>
                  </div>
                  <div className="form-group">
                    <label>Event Description</label>
                    <textarea value={this.state.descEvent} onChange={(e) => this.setStateCreate('descEvent', e)} className="form-control" rows="3"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input defaultValue={this.state.dateEvent} type="text" className="form-control" readOnly/>
                  </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button onClick={() => this.actCreateEvent()} data-dismiss="modal" type="button" className="btn btn-primary">Create Event</button>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    );
  }
}

export default Calendar