// ==========================================
// components/layout/Navigation.jsx
// ==========================================
import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Multi-Analysis', icon: '🎯' },
  { href: '/gender-analysis', label: 'Gender Analysis', icon: '👥' },
  { href: '/batch-analysis', label: 'Batch Processing', icon: '📊' }
]

export default function Navigation() {
  const router = useRouter()

  return (
    <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 rounded-t-lg transition-all ${
                router.pathname === item.href
                  ? 'bg-white text-gray-900 font-semibold'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}