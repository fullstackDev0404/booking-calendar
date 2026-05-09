# Notes

## Open Scope Features

### Stats Strip
I chose the stats strip because it's the most genuinely useful addition for a front desk tool. The calendar shows *where* occupancy is high — the stats strip answers *how bad is this month overall*. Total revenue, average occupancy, and top room type are the three numbers a hotel manager actually looks at every morning. It integrates above the calendar and updates automatically when you navigate months, so it never feels like a separate feature.

### Hover Tooltip
The tooltip gives you a quick answer without committing to a selection. You can scan across the calendar and see who's in which room without clicking anything. I kept it intentionally minimal — just the occupancy count and up to 5 guest names. It disappears during drag so it doesn't interfere with selection.

## Trade-offs

**Occupancy map scope**: The occupancy map is built only for the current month's date range. This means navigating months triggers a recompute. An alternative would be to precompute the entire dataset upfront into one big map. I chose per-month because it's simpler to reason about and the dataset is small enough that the recompute is instant.

**Stats include cross-month bookings**: A booking that spans Jan 28 – Feb 5 is counted in both January and February stats. This is intentional — the booking is genuinely active in both months. The revenue attribution is less precise as a result (the full amount is counted in both months), but for a front desk tool that's an acceptable simplification.

**String-based date comparison**: All date comparisons use `"YYYY-MM-DD"` string comparison rather than converting to timestamps. This works because ISO date strings with zero-padding sort lexicographically the same as chronologically. It avoids timezone issues that come with `Date` arithmetic.

**No persistence**: The last-viewed month is not saved across reloads. This would be a straightforward `localStorage` addition but I prioritized getting the core interactions right first.

## What I'd Do Differently

**Revenue attribution**: Split revenue proportionally across months for bookings that span month boundaries, rather than counting the full amount in each month.

**Filtering**: Adding room type and status filters would make the heatmap significantly more useful. The architecture supports it — filters would just be applied before `buildOccupancyMap` and `computeMonthStats`.

**Accessibility**: The drag selection has no keyboard equivalent. Arrow keys + Shift to extend selection would make this usable without a mouse.

**Test coverage**: The date logic functions in `dateUtils.js` are pure functions and straightforward to unit test. I'd add tests for `bookingOccupiesDate` edge cases (same-day check-in/out, cancelled bookings) and `buildCalendarCells` boundary conditions (months starting on Sunday, February in leap years).
