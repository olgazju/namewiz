import { describe, expect, it, test } from 'vitest'

import App from './App'

describe('App Component', () => {
    test('App exists', () => {
      expect(App).toBeDefined()
    })
  
    test('App is a function', () => {
      expect(typeof App).toBe('function')
    })
  


})