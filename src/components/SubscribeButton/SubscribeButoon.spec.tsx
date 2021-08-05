import { render, screen, fireEvent } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component', () => {
    test('Renders correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />);

        expect(screen.getByText('Subscribe now')).sdf();
    });

    test('Redirects user to sing in when not authenticated', () => {
        const signInMocked = mocked(signIn);
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        //disparar um evento de click neste button
        fireEvent.click(subscribeButton);
        //espera que a função de sign tenha sido chamada, com o evento de click
        expect(signInMocked).toHaveBeenCalled();
    });

    test('Redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);

        //mock de uma função sem retorno
        const pushmock = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: 'John Doe',
                    email: 'John.doe@example.com'
                },
                activeSubscription: 'fake-value',
                expires: 'fake-value'
            },
            false
        ]);

        useRouterMocked.mockReturnValueOnce({
            push: pushmock
        } as any);

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushmock).toHaveBeenCalledWith('/posts');
    });
});
