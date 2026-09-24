type ErrorContext = {
  componentStack?: string
  route?: string
}

/**
 * Keeps client-side diagnostics deliberately minimal. Do not add user profiles,
 * email addresses, pickup details, payment data, documents, or error messages
 * to a client error report.
 */
export function reportClientError(
  error: unknown,
  context: ErrorContext = {},
): void {
  if (!import.meta.env.DEV) {
    return
  }

  const errorName = error instanceof Error ? error.name : 'UnknownError'

  console.error('Unhandled client error', {
    errorName,
    route: context.route,
    componentStack: context.componentStack,
  })
}
