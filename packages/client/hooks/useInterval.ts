import { useEffect, useRef } from 'react'

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(() => {
    // nop
  })

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    if (delay !== null && delay !== undefined) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval
