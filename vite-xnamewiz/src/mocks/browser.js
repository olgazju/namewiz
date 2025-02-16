import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers, {
  serviceWorker: {
    options: {
      scope: '/', // Extend scope to root
    },
  },
})
