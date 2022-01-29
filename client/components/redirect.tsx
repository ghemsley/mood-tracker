import { useRouter } from 'next/router'
import { FunctionComponent, memo, useEffect } from 'react'
import { useMountedState, usePromise } from 'react-use'
import { Loader } from 'rsuite'

interface Props {
  to: string
}

const Redirect: FunctionComponent<Props> = memo(({ to }) => {
  const mounted = usePromise()
  const isMounted = useMountedState()
  const router = useRouter()
  useEffect(() => {
    if (isMounted()) mounted(router.push(to))
  }, [])
  return <Loader center size="lg" content="Redirecting..." />
})

Redirect.displayName = 'Redirect'

export default Redirect
