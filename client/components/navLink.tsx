import { forwardRef, LegacyRef } from 'react'
import { Nav } from 'rsuite'
import Link from 'next/link'

const NavLink = forwardRef(
  (
    props: React.ComponentPropsWithRef<typeof Link>,
    ref: LegacyRef<HTMLAnchorElement>
  ): React.ReactElement => {
    const { href, as, ...rest } = props
    return (
      <Link href={href} as={as}>
        <a ref={ref} {...rest} />
      </Link>
    )
  }
)

NavLink.displayName = 'NavLink'
export default NavLink
