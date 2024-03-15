import Image from 'next/image'
import gratiot from './gratiot.png'

export default function StartScreen({ startGame }: { startGame: () => void }) {
  return (
    <Image
      alt="coverscreen"
      src={gratiot}
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
