// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import { useMediaQuery } from './use-media-query'

describe('useMediaQuery', () => {
    let matchMediaMock: Mock

    beforeEach(() => {
        matchMediaMock = vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // Deprecated
            removeListener: vi.fn(), // Deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))
        window.matchMedia = matchMediaMock
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should return false by default if query does not match', () => {
        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(false)
    })

    it('should return true if query matches', () => {
        matchMediaMock.mockImplementation((query) => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(true)
    })

    it('should update when media query changes', () => {
        let changeHandler: ((e: MediaQueryListEvent) => void) | null = null

        matchMediaMock.mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn((event, handler) => {
                if (event === 'change') {
                    changeHandler = handler
                }
            }),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }))

        const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
        expect(result.current).toBe(false)

        act(() => {
            if (changeHandler) {
                changeHandler({ matches: true, media: '(min-width: 768px)' } as MediaQueryListEvent)
            }
        })

        expect(result.current).toBe(true)
    })
})
