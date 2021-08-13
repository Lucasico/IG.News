import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getSession } from 'next-auth/client';
import { getPrismicClient } from '../../src/services/prismic';
import Post, { getServerSideProps } from '../../src/pages/posts/[slug]';

const post = {
    slug: 'post-test',
    title: 'title-test',
    content: '<p>post excerpt</p>',
    updateAt: 'March, 10'
};

jest.mock('../../src/services/prismic');
jest.mock('next-auth/client');

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
});

//ctrl + D
