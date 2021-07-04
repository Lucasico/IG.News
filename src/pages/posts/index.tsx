import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import styles from './styles.module.scss';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updateAt: string;
};

type PostProps = {
    posts: Post[];
};

export default function Posts({ posts }: PostProps) {
    return (
        <>
            <Head>
                <title>Post | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map((post: Post) => (
                        <Link href={`/posts/${post.slug}`} key={post.slug}>
                            <a>
                                <time>{post.updateAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}
/**
 *
 * SEMPRE QUE POSSIVEL FORMATE OS VALORES ASSIM QUE VOCE
 * RECEBE-LO E NÃO NO HTML
 *
 * SEMPRE QUE POSSIVEL FORMATE OS VALORES ASSIM QUE VOCE
 * RECEBE-LO E NÃO NO HTML
 *
 * SEMPRE QUE POSSIVEL FORMATE OS VALORES ASSIM QUE VOCE
 * RECEBE-LO E NÃO NO HTML
 *
 * SEMPRE QUE POSSIVEL FORMATE OS VALORES ASSIM QUE VOCE
 * RECEBE-LO E NÃO NO HTML
 *
 */
export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const response = await prismic.query(
        [Prismic.predicates.at('document.type', 'publication')],
        {
            fetch: ['publication.title', 'publication.content'],
            pageSize: 100
        }
    );

    const posts = response.results.map((post) => {
        return {
            slug: post.uid,

            title: RichText.asText(post.data.title),

            excerpt:
                post.data.content.find(
                    (content) => content.type === 'paragraph'
                )?.text ?? '',

            updateAt: new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long'
            }).format(new Date(post.last_publication_date))
        };
    });

    //boa formatação para console.log
    // console.log('response =====>', JSON.stringify(response, null, 2));
    return {
        props: { posts },
        revalidate: 60 * 60
    };
};
