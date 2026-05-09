# Notes

## Open Scope Features

### Stats Strip
I chose the stats strip because it's the most genuinely useful addition for a front desk tool. The calendar shows *where* occupancy is high — the stats strip answers *how bad is this month overall*. Total revenue, average occupancy, and top room type are the three numbers a hotel manager actually looks at every morning. It integrates above the calendar and updates automatically when you navigate months, so it never feels like a separate feature.

### Hover Tooltip
The tooltip gives you a quick answer without committing to a selection. You can scan across the calendar and see who's in which room without clicking anything. I kept it intentionally minimal — just the occupancy count and up to 5 guest names. It disappears during drag so it doesn't interfere with selection.

### Filtering (Room Type, Status, Source)
Filters let the front desk focus on a specific segment — for example, filtering to "Penthouse" shows only penthouse occupancy, which is useful when managing premium inventory separately. The key architectural decision was making `filteredBookings` the single filtered source that all downstream computations use. The occupancy map, stats strip, detail panel, and tooltip all update automatically when a filter changes — there's no special-casing anywhere. Filter options are derived from the actual data using `Set`, so new room types or sources appear automatically without any code change.

## Design Decisions

**Sunday-first grid**: I chose Sun–Sat over Mon–Sun because most hotel PMS systems (Opera, Cloudbeds, Mews) default to Sunday-first, and the booking data is for a property that likely follows that convention. It also means `getDay()` returns 0 for the first column with no offset math needed — the index maps directly to the column. Monday-first would require subtracting 1 and wrapping Sunday to 6, which adds a small but real source of bugs.

**Inline style for heatmap colors, not CSS classes**: The occupancy color is computed dynamically from a ratio (rooms occupied / total rooms). CSS classes work well for discrete states — selected, outside month, today — but not for a continuous scale where the value changes per cell. Inline `backgroundColor` is the right tool here. The alternative (generating a class per occupancy level like `.occ-7`) would work but couples the CSS to the data model in a fragile way.

**`useMemo` for all derived data**: `occupancyMap`, `monthStats`, `selectedBookings`, and `tooltipBookings` are all computed with `useMemo`. None of them are source state — they're derived from `bookings`, `year`, `month`, and `selection`. Without memoization, every keystroke or mouse move would recompute the occupancy map (looping 200 bookings × 30 days). With it, each only recomputes when its specific dependencies change. This is the core React performance pattern: keep source state minimal, derive everything else, memoize the expensive derivations.

**Flat cell array for the grid**: `buildCalendarCells` returns a single flat array of ~35–42 cells rather than a nested array of rows. CSS Grid with `grid-template-columns: repeat(7, 1fr)` handles the row wrapping automatically. A nested structure would require an extra `.map()` layer in the JSX and adds complexity with no benefit. The flat array also makes cross-month drag trivial — every cell has a `dateStr` regardless of which month it belongs to.

**String comparison for dates**: Every date in the system is a `"YYYY-MM-DD"` string. Comparisons like `dateStr >= booking.checkIn` work correctly because ISO date strings with zero-padding sort lexicographically the same as chronologically. This avoids creating `Date` objects for comparisons, which sidesteps timezone conversion bugs entirely. The only place `Date` objects are created is when we need calendar math — getting the first weekday of a month, or advancing day by day in `buildOccupancyMap`.

**Warm color scale (white → yellow → orange → red)**: Red means urgency universally — traffic lights, warnings, error states all use it. For a front desk person scanning the calendar at 7am, a red cell should immediately read as "nearly full, act now." A cool blue scale would be less instinctive in this context. The warm progression also follows a natural heat metaphor: empty = cool/white, full = hot/red. Practically, it also made the dark/light text contrast split clean — exactly the three darkest colors (`#fb923c`, `#ef4444`, `#991b1b`) need white text, which is why `DARK_COLORS` in `CalendarCell` has exactly three entries.

## Trade-offs

**Occupancy map scope**: The occupancy map is built over the full grid range — including the padding days from the previous and next month that appear in the calendar. This means outside-month cells show correct heatmap colors rather than always rendering as empty. The map recomputes when the month changes, which is instant for a dataset of this size.

**Stats include cross-month bookings**: A booking that spans Jan 28 – Feb 5 is counted in both January and February stats. This is intentional — the booking is genuinely active in both months. The revenue attribution is less precise as a result (the full amount is counted in both months), but for a front desk tool that's an acceptable simplification.

**No persistence**: The last-viewed month is not saved across reloads. This would be a straightforward `localStorage` addition but I prioritized getting the core interactions right first.

## What I'd Do Differently

**Revenue attribution**: Split revenue proportionally across months for bookings that span month boundaries, rather than counting the full amount in each month.

**`useReducer` for calendar state**: `useCalendar` has 5 related `useState` calls. A `useReducer` with explicit actions like `START_DRAG`, `END_DRAG`, `SET_MONTH` would make state transitions easier to trace and test. I kept `useState` because the logic is still readable at this scale, but `useReducer` is the right call as complexity grows.

**Accessibility**: The drag selection has no keyboard equivalent. Arrow keys + Shift to extend selection would make this usable without a mouse.

**Test coverage**: The date logic functions in `dateUtils.js` are pure functions and straightforward to unit test. I'd add tests for `bookingOccupiesDate` edge cases (same-day check-in/out, cancelled bookings) and `buildCalendarCells` boundary conditions (months starting on Sunday, February in leap years).
