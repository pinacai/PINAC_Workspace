import { useState } from 'react'
import './style/Calendar.css'

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const generateCalendar = (month, year) => {
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysArray = []

    let day = 1
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          // Add empty cells for days before the first day of the month
          daysArray.push(<div className="day-cell" key={`${i}-${j}`}></div>)
        } else if (day > daysInMonth) {
          // Stop adding cells after the last day of the month
          break
        } else {
          daysArray.push(
            <div className="day-cell" key={`${i}-${j}`}>
              {day}
            </div>
          )
          day++
        }
      }
    }

    return (
      <>
        <div className="month-header">{`${monthName} ${year}`}</div>
        <div className="weekdays">
          <div className="day-cell">Sun</div>
          <div className="day-cell">Mon</div>
          <div className="day-cell">Tue</div>
          <div className="day-cell">Wed</div>
          <div className="day-cell">Thu</div>
          <div className="day-cell">Fri</div>
          <div className="day-cell">Sat</div>
        </div>
        <div className="days">{daysArray}</div>
      </>
    )
  }

  const changeMonth = (change) => {
    let newMonth = currentMonth + change
    let newYear = currentYear
    if (newMonth < 0) {
      newMonth = 11
      newYear--
    } else if (newMonth > 11) {
      newMonth = 0
      newYear++
    }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  return (
    <div className="calendar-container">
      <div className="controls">
        <button onClick={() => changeMonth(-1)}>&laquo;</button>
        <button onClick={() => changeMonth(1)}>&raquo;</button>
      </div>
      {generateCalendar(currentMonth, currentYear)}
    </div>
  )
}
