import { useState, useEffect } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import './style/ScheduleViewer.css'

// Icons
import leftArrow from '../../assets/icon/chevron_left.svg'
import rightArrow from '../../assets/icon/chevron_right.svg'
import pinacLogo from '../../assets/icon/pinac-logo.png'

export const ScheduleViewer = (props) => {
  const [currentDate, setCurrentDate] = useState(moment())
  const [currentView, setCurrentView] = useState('month')

  useEffect(() => {
    // Perform any necessary side effects when the current date or view changes
  }, [currentDate, currentView])

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'))
  }

  const handlePreviousWeek = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'week'))
  }

  const handleNextWeek = () => {
    setCurrentDate(currentDate.clone().add(1, 'week'))
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  const renderMonthView = () => {
    const startOfMonth = currentDate.clone().startOf('month')
    const endOfMonth = currentDate.clone().endOf('month')
    const startDay = startOfMonth.day()
    const daysInMonth = endOfMonth.date()
    const days = []

    // Render day names
    const dayNames = []
    const weekdays = moment.weekdaysShort()
    weekdays.forEach((name, index) => {
      const isCurrentDayName = index === moment().day()

      dayNames.push(
        <div
          key={`day-name-${index}`}
          className={`month-day-name ${isCurrentDayName ? 'current' : ''}`}
        >
          {name}
        </div>
      )
    })

    // Add empty days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="month-day empty"></div>)
    }

    // Add days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.clone().date(i)
      const isCurrentDate = date.isSame(moment(), 'day')
      const eventsForDay = props.events.filter(
        (event) =>
          moment(event.start).isSame(date, 'day') ||
          (moment(event.start).isBefore(date) && moment(event.end).isAfter(date))
      )
      const hasEvents = eventsForDay.some((event) => event.type === 'event')
      const hasTasks = eventsForDay.some((event) => event.type === 'task')

      days.push(
        <div
          key={`day-${i}`}
          className={`month-day ${isCurrentDate ? 'current' : ''} ${
            hasEvents ? 'has-event' : ''
          } ${hasTasks ? 'has-task' : ''}`}
        >
          <div className="month-day-number">{i}</div>
        </div>
      )
    }

    return (
      <div className="calendar-month">
        <div className="month-day-names">{dayNames}</div>
        <div className="month-days">{days}</div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = currentDate.clone().startOf('week')
    const days = []

    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.clone().add(i, 'days')
      const isCurrentDate = date.isSame(moment(), 'day')

      days.push(
        <div key={`day-${i}`} className={`week-day ${isCurrentDate ? 'current' : ''}`}>
          {date.format('ddd')}
          <br />
          {date.format('DD')}
        </div>
      )
    }

    return <div className="calendar-week">{days}</div>
  }

  return (
    <div className="msg-row" key={`ai-${props.index}`}>
      <div className="msg-avatar">
        <img src={pinacLogo} alt="AI Avatar" />
      </div>
      <div className="msg-content">
        <div className="msg-name">PINAC</div>
        <div className={`schedule-content ${currentView === 'month' ? 'type1' : 'type2'}`}>
          {/* Calendar */}
          <div className="calendar-container">
            {/* Calendar View Buttons */}
            <div className="calendar-view-buttons">
              <button
                className={`month-view ${currentView == 'month' ? 'active' : ''}`}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
              <button
                className={`week-view ${currentView == 'week' ? 'active' : ''}`}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
            </div>
            <div className="calendar">
              <div className="calendar-header">
                <div className="header-left">
                  <span>{currentDate.format('MMMM YYYY')}</span>
                </div>

                <div className="header-right">
                  <button onClick={handlePreviousMonth}>
                    <img src={leftArrow} alt="Previous" className="non-changeable-icon" />
                  </button>
                  <button onClick={handleNextMonth}>
                    <img src={rightArrow} alt="Next" className="non-changeable-icon" />
                  </button>
                </div>
              </div>

              <div className="border-line"></div>

              <div className="calendar-body">
                {currentView === 'month' && renderMonthView(props.events)}
                {currentView === 'week' && (
                  <>
                    <div className="week-header-btn">
                      <button onClick={handlePreviousWeek}>
                        {' '}
                        <img src={leftArrow} alt="Previous" className="non-changeable-icon" />
                      </button>
                      <button onClick={handleNextWeek}>
                        {' '}
                        <img src={rightArrow} alt="Next" className="non-changeable-icon" />
                      </button>
                    </div>
                    {renderWeekView()}
                    {'\nWe will add this view very soon...'}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Description */}
          <div className="schedule-desc msg-text ai-msg">{props.response}</div>
        </div>
      </div>
    </div>
  )
}

ScheduleViewer.propTypes = {
  index: PropTypes.string.isRequired,
  response: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    })
  )
}

ScheduleViewer.defaultProps = {
  events: []
}
