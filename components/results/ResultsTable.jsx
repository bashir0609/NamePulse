// ==========================================
// components/results/ResultsTable.jsx
// ==========================================
import { useState } from 'react'

export default function ResultsTable({ results, analysisTypes }) {
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filter, setFilter] = useState('')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedResults = results
    .filter(result => 
      filter === '' || 
      result.name.toLowerCase().includes(filter.toLowerCase()) ||
      result.firstName.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue

      if (sortField === 'name') {
        aValue = a.name
        bValue = b.name
      } else if (sortField === 'firstName') {
        aValue = a.firstName
        bValue = b.firstName
      } else if (sortField === 'gender') {
        aValue = a.demographics.gender?.value || 'unknown'
        bValue = b.demographics.gender?.value || 'unknown'
      } else if (sortField === 'confidence') {
        aValue = a.demographics.gender?.confidence || 0
        bValue = b.demographics.gender?.confidence || 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getConfidenceIcon = (demographic) => {
    if (demographic?.error) return '⚠️'
    if (!demographic || demographic.value === 'unknown') return '❓'
    if (demographic.confidence < 70) return '⚠️'
    return '✅'
  }

  return (
    <div className="space-y-4">
      {/* Filter Input */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Filter results..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-input max-w-xs"
        />
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedResults.length} of {results.length} results
        </div>
      </div>

      {/* Results Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Full Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('firstName')}
              >
                First Name {sortField === 'firstName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              {analysisTypes.includes('gender') && (
                <>
                  <th 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('gender')}
                  >
                    Gender {sortField === 'gender' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('confidence')}
                  >
                    Confidence {sortField === 'confidence' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedResults.map((result, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td>{result.name}</td>
                <td className="font-semibold">{result.firstName}</td>
                {analysisTypes.includes('gender') && (
                  <>
                    <td>
                      <span className={`font-semibold ${result.demographics.gender?.value || 'unknown'}`}>
                        {(result.demographics.gender?.value || 'unknown').toUpperCase()}
                        <span className="ml-2">
                          {getConfidenceIcon(result.demographics.gender)}
                        </span>
                      </span>
                    </td>
                    <td>
                      {result.demographics.gender?.confidence || 0}%
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}