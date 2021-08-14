import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
//importar as dependencias
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/client';
import { getPrismicClient } from '../../src/services/prismic';
import Post, { getStaticProps } from '../../src/pages/posts/preview/[slug]';

const post = {
    slug: 'post-test',
    title: 'title-test',
    content: '<p>post excerpt</p>',
    updateAt: 'March, 10'
};

//mock dos imports das dependencias
jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../src/services/prismic');

describe('Post preview page', () => {
    test('renders correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<Post post={post} />);

        expect(screen.getByText('title-test')).toBeInTheDocument();
        expect(screen.getByText('post excerpt')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    test('Redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            {
                activeSubscription: 'fake-active'
            },
            false
        ] as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any);

        render(<Post post={post} />);

        expect(pushMock).toHaveBeenCalledWith('/posts/post-test');
    });

    test('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

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

        const response = await getStaticProps({
            params: { slug: 'post-test' }
        });

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'post-test',
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
