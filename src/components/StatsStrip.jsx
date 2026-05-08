export default function StatsStrip({ stats }) {
  if (!stats) return null

  const { totalRevenue, avgOccupancy, longestStay, topRoomType, totalBookings } = stats

  return (
    <div className="stats-strip">
      <StatCard label="Total Revenue"  value={formatCurrency(totalRevenue)}              sub="this month" />
      <StatCard label="Avg Occupancy"  value={`${avgOccupancy.toFixed(1)}/10`}           sub={`${((avgOccupancy / 10) * 100).toFixed(0)}% per night`} />
      <StatCard label="Total Bookings" value={totalBookings}                              sub="active this month" />
      <StatCard label="Longest Stay"   value={`${longestStay}n`}                         sub="nights" />
      <StatCard label="Top Room Type"  value={topRoomType}                               sub="most booked" />
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-sub">{sub}</div>
    </div>
  )
}

function formatCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}
