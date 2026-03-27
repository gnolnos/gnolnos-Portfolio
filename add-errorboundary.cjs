const fs = require('fs');
const path = '/root/.openclaw/workspace/gnolnos-Portfolio/src/App.jsx';

let content = fs.readFileSync(path, 'utf8');

const errorBoundary = `
// --- Error Boundary Class Component ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
          <AlertCircle size={48} className="text-rose-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Đã xảy ra lỗi</h1>
          <p className="text-slate-400 mb-4">Rất tiếc, trang đã gặp sự cố. Vui lòng thử lại sau.</p>
          {process.env.NODE_ENV !== 'production' && (
            <pre className="bg-slate-800 p-4 rounded text-xs overflow-auto max-w-full">{this.state.error?.toString()}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

`;

// Insert after the line: "} from 'lucide-react';"
content = content.replace(
  /(\}\) from 'lucide-react';)/m,
  `$1\n${errorBoundary}`
);

// Now modify main.jsx to wrap App with ErrorBoundary
const mainPath = '/root/.openclaw/workspace/gnolnos-Portfolio/src/main.jsx';
let main = fs.readFileSync(mainPath, 'utf8');
// Change: import App from './App.jsx' and then render
// We need to also import ErrorBoundary from './App.jsx'? Actually ErrorBoundary is exported from App.jsx. So we can import it.
// Add import: import { ErrorBoundary } from './App.jsx';
// And wrap: ReactDOM.createRoot(...).render(<ErrorBoundary><App /></React.StrictMode>);
if (!main.includes('ErrorBoundary')) {
  main = main.replace(
    /import App from '\.\/App\.jsx'/,
    "import App, { ErrorBoundary } from './App.jsx'"
  );
  main = main.replace(
    /<React\.StrictMode>\s*<App \/>\s*<\/React\.StrictMode>/,
    `<ErrorBoundary><React.StrictMode><App /></React.StrictMode></ErrorBoundary>`
  );
  fs.writeFileSync(mainPath, main, 'utf8');
  console.log('Updated main.jsx with ErrorBoundary wrapper.');
} else {
  console.log('main.jsx already contains ErrorBoundary.');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Added ErrorBoundary class to App.jsx');