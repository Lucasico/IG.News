import Image from 'next/image';
import Link from 'next/link';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                {/**
                 *
                 * A importação das imagens no next é diferente do padrão do react
                 * 1º ela(imgs) sempre deve estar dentro da pasta public
                 * 2º deve-se importa-las dentro do src iniciando sempre com /
                 */}
                <Link href="/">
                    <Image
                        src="/images/logo.svg"
                        alt="ig.news"
                        width={100}
                        height={115}
                        title="ig.news"
                        //placeholder="empty"
                    />
                </Link>

                <nav>
                    {/* <Link href="/">
                        <a className={styles.active}>Home</a>
                    </Link>
                    {
                        //prefetch no next deixa a pagina precarregada
                        //isso por baixo dos panos, massa
                    }
                    <Link href="/posts" prefetch>
                        <a>Posts</a>
                    </Link> */}

                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>

                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    );
}
