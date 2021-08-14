import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
//importar as dependencias
import { getSession } from 'next-auth/client';
import { getPrismicClient } from '../../src/services/prismic';
import Post, { getServerSideProps } from '../../src/pages/posts/[slug]';

const post = {
    slug: 'post-test',
    title: 'title-test',
    content: '<p>post excerpt</p>',
    updateAt: 'March, 10'
};

//mock dos imports das dependencias
jest.mock('next-auth/client');
jest.mock('../../src/services/prismic');

describe('Post page', () => {
    test('renders correctly', () => {
        render(<Post post={post} />);

        expect(screen.getByText('title-test')).toBeInTheDocument();
        expect(screen.getByText('post excerpt')).toBeInTheDocument();
    });

    test('Redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce(null);

        const response = await getServerSideProps({
            params: { slug: 'my-post-test' }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/posts/preview/my-post-test',
                    permanent: false
                })
            })
        );
    });

    test('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active'
        } as any);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {
                            type: 'heading',
                            text: 'my new post'
                        }
                    ],
                    content: [
                        {
                            type: 'paragraph',
                            text: 'post test'
                        }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any);

        const response = await getServerSideProps({
            params: { slug: 'my-post-test' }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-post-test',
                        title: 'my new post',
                        content: '<p>post test</p>',
                        updateAt: '2021 M04 1'
                    }
                }
            })
        );
    });
});

//ctrl + D
