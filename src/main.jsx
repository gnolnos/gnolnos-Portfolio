import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { ErrorBoundary } from './App.jsx' // Nó sẽ import file Portfolio của bạn (đã đổi tên thành App.jsx)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary><React.StrictMode><App /></React.StrictMode></ErrorBoundary>,
)