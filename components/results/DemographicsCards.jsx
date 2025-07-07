// ==========================================
// components/results/DemographicsCards.jsx
// ==========================================
export default function DemographicsCards({ results, analysisTypes }) {
  const calculateStats = () => {
    const stats = {}
    
    analysisTypes.forEach(type => {
      if (type === 'gender') {
        const genderStats = {
          total: results.length,
          male: results.filter(r => r.demographics.gender?.value === 'male').length,
          female: results.filter(r => r.demographics.gender?.value === 'female').length,
          unknown: results.filter(r => r.demographics.gender?.value === 'unknown' || r.demographics.gender?.error).length
        }
        stats.gender = genderStats
      }
      // Add other analysis type stats here
    })
    
    return stats
  }

  const stats = calculateStats()

  return (
    <div className="stats-grid mb-8">
      {stats.gender && (
        <>
          <div className="stat-card">
            <div className="stat-number">{stats.gender.total}</div>
            <div className="stat-label">Total Analyzed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.gender.male}</div>
            <div className="stat-label">Male</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.gender.female}</div>
            <div className="stat-label">Female</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.gender.unknown}</div>
            <div className="stat-label">Unknown</div>
          </div>
        </>
      )}
    </div>
  )
}