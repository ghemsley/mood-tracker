import { useRouter } from 'next/router'
import { FunctionComponent, memo } from 'react'
import { useMount } from 'react-use'
import { Loader } from 'rsuite'

interface Props {
  to: string
}

const Redirect: FunctionComponent<Props> = memo(({ to }) => {
  const router = useRouter()
  useMount(() => {
    router.push(to)
  })
  return <Loader center size="lg" content="Redirecting..." />
})

Redirect.displayName = 'Redirect'

export default Redirect
