import { worker } from './mocks/worker.js'
import { beforeAll, afterEach, afterAll } from 'vitest'


beforeAll(() => {
  worker.start()
})

afterEach(() => {
  worker.resetHandlers()
})

afterAll(() => {
  worker.stop()
})