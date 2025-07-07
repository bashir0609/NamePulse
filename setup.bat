# Create the main project directory
mkdir name-demographics-analyzer
cd name-demographics-analyzer

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Create the folder structure
mkdir -p pages/api/providers
mkdir -p components/layout
mkdir -p components/forms
mkdir -p components/analysis
mkdir -p components/results
mkdir -p components/ui
mkdir -p hooks
mkdir -p utils
mkdir -p context
mkdir -p styles
mkdir -p lib
mkdir -p public

# Create all the main files
touch package.json
touch next.config.js
touch vercel.json
touch .env.example
touch .env.local

# Create page files
touch pages/_app.js
touch pages/_document.js
touch pages/index.js
touch pages/gender-analysis.js
touch pages/batch-analysis.js

# Create API route files
touch pages/api/analyze-demographics.js
touch pages/api/health.js
touch pages/api/providers/genderize.js
touch pages/api/providers/openrouter.js
touch pages/api/providers/perplexity.js

# Create component files
touch components/layout/Layout.jsx
touch components/layout/Header.jsx
touch components/layout/Navigation.jsx
touch components/forms/AnalysisTypeSelector.jsx
touch components/forms/APIConfiguration.jsx
touch components/forms/FileUpload.jsx
touch components/forms/NameInput.jsx
touch components/analysis/AnalysisControls.jsx
touch components/analysis/ProgressBar.jsx
touch components/analysis/StatusMessage.jsx
touch components/results/ResultsDisplay.jsx
touch components/results/DemographicsCards.jsx
touch components/results/ResultsTable.jsx
touch components/results/ExportOptions.jsx
touch components/results/DataVisualization.jsx
touch components/ui/Button.jsx
touch components/ui/Card.jsx
touch components/ui/Input.jsx
touch components/ui/Tabs.jsx
touch components/ui/Badge.jsx

# Create hook files
touch hooks/useDemographicsAnalyzer.js
touch hooks/useGenderAnalyzer.js
touch hooks/useOriginAnalyzer.js
touch hooks/useFileUpload.js
touch hooks/useExport.js
touch hooks/useVisualization.js

# Create utility files
touch utils/nameExtractor.js
touch utils/csvParser.js
touch utils/validation.js
touch utils/apiHelpers.js
touch utils/demographicsHelpers.js
touch utils/visualizationHelpers.js
touch utils/constants.js

# Create context files
touch context/DemographicsContext.js

# Create style files
touch styles/globals.css
touch styles/components.module.css

# Create lib files
touch lib/api.js
touch lib/database.js

# Create public files
touch public/sample-data.csv

# Install dependencies
npm install next react react-dom recharts papaparse xlsx lucide-react classnames date-fns

# Install dev dependencies
npm install --save-dev eslint eslint-config-next @types/papaparse

# Create sample data file
echo "Name,Title,Company
John Smith,CEO,Tech Corp
Maria Garcia,CTO,Data Inc
Alexander Wang,COO,Global Ltd" > public/sample-data.csv

# Initialize git (optional)
git init
echo "node_modules/
.next/
.env.local
.env
.vercel" > .gitignore

echo "✅ Project structure created successfully!"
echo "📁 Navigate to the project: cd name-demographics-analyzer"
echo "🚀 Start development: npm run dev"
echo "🔧 Configure your .env.local file with API keys"