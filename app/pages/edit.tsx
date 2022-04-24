import { useRouter } from 'next/router'

export default function EditTile() {
  const router = useRouter()
  const { tile } = router.query
  return <img src={`${tile}`} />
}
