import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';
//cloneElement, me permite clonar um elemento e modificar coisas nele
interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({
    children,
    activeClassName,
    ...rest
}: ActiveLinkProps) {
    const { asPath } = useRouter();

    const className = asPath === rest.href ? activeClassName : '';

    return (
        <Link {...rest}>
            {cloneElement(children, {
                className
            })}
        </Link>
    );
}
