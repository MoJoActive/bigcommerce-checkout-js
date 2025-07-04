import { createCheckoutService } from '@bigcommerce/checkout-sdk';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { getCustomer } from '@bigcommerce/checkout/test-mocks';

import PayPalFastlaneShippingAddressForm, {
    PayPalFastlaneAddressComponentRef,
    PayPalFastlaneStaticAddressProps,
} from './PayPalFastlaneShippingAddressForm';

jest.mock('@bigcommerce/checkout/locale', () => ({
    __esModule: true,
    withDate: jest.fn().mockReturnValue({ locale: 'en' }),
    localizeAddress: jest.fn().mockReturnValue({ firstName: 'test-name' }),
    language: jest.fn().mockReturnValue({ translate: jest.fn().mockReturnValue('string') }),
    TranslatedString: () => {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    },
}));

jest.mock('../../ui/src/form/DynamicFormField', () => ({
    __esModule: true,
    DynamicFormField: () => {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    },
}));

describe('PayPalFastlaneShippingAddressForm', () => {
    let component;
    let defaultProps: PayPalFastlaneStaticAddressProps;
    const checkoutService = createCheckoutService();

    beforeEach(() => {
        defaultProps = {
            address: getCustomer().addresses[0],
            paypalFastlaneShippingComponentRef:
                React.createRef<PayPalFastlaneAddressComponentRef>(),
            formFields: [
                {
                    custom: false,
                    default: 'NO PO BOX',
                    id: 'field_18',
                    label: 'Address Line 1',
                    name: 'address1',
                    required: true,
                },
                {
                    custom: true,
                    default: '',
                    id: 'field_19',
                    label: 'Address Line 2',
                    name: 'address2',
                    required: false,
                },
            ],
            isLoading: false,
            methodId: 'method',
            deinitialize: jest.fn(),
            initialize: jest.fn(),
            onAddressSelect: jest.fn(),
            onFieldChange: jest.fn(),
            onUnhandledError: jest.fn(),
            countries: [
                {
                    code: 'US',
                    name: 'United States',
                    hasPostalCodes: true,
                    requiresState: true,
                    subdivisions: [
                        { code: 'CA', name: 'California' },
                        { code: 'TX', name: 'Texas' },
                    ],
                },
            ],
        };
    });

    it('renders PayPalFastlaneShippingAddressForm', () => {
        component = render(<PayPalFastlaneShippingAddressForm {...defaultProps} />);

        expect(screen.getByText('test-name')).toBeInTheDocument();
    });
});
