import Board from './Board'
import { useLocalStorageState } from '../utils'

function Game() {
    const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [Array(9).fill(null),])
    const [currentStep, setCurrentStep] = useLocalStorageState('tic-tac-toe:step', 0,)

    const currentSquares = history[currentStep]
    const winner = calculateWinner(currentSquares)
    const nextValue = calculateNextValue(currentSquares)
    const status = calculateStatus(winner, currentSquares, nextValue)

    function calculateStatus(winner, squares, nextValue) {
        return winner
            ? `Winner: player ${winner}!`
            : squares.every(Boolean)
                ? `A Draw!`
                : `Next player: ${nextValue}`
    }

    function calculateNextValue(squares) {
        return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
    }

    function calculateWinner(squares) {

        let squaresFromDom = document.querySelectorAll(".square");
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                squaresFromDom.forEach((s, index) => index == a || index == b || index == c ? s.style.backgroundColor = "blue" : '')
                return squares[a]
            }
        }
        return null
    }

    function selectSquare(square) {
        if (winner || currentSquares[square]) {
            return
        }

        const newHistory = history.slice(0, currentStep + 1)
        const squares = [...currentSquares]

        squares[square] = nextValue
        setHistory([...newHistory, squares])
        setCurrentStep(newHistory.length)
    }

    function restart() {
        document.querySelectorAll(".square").forEach(s => s.style.backgroundColor = "")
        setHistory([Array(9).fill(null)])
        setCurrentStep(0)
    }

    const moves = history.map((stepSquares, step) => {
        const desc = step ? `${step}` : '0'
        const isCurrentStep = step === currentStep
        return (
            <button key={step}
                //  className='btn white'
                className={isCurrentStep ? 'btn white' : 'circleBtn'}
                disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
                {desc} {isCurrentStep ? '(current)' : null}
            </button >
        )
    })

    return (
        <div className="game">
            <h1 className='text-white'>Tic Tac Toe</h1>
            <br />
            <h2 className='text-white'>{status}</h2>

            <div className="row game-board">
                <Board onClick={selectSquare} squares={currentSquares} />
                <button className="restart btn btn-primary" onClick={restart}>
                    restart
                </button>
            </div>
            <div className="row game-info">

                {moves.length > 0 && <h3 className='text-white'>Steps:</h3>}
                <ol>{moves}</ol>
            </div>
        </div>
    )
}
export default Game