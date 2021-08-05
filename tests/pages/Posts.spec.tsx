import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../src/services/prismic';
import Posts, { getStaticProps } from '../../src/pages/posts';

jest.mock('../../src/services/prismic');
const posts = [
    {
        slug: 'post-test',
        title: 'title-test',
        excerpt: 'post excerpt',
        updateAt: 'March, 10'
    }
];

describe('Posts page', () => {
    test('renders correctly', () => {
        render(<Posts posts={posts} />);

        expect(screen.getByText('title-test')).toBeInTheDocument();
        expect(screen.getByText('post excerpt')).toBeInTheDocument();
        expect(screen.getByText('March, 10')).toBeInTheDocument();
    });

    test('Loads initial data', async () => {
        const getPrimicClientMocked = mocked(getPrismicClient);

        getPrimicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-test-post',
                        data: {
                            title: [
                                {
                                    type: 'heading',
                                    text: 'My new post'
                                }
                            ],
                            content: [
                                {
                                    type: 'paragraph',
                                    text: 'text test'
                                }
                            ]
                        },
                        last_publication_date: '04-01-2021'
                    }
                ]
            })
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [
                        {
                            slug: 'my-test-post',
                            title: 'My new post',
                            excerpt: 'text test',
                            updateAt: '2021 M04 1'
                        }
                    ]
                }
            })
        );
    });
});

//ctrl + D
