import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import { Loader } from 'rsuite'

interface Props {
  to: string
}

const Redirect: FunctionComponent<Props> = ({ to }) => {
  const router = useRouter()
  router.push(to)
  return <Loader center size="lg" content="Redirecting..." />
}

export default Redirect
