import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
    return {
        useHistory: () => ({
            push: mockedHistoryPush,
        }),
        Link: ({ children }: { children: React.ReactNode }) => children,
    };
});

jest.mock('../../hooks/auth', () => {
    return {
        useAuth: () => ({
            signIn: mockedSignIn,
        }),
    };
});

jest.mock('../../hooks/toast', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast,
        }),
    };
});

describe('SignIn Page', () => {
    beforeEach(() => {
        mockedHistoryPush.mockClear();
    });
    it('Should be able to signin', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn />);

        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Password');
        const buttonElement = getByText('Enter');

        fireEvent.change(emailField, {
            target: { value: 'johndoe@sample.com' },
        });
        fireEvent.change(passwordField, {
            target: { value: 'password' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() =>
            expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard'),
        );
    });

    it('Should not be able to signin with invalid credential', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn />);

        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Password');
        const buttonElement = getByText('Enter');

        fireEvent.change(emailField, {
            target: { value: 'invalid-email' },
        });
        fireEvent.change(passwordField, {
            target: { value: 'password' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() => expect(mockedHistoryPush).not.toHaveBeenCalled());
    });

    it('Should display a toast message when trying to signin with invalid credential', async () => {
        mockedSignIn.mockImplementation(() => {
            throw new Error();
        });

        const { getByPlaceholderText, getByText } = render(<SignIn />);

        const emailField = getByPlaceholderText('E-mail');
        const passwordField = getByPlaceholderText('Password');
        const buttonElement = getByText('Enter');

        fireEvent.change(emailField, {
            target: { value: 'johndoe@sample.com' },
        });
        fireEvent.change(passwordField, {
            target: { value: 'password' },
        });

        fireEvent.click(buttonElement);

        await waitFor(() =>
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error',
                }),
            ),
        );
    });
});
