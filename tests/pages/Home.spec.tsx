import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

//importando
import { stripe } from '../../src/services/stripe';
import Home, { getStaticProps } from '../../src/pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
    return {
        useSession: () => [null, false]
    };
});
//usando
jest.mock('../../src/services/stripe.ts');

describe('Home Page', () => {
    test('Renders Correctly', () => {
        render(<Home product={{ priceId: 'fake-price', amount: 'R$10.00' }} />);
        expect(screen.getByText('for R$10.00 month')).toBeInTheDocument();
    });

    test('Loads initial data', async () => {
        const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

        retriveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        );
    });
});
