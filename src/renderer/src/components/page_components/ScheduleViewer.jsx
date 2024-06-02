import { useState, useEffect } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import './style/ScheduleViewer.css'

// Icons
import leftArrow from '../../assets/icon/chevron_left.svg'
import rightArrow from '../../assets/icon/chevron_right.svg'
import pinacLogo from '../../assets/icon/pinac-logo.png'

export const ScheduleViewer = (props) => {
  // Initialize state variables
  const [currentDate, setCurrentDate] = useState(moment())
  const [currentView, setCurrentView] = useState('month')
  const [isAvatarVisible, setIsAvatarVisible] = useState(window.innerWidth > 576)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 786)

  useEffect(() => {
    // Perform any necessary side effects when the current date or view changes
  }, [currentDate, currentView])

  // Handle window resize and update avatar visibility
  useEffect(() => {
    const handleResize = () => {
      setIsAvatarVisible(window.innerWidth > 576)
      setIsSmallScreen(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Set the schedule description based on the current view
  // const scheduleDesc =
  //   currentView === 'month' ? (
  //     <div className="schedule-desc msg-text ai-msg">{props.response}</div>
  //   ) : null

  // Handle previous month navigation
  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'))
  }

  // Handle next month navigation
  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'))
  }

  // Handle previous week navigation
  const handlePreviousWeek = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'week'))
  }

  // Handle next week navigation
  const handleNextWeek = () => {
    setCurrentDate(currentDate.clone().add(1, 'week'))
  }

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  //
  //
  // Render the month view
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
      const dayNameText = isSmallScreen ? name.charAt(0) : name

      dayNames.push(
        <div
          key={`day-name-${index}`}
          className={`month-day-name ${isCurrentDayName ? 'current' : ''}`}
        >
          {dayNameText}
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

  //
  //
  // Render the Week view
  const renderWeekView = () => {
    const startOfWeek = currentDate.clone().startOf('week')
    const days = []

    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.clone().add(i, 'days')
      const isCurrentDate = date.isSame(moment(), 'day')

      days.push(
        <div key={`day-${i}`} className={`week-day ${isCurrentDate ? 'current' : ''}`}>
          <div id="upper">{isSmallScreen ? date.format('dd') : date.format('ddd')}</div>
          <div id="lower">{date.format('DD')}</div>
        </div>
      )
    }

    return <div className="calendar-week">{days}</div>
  }

  return (
    <div className="msg-row">
      {isAvatarVisible && (
        <div className="msg-avatar">
          <img src={pinacLogo} alt="AI Avatar" />
        </div>
      )}
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
                    <img src={leftArrow} alt="Previous" className="changeable-icon" />
                  </button>
                  <button onClick={handleNextMonth}>
                    <img src={rightArrow} alt="Next" className="changeable-icon" />
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
                        <img src={leftArrow} alt="Previous" className="changeable-icon" />
                      </button>
                      <button onClick={handleNextWeek}>
                        {' '}
                        <img src={rightArrow} alt="Next" className="changeable-icon" />
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
          {/* {scheduleDesc} */}
        </div>
      </div>
    </div>
  )
}

ScheduleViewer.propTypes = {
  // response: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string.isRequired,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    })
  )
}
