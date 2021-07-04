import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useSession } from 'next-auth/client';
import { getPrismicClient } from '../../../services/prismic';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../post.module.scss';

type PreviewPostProps = {
    post: {
        slug: string;
        title: string;
        content: string;
        updateAt: string;
    };
};
export default function PostPreview({ post }: PreviewPostProps) {
    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`);
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updateAt}</time>

                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a href="">Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

//para gerar alguma pagina estatica no proprio build do app,
//todos os slugs que forem passados ai dentro sera uma pag gerada no buid

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//     return {
//         paths: [
//             {
//                 params: {
//                     slug: 'axios---um-cliente-http-full-stack'
//                 }
//             }
//         ],
//         fallback: 'blocking'
//     };
// };

/**
 * Toda pagina gerada de forma estatica
 * é uma uma pagina não protegida, ou seja não pode ser getStaticProps
 */

export const getStaticProps: GetStaticProps = async ({ params }) => {
    // console.log('session ===>', JSON.stringify(session, null, 2));
    const { slug } = params;

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('publication', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updateAt: new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'long'
        }).format(new Date(response.last_publication_date))
    };

    return {
        props: {
            post
        },
        revalidate: 60 * 30 //30 min
    };
};
