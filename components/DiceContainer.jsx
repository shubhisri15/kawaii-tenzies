import Die from './Die'

export default function DiceContainer({ dice, hold, firstSelectedValue }) {
    
    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
            isCorrectHold={dieObj.value === firstSelectedValue}
        />
    ))
    
    return (
        <div className="dice-container">
            {diceElements}
        </div>
    )
}
