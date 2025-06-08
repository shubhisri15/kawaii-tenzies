import { useState, useRef, useEffect } from "react"
import useTimer from './hooks/useTimer'
import { generateAllNewDice, convertSecondsToMMSS } from './utils'
import Confetti from "react-confetti"
import ScreenReaderAria from './components/ScreenReaderAria'
import DiceContainer from './components/DiceContainer'
import Header from './components/Header'

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [currentRollCount, setCurrentRollCount] = useState(0)
    const [firstSelectedValue, setFirstSelectedValue] = useState(null)
    
    const [bestRolls, setBestRolls] = useState(() => {
        const saved = localStorage.getItem("bestRolls")
        return saved ? JSON.parse(saved) : 0
    })
    
    const [bestTime, setBestTime] = useState(() => {
        const saved = localStorage.getItem("bestTime")
        return saved ? JSON.parse(saved) : 0
    })

    const timeRef = useRef(0)
    const timerRef = useRef(null)
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    const { timeElapsed, reset: resetTimer } = useTimer(!gameWon && currentRollCount > 0)
        
    useEffect(() => {
        if (gameWon) {
            clearInterval(timerRef.current)
            buttonRef.current.focus()
            
            if (bestRolls === 0 || currentRollCount < bestRolls) {
                localStorage.setItem("bestRolls", JSON.stringify(currentRollCount))
                setBestRolls(currentRollCount)
            }
            
            if (bestTime === 0 || timeRef.current < bestTime) {
                localStorage.setItem("bestTime", JSON.stringify(timeElapsed))
                setBestTime(timeElapsed)
            }
        }
    }, [gameWon, currentRollCount, timeElapsed, bestRolls, bestTime])

    function rollDice() {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
            setCurrentRollCount(prevRollCount => prevRollCount + 1)
    }
    
    function newGame() {
        setDice(generateAllNewDice())
        setCurrentRollCount(0)
        resetTimer()
        setFirstSelectedValue(null)
    }

    function hold(id) {
        setDice(oldDice => {
            const newDice = oldDice.map(die =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die
            )

        // Check if after toggling, any dice are held
        const anyHeld = newDice.some(die => die.isHeld)

        if (!anyHeld) {
            // If no dice held, reset firstSelectedValue
            setFirstSelectedValue(null)
        } else if (!firstSelectedValue) {
            // If firstSelectedValue is not set and this die is being held, set it
            const heldDie = newDice.find(die => die.id === id && die.isHeld)
            if (heldDie) {
                setFirstSelectedValue(heldDie.value)
            }
        }

        return newDice
        })
    }

    return (
        <>
            <main>
                {gameWon && <Confetti />}
                <ScreenReaderAria gameWon={gameWon}/>
                <div className='personal-record'>
                    <p>Best time: {convertSecondsToMMSS(bestTime)}</p>
                    <p>Best rolls: {bestRolls}</p>
                </div>
                <Header />
                <div className='personal-record current'>
                    <div className='time-elapsed'>
                        <i className="fa-solid fa-clock"></i>
                        <p>{convertSecondsToMMSS(timeElapsed)}</p>
                    </div>
                    <p>Rolls: {currentRollCount}</p>
                </div>
                <DiceContainer 
                    dice={dice} 
                    hold={hold} 
                    firstSelectedValue={firstSelectedValue}
                />
                
                <button ref={buttonRef} className="roll-dice" onClick={rollDice} disabled={gameWon}>
                    {gameWon ? "Game Over" : "Roll Dice"}
                </button>
            </main>
            <button className="new-game" onClick={newGame}>
                New Game
            </button>
        </>
    )
}