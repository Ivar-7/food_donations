import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportClientError } from './reportClientError'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportClientError(error, {
      componentStack: errorInfo.componentStack ?? undefined,
      route: window.location.pathname,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main role="alert" aria-live="assertive">
          <h1>Something went wrong</h1>
          <p>
            Please refresh the page. If the problem continues, contact support.
          </p>
        </main>
      )
    }

    return this.props.children
  }
}
