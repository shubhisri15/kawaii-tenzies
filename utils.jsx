import { nanoid } from "nanoid"

export function generateAllNewDice() {
    return new Array(10)
        .fill(0)
        .map(() => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }))
}

export function convertSecondsToMMSS(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds - (minutes * 60)
    
    return `${minutes}m ${seconds}s`
}