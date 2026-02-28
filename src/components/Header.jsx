import React from 'react'

const LOGO_FALLBACK = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiB2aWV3Qm94PSIwIDAgMTYwIDE2MCI+PGNpcmNsZSBjeD0iODAiIGN5PSI4MCIgcj0iNzUiIGZpbGw9IiMzYjgyZjYiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjgwIiByPSI2NSIgZmlsbD0iI2ZiYmYyNCIvPjxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjUwIiBmaWxsPSIjMWU0MGFmIi8+PHRleHQgeD0iODAiIHk9IjkwIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QlZMPC90ZXh0Pjwvc3ZnPg=="

export default function Header() {
  return (
    <div className="header">
      <div className="logo-container">
        <img src="/BVL_LOGO.png" alt="BVL Logo" onError={(e) => { e.target.src = LOGO_FALLBACK }} />
      </div>
      <h1>BRAHMAPUTRA VOLLEYBALL LEAGUE</h1>
      <p>Season 7 Registration</p>
    </div>
  )
}
