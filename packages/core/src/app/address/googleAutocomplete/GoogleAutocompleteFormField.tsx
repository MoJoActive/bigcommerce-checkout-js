import { FormField as FormFieldType } from '@bigcommerce/checkout-sdk';
import classNames from 'classnames';
import { FieldProps } from 'formik';
import React, { FunctionComponent, memo, useCallback, useMemo } from 'react';

import { TranslatedString } from '@bigcommerce/checkout/locale';
import { useStyleContext } from '@bigcommerce/checkout/payment-integration-api';

import { AutocompleteItem } from '../../ui/autocomplete';
import { FormField, Label } from '../../ui/form';
import {
    getAddressFormFieldInputId,
    getAddressFormFieldLabelId,
} from '../getAddressFormFieldInputId';

import GoogleAutocomplete from './GoogleAutocomplete';

export interface GoogleAutocompleteFormFieldProps {
    apiKey: string;
    field: FormFieldType;
    countryCode?: string;
    supportedCountries: string[];
    nextElement?: HTMLElement;
    parentFieldName?: string;
    isFloatingLabelEnabled?: boolean;
    onSelect(place: google.maps.places.PlaceResult, item: AutocompleteItem): void;
    onToggleOpen?(state: { inputValue: string; isOpen: boolean }): void;
    onChange(value: string, isOpen: boolean): void;
}

const GoogleAutocompleteFormField: FunctionComponent<GoogleAutocompleteFormFieldProps> = ({
    field: { default: placeholder, name, maxLength },
    countryCode,
    supportedCountries,
    parentFieldName,
    nextElement,
    apiKey,
    onSelect,
    onChange,
    onToggleOpen,
    isFloatingLabelEnabled,
}) => {
    const fieldName = parentFieldName ? `${parentFieldName}.${name}` : name;

    const { newFontStyle } = useStyleContext();
    const labelContent = useMemo(() => <TranslatedString id="address.address_line_1_label" />, []);

    const labelId = getAddressFormFieldLabelId(name);

    const inputProps = useMemo(
        () => ({
            className: classNames(
                'form-input optimizedCheckout-form-input',
                { 'floating-input': isFloatingLabelEnabled },
                { 'floating-form-field-input': newFontStyle },
            ),
            id: getAddressFormFieldInputId(name),
            'aria-labelledby': labelId,
            placeholder: isFloatingLabelEnabled ? ' ' : placeholder,
            labelText: isFloatingLabelEnabled ? labelContent : null,
            maxLength: maxLength || undefined,
        }),
        [name, labelId, placeholder, labelContent, maxLength],
    );

    const renderInput = useCallback(
        ({ field }: FieldProps) => (
            <GoogleAutocomplete
                apiKey={apiKey}
                componentRestrictions={countryCode ? { country: countryCode } : undefined}
                initialValue={field.value}
                inputProps={inputProps}
                isAutocompleteEnabled={
                    countryCode ? supportedCountries.includes(countryCode) : false
                }
                nextElement={nextElement}
                onChange={onChange}
                onSelect={onSelect}
                onToggleOpen={onToggleOpen}
            />
        ),
        [
            apiKey,
            countryCode,
            inputProps,
            nextElement,
            onChange,
            onSelect,
            onToggleOpen,
            supportedCountries,
        ],
    );

    const renderLabel = isFloatingLabelEnabled ? null : (
        <Label additionalClassName={newFontStyle ? 'body-regular' : ''} htmlFor={inputProps.id} id={labelId}
            isFloatingLabelEnabled={isFloatingLabelEnabled}>
            {labelContent}
        </Label>
    );

    return (
        <div
            className={classNames(
                'dynamic-form-field dynamic-form-field--addressLineAutocomplete',
                { 'floating-form-field': isFloatingLabelEnabled },
            )}
            data-test="google-autocomplete-form-field"
        >
            <FormField
                input={renderInput}
                isFloatingLabelEnabled={isFloatingLabelEnabled}
                label={renderLabel}
                name={fieldName}
                newFontStyle={newFontStyle}
            />
        </div>
    );
};

export default memo(GoogleAutocompleteFormField);
