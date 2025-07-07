// ==========================================
// components/results/DataVisualization.jsx
// ==========================================
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  male: '#3B82F6',
  female: '#EC4899',
  unknown: '#6B7280'
}

export default function DataVisualization({ results, analysisTypes }) {
  if (!analysisTypes.includes('gender')) {
    return null
  }

  const genderData = [
    {
      name: 'Male',
      value: results.filter(r => r.demographics.gender?.value === 'male').length,
      color: COLORS.male
    },
    {
      name: 'Female', 
      value: results.filter(r => r.demographics.gender?.value === 'female').length,
      color: COLORS.female
    },
    {
      name: 'Unknown',
      value: results.filter(r => r.demographics.gender?.value === 'unknown' || r.demographics.gender?.error).length,
      color: COLORS.unknown
    }
  ].filter(item => item.value > 0)

  const confidenceData = [
    {
      name: 'High (80-100%)',
      value: results.filter(r => r.demographics.gender?.confidence >= 80).length
    },
    {
      name: 'Medium (60-79%)',
      value: results.filter(r => r.demographics.gender?.confidence >= 60 && r.demographics.gender?.confidence < 80).length
    },
    {
      name: 'Low (0-59%)',
      value: results.filter(r => r.demographics.gender?.confidence < 60).length
    }
  ].filter(item => item.value > 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gender Distribution */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Distribution */}
      <div className="card">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Confidence Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}