import { Component } from "react";
import { Link } from "react-router-dom";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-error-boundary" role="alert">
        <div>
          <span>Something went wrong</span>
          <h1>This page could not be displayed.</h1>
          <p>Your account data is safe. Reload the page, or return to the home page and try again.</p>
          <div className="app-error-actions">
            <button type="button" onClick={() => window.location.reload()}>Reload page</button>
            <Link to="/">Go to home</Link>
          </div>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
