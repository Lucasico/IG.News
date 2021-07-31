import { render } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            };
        }
    };
});

describe('ActiveLink Component', () => {
    test('active link renders correctly', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Test</a>
            </ActiveLink>
        );

        //espera pegar o texto Test contido no documento
        expect(getByText('Test')).toBeInTheDocument();
    });

    test('active link is receiving active class', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Test</a>
            </ActiveLink>
        );
        //espera pegar o text o verificar se o component contem, a class active
        expect(getByText('Test')).toHaveClass('active');
    });
});
