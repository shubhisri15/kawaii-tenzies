export default function ScreenReaderAria({ gameWon }) {
    return (
        <div aria-live="polite" className="sr-only">
            {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
        </div>
    )
}