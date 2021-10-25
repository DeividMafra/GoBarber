import { act, renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
    it('should be able to sign in', async () => {
        const apiResponse = {
            user: {
                id: 'user123',
                name: 'John Doe',
                email: 'j.doe@mail.com',
            },
            token: 'test-token123',
        };

        apiMock.onPost('sessions').reply(200, apiResponse);

        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        result.current.signIn({
            email: 'j.doe@mail.com',
            password: 'password',
        });

        await waitForNextUpdate();

        expect(setItemSpy).toHaveBeenCalledWith(
            '@GoBarber:token',
            apiResponse.token,
        );
        expect(setItemSpy).toHaveBeenCalledWith(
            '@GoBarber:user',
            JSON.stringify(apiResponse.user),
        );

        expect(result.current.user.email).toEqual('j.doe@mail.com');
    });

    it('should restore data from storage when auth inits', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch (key) {
                case '@GoBarber:token':
                    return 'test-token123';
                case '@GoBarber:user':
                    return JSON.stringify({
                        id: 'user123',
                        name: 'John Doe',
                        email: 'j.doe@mail.com',
                    });
                default:
                    return null;
            }
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        expect(result.current.user.email).toEqual('j.doe@mail.com');
    });

    it('should be able to sign out', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch (key) {
                case '@GoBarber:token':
                    return 'test-token123';
                case '@GoBarber:user':
                    return JSON.stringify({
                        id: 'user123',
                        name: 'John Doe',
                        email: 'j.doe@mail.com',
                    });
                default:
                    return null;
            }
        });

        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        act(() => {
            result.current.signOut();
        });

        expect(removeItemSpy).toHaveBeenCalledTimes(2);
        expect(result.current.user).toBeUndefined();
    });

    it('should be able to update user data', async () => {
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        const user = {
            id: 'user123',
            name: 'John Doe 2',
            email: 'j.doe2@mail.com',
            avatar_url: 'image-test.jpg',
        };

        act(() => {
            result.current.updateUser(user);
        });

        expect(setItemSpy).toHaveBeenCalledWith(
            '@GoBarber:user',
            JSON.stringify(user),
        );
        expect(result.current.user).toEqual(user);
    });
});
