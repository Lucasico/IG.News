import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import styles from './post.module.scss';

type PostProps = {
    post: {
        slug: string;
        title: string;
        content: string;
        updateAt: string;
    };
};

export default function Post({ post }: PostProps) {
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
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>
        </>
    );
}

/**
 * Toda pagina gerada de forma estatica
 * é uma uma pagina não protegida, ou seja não pode ser getStaticProps. Assim sendo,
 * está pagina não pode ser de jeito nenhum getStatic, mais sim getServer
 */

export const getServerSideProps: GetServerSideProps = async ({
    req,
    params
}) => {
    const session = await getSession({ req });
    // console.log('session ===>', JSON.stringify(session, null, 2));
    const { slug } = params;
    //redirect em request
    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: `/posts/preview/${slug}`,
                permanent: false
            }
        };
    }

    const prismic = getPrismicClient(req);
    const response = await prismic.getByUID('publication', String(slug), {});

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updateAt: new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'long'
        }).format(new Date(response.last_publication_date))
    };

    return {
        props: {
            post
        }
    };
};
