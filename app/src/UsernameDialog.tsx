import { useState } from 'react'
export default function UsernameDialog({
  username,
  submit,
}: {
  username: string
  submit: (arg: string) => void
}) {
  const [user, setUser] = useState(username)
  return (
    <dialog open>
      <input
        type="text"
        value={username}
        onChange={event => setUser(event.target.value)}
      />
      <button type="submit" onClick={() => submit(user)}>
        Start
      </button>
    </dialog>
  )
}
