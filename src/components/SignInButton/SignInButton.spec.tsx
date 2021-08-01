import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
    test('Renders correctly when user is not authenticated', () => {
        //usando o ts-jest para conseguir atribuir diferentes retornos de valores
        //para o mesmo mocked
        const useSessionMocked = mocked(useSession);
        //mocando o valor do retorno apenas para o primeiro retorno
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SignInButton />);
        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
    });

    test('Renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: 'John Doe',
                    email: 'John.doe@example.com'
                },
                expires: 'fake-value'
            },
            false
        ]);
        render(<SignInButton />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
});
