import { Link } from "react-router-dom";
import "./RouteState.css";

export function RouteLoading({ message = "Restoring your session…" }) {
  return (
    <main className="route-state" role="status" aria-live="polite">
      <span className="route-state-spinner" aria-hidden="true" />
      <p>{message}</p>
    </main>
  );
}

export function NotFound() {
  return (
    <main className="route-state route-not-found">
      <span>404</span>
      <h1>Page not found</h1>
      <p>The page may have moved, or the link may be incorrect.</p>
      <Link to="/">Return to home</Link>
    </main>
  );
}

export function SessionError({ message, onRetry, onSignOut }) {
  return (
    <main className="route-state route-session-error" role="alert">
      <span>Connection problem</span>
      <h1>We could not verify your session.</h1>
      <p>{message}</p>
      <div>
        <button type="button" onClick={onRetry}>Try again</button>
        <button type="button" className="route-state-secondary" onClick={onSignOut}>Sign out</button>
      </div>
    </main>
  );
}
