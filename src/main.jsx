import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Nó sẽ import file Portfolio của bạn (đã đổi tên thành App.jsx)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)