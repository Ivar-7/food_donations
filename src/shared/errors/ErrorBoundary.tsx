import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportClientError } from "./appError";

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportClientError({ error, componentStack: info.componentStack });
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 dark:bg-stone-950">
          <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900">
            <h1 className="text-2xl font-bold">Okoa Food needs a refresh</h1>
            <p className="mt-3 text-stone-600 dark:text-stone-400">
              We could not show this page. Please reload and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-pink-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
