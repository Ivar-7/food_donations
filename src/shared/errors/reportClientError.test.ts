import { afterEach, describe, expect, it, vi } from 'vitest'
import { reportClientError } from './reportClientError'

describe('reportClientError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs only safe diagnostic fields in development', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    reportClientError(new Error('Private pickup address: 123 Example Street'), {
      route: '/donations/123',
      componentStack: 'at DonationForm',
    })

    expect(consoleError).toHaveBeenCalledWith('Unhandled client error', {
      errorName: 'Error',
      route: '/donations/123',
      componentStack: 'at DonationForm',
    })
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'Private pickup address',
    )
  })
})
