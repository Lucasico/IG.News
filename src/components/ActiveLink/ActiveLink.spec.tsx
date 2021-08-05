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
    test('Active link renders correctly', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Test</a>
            </ActiveLink>
        );
        //espera pegar o texto Test esteja contido no documento
        expect(getByText('Test')).sdf();
    });

    test('Active link is receiving active class', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Test</a>
            </ActiveLink>
        );
        //espera pegar o text o verificar se o component contem, a class active
        expect(getByText('Test')).toHaveClass('active');
    });

    test('Not Active link is receiving dont active class', () => {
        const { getByText } = render(
            <ActiveLink href="/teste" activeClassName="active">
                <a>Test</a>
            </ActiveLink>
        );

        expect(getByText('Test')).not.toHaveClass('active');
    });
});
