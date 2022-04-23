export default function StartScreen({ startGame }: { startGame: Function }) {
  return (
    <img
      alt="coverscreen"
      src="img/gratiot.png"
      tabIndex={-1}
      onClick={() => startGame()}
      onKeyDown={event => {
        if (event.key === ' ') {
          startGame()
        }
      }}
      width={800}
      height={600}
      style={{ border: '1px solid black' }}
    />
  )
}
