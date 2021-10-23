import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
    return {
        useField() {
            return {
                fieldName: 'email',
                defaultValue: '',
                error: '',
                registerField: jest.fn(),
            };
        },
    };
});

describe('Input component', () => {
    it('should be able to render an input', () => {
        const { getByPlaceholderText } = render(
            <Input name="email" placeholder="E-mail" />,
        );
        expect(getByPlaceholderText('E-mail')).toBeTruthy();
    });

    it('should highlight input when focus is on', async () => {
        const { getByPlaceholderText, getByTestId } = render(
            <Input name="email" placeholder="E-mail" />,
        );

        const inputElement = getByPlaceholderText('E-mail');
        const containerElement = getByTestId('input-container');

        fireEvent.focus(inputElement);

        await waitFor(() => {
            expect(containerElement).toHaveStyle('border-color: #ff9000');
            expect(containerElement).toHaveStyle('color: #ff9000');
        });
    });

    it('should not highlight input when it is blurred', async () => {
        const { getByPlaceholderText, getByTestId } = render(
            <Input name="email" placeholder="E-mail" />,
        );

        const inputElement = getByPlaceholderText('E-mail');
        const containerElement = getByTestId('input-container');

        fireEvent.blur(inputElement);

        await waitFor(() => {
            expect(containerElement).not.toHaveStyle('border-color: #ff9000');
            expect(containerElement).not.toHaveStyle('color: #ff9000');
        });
    });

    it('should keep the input border highlighted when it filled', async () => {
        const { getByPlaceholderText, getByTestId } = render(
            <Input name="email" placeholder="E-mail" />,
        );

        const inputElement = getByPlaceholderText('E-mail');
        const containerElement = getByTestId('input-container');

        fireEvent.change(inputElement, {
            target: { value: 'mail@mail.com' },
        });

        fireEvent.blur(inputElement);

        await waitFor(() => {
            expect(containerElement).toHaveStyle('color: #ff9000');
        });
    });
});
