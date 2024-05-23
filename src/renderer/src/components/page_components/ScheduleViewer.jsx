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
      dayNames.push(
        <div key={`day-name-${index}`} className="month-day-name">
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
      // const date = startOfMonth.clone().date(i)
      days.push(
        <div key={`day-${i}`} className="month-day">
          {i}
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
      days.push(
        <div key={`day-${i}`} className="week-day">
          {date.format('ddd')}
          <br />
          {date.format('DD')}
        </div>
      )
    }

    return <div className="calendar-week">{days}</div>
  }

  const renderDayGridView = () => {
    const startOfMonth = currentDate.clone().startOf('month')
    const endOfMonth = currentDate.clone().endOf('month')
    const weeks = []
    let currentWeek = []
    let currentDay = startOfMonth.clone()

    while (currentDay <= endOfMonth) {
      currentWeek.push(
        <div key={`day-${currentDay.format('YYYY-MM-DD')}`} className="dayGrid-day">
          {currentDay.format('DD')}
        </div>
      )

      if (currentWeek.length === 7) {
        weeks.push(
          <div key={`week-${currentDay.format('YYYY-MM')}`} className="dayGrid-week">
            {currentWeek}
          </div>
        )
        currentWeek = []
      }

      currentDay.add(1, 'day')
    }

    if (currentWeek.length > 0) {
      weeks.push(
        <div key={`week-${currentDay.format('YYYY-MM')}`} className="dayGrid-week">
          {currentWeek}
        </div>
      )
    }

    return <div className="calendar-day-grid">{weeks}</div>
  }

  return (
    <div className="msg-row" key={`ai-${props.index}`}>
      <div className="msg-avatar">
        <img src={pinacLogo} alt="AI Avatar" />
      </div>
      <div className="msg-content">
        <div className="msg-name">PINAC</div>
        <div className="schedule-content">
          {/* Calendar */}
          <div className="calendar-container">
            <div className="calendar-view-buttons">
              <button onClick={() => handleViewChange('month')}>Month</button>
              <button onClick={() => handleViewChange('week')}>Week</button>
              <button onClick={() => handleViewChange('day-grid')}>Day Grid</button>
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
                {currentView === 'month' && renderMonthView()}
                {currentView === 'week' && (
                  <>
                    <button onClick={handlePreviousWeek}>Previous</button>
                    {renderWeekView()}
                    <button onClick={handleNextWeek}>Next</button>
                  </>
                )}
                {currentView === 'day-grid' && renderDayGridView()}
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
  response: PropTypes.string.isRequired
}
