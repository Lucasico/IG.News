import { render, screen } from '@testing-library/react';
import { Header } from '.';

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            };
        }
    };
});

jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false];
        }
    };
});

describe('Header component', () => {
    test('renders correctly with links home and posts', () => {
        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Posts')).toBeInTheDocument();
    });
});
