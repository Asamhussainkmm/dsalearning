import { Link } from 'react-router-dom'
import { Btn, Card } from '../components/Ui'

export default function NotFound() {
  return (
    <Card className="mx-auto mt-10 max-w-lg text-center">
      <p className="text-5xl" aria-hidden>🧭</p>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-muted">This page does not exist. The link may be old or mistyped.</p>
      <div className="mt-4 flex justify-center gap-2">
        <Link to="/"><Btn>Go to Dashboard</Btn></Link>
        <Link to="/learn"><Btn variant="ghost">Browse lessons</Btn></Link>
      </div>
    </Card>
  )
}
