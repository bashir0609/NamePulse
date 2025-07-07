// ==========================================
// components/results/ResultsDisplay.jsx
// ==========================================
import DemographicsCards from './DemographicsCards'
import ResultsTable from './ResultsTable'
import ExportOptions from './ExportOptions'
import DataVisualization from './DataVisualization'

export default function ResultsDisplay({ results, analysisTypes }) {
  if (!results || results.length === 0) {
    return null
  }

  return (
    <section className="section">
      <h3 className="section-title">📊 Analysis Results</h3>
      
      {/* Statistics Cards */}
      <DemographicsCards results={results} analysisTypes={analysisTypes} />
      
      {/* Data Visualization */}
      <DataVisualization results={results} analysisTypes={analysisTypes} />
      
      {/* Results Table */}
      <ResultsTable results={results} analysisTypes={analysisTypes} />
      
      {/* Export Options */}
      <ExportOptions results={results} />
    </section>
  )
}