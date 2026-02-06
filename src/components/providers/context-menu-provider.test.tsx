import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ContextMenuProvider, useContextMenu } from './context-menu-provider'

// Mock component to trigger context menu
const TestComponent = () => {
  const { open } = useContextMenu()
  return (
    <div
      data-testid="trigger"
      onContextMenu={(e) => {
        e.preventDefault()
        open(e.clientX, e.clientY, <div data-testid="menu-content">Menu Content</div>)
      }}
    >
      Right Click Me
    </div>
  )
}

describe('ContextMenuProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('opens menu on context menu event', () => {
    render(
      <ContextMenuProvider>
        <TestComponent />
      </ContextMenuProvider>
    )

    const trigger = screen.getByTestId('trigger')
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 })

    // Fast-forward debounce
    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('menu-content')).toBeInTheDocument()
  })

  it('closes menu on click outside', () => {
    render(
      <ContextMenuProvider>
        <TestComponent />
      </ContextMenuProvider>
    )

    const trigger = screen.getByTestId('trigger')
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 })
    
    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('menu-content')).toBeInTheDocument()

    // Click outside
    fireEvent.click(document.body)

    // Should be closed (removed from DOM or hidden)
    // Note: implementation unmounts content or hides it. 
    // In our case, createPortal renders only if isRendered is true.
    act(() => {
      jest.runAllTimers() // For fade out
    })
    
    expect(screen.queryByTestId('menu-content')).not.toBeInTheDocument()
  })

  it('closes menu on Escape key', () => {
    render(
      <ContextMenuProvider>
        <TestComponent />
      </ContextMenuProvider>
    )

    const trigger = screen.getByTestId('trigger')
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 })
    
    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('menu-content')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })

    act(() => {
      jest.runAllTimers() // For fade out
    })

    expect(screen.queryByTestId('menu-content')).not.toBeInTheDocument()
  })

  it('debounces menu opening', () => {
    render(
      <ContextMenuProvider>
        <TestComponent />
      </ContextMenuProvider>
    )

    const trigger = screen.getByTestId('trigger')
    
    // Trigger multiple times rapidly
    fireEvent.contextMenu(trigger, { clientX: 100, clientY: 100 })
    fireEvent.contextMenu(trigger, { clientX: 200, clientY: 200 })
    
    // Advance less than debounce time (50ms)
    act(() => {
      jest.advanceTimersByTime(10)
    })
    
    // Should NOT be open yet
    expect(screen.queryByTestId('menu-content')).not.toBeInTheDocument()

    // Trigger again
    fireEvent.contextMenu(trigger, { clientX: 300, clientY: 300 })
    
    // Advance full time
    act(() => {
      jest.runAllTimers()
    })

    expect(screen.getByTestId('menu-content')).toBeInTheDocument()
  })
})
