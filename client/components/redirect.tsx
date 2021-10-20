import { useRouter } from 'next/router'
import { FunctionComponent, useEffect } from 'react'
import { Loader } from 'rsuite'

interface Props {
  to: string
}

const Redirect: FunctionComponent<Props> = ({ to }) => {
  const router = useRouter()
  useEffect(() => {
    router.push(to)
  }, [router, to])
  return <Loader center size="lg" content="Redirecting..." />
}

export default Redirect
