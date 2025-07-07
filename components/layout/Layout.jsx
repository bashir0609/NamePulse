// ==========================================
// components/layout/Layout.jsx (SIMPLIFIED - Remove double wrapping)
// ==========================================
import Header from './Header'
import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>
        {children}
      </main>
    </>
  )
}