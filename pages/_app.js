// ==========================================
// pages/_app.js
// ==========================================
import { DemographicsProvider } from '../context/DemographicsContext'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <DemographicsProvider>
      <Component {...pageProps} />
    </DemographicsProvider>
  )
}