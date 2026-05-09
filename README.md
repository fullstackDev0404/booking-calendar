# Booking Calendar Heatmap

A single-page React app that visualizes hotel bookings as an interactive occupancy heatmap calendar. Built for the Guestara frontend intern assignment.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- React 19 + Vite
- Plain CSS (no UI libraries)
- No calendar libraries — all date logic is hand-written
- No date manipulation libraries — native `Date` object only

## Project Structure

```
src/
  constants.js          # shared display data (month names, legend, etc.)
  App.jsx               # orchestrator — wires hooks and components
  hooks/
    useBookings.js      # fetches bookings.json, manages loading/error state
    useCalendar.js      # month navigation, drag selection, tooltip state
  utils/
    dateUtils.js        # pure date functions (parse, format, occupancy logic)
    occupancyUtils.js   # builds occupancy map, color scale
    statsUtils.js       # computes month-level metrics
  components/
    CalendarGrid.jsx    # assembles the 7-column grid
    CalendarHeader.jsx  # weekday labels row
    CalendarCell.jsx    # single day cell
    BookingPanel.jsx    # detail panel for selected range
    BookingCard.jsx     # single booking row
    StatsStrip.jsx      # month metrics header
    DayTooltip.jsx      # hover tooltip
```

## Features

**Core**
- Month-view calendar with occupancy heatmap (white → yellow → orange → red)
- Prev/next month navigation + Today button
- Drag-to-select date range (forward and backward, cross-month)
- Booking detail panel showing all bookings overlapping the selected range
- Data loaded via `fetch` from `/public/bookings.json` with loading and error states

**Open Scope**
- Stats strip: total revenue, avg occupancy, total bookings, longest stay, top room type — updates per month
- Hover tooltip: quick summary of occupancy and guests on any day cell
