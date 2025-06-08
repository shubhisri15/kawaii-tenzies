import { useState, useRef, useEffect } from "react"

export default function useTimer(isRunning) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    
    return () => clearInterval(timerRef.current)
    
  }, [isRunning])

  function reset() {
    clearInterval(timerRef.current)
    setTimeElapsed(0)
  }

  return { timeElapsed, reset }
}
