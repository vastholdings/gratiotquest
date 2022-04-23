import { useLocalStorage } from './util'
export default function UsernameDialog({
  username,
  submit,
}: {
  username: string
  submit: (arg: string) => void
}) {
  const [user, setUser] = useLocalStorage('username', username)
  return (
    <dialog open>
      <div className="userdialog">
        <h1>Name your creature</h1>
        <input
          type="text"
          value={user}
          onChange={event => setUser(event.target.value)}
        />
        <button type="submit" onClick={() => submit(user)}>
          Submit
        </button>
      </div>
    </dialog>
  )
}
