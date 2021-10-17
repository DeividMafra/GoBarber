/* eslint-disable no-unused-expressions */
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { AnimationContainer, Background, Container, Content } from './styles';

interface ResetPasswordFormDate {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();
    const history = useHistory();

    const params = new URLSearchParams(window.location.search);

    const handleSubmit = useCallback(
        async (data: ResetPasswordFormDate) => {
            formRef.current?.setErrors({});

            try {
                const schema = Yup.object().shape({
                    password: Yup.string().required('Password is required'),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref('password'), null],
                        'Password must match',
                    ),
                });
                await schema.validate(data, {
                    abortEarly: false,
                });

                const { password, password_confirmation } = data;

                const token = params.get('token');

                if (!token) {
                    throw new Error();
                }

                await api.post('/password/reset', {
                    password,
                    password_confirmation,
                    token,
                });

                history.push('/signin');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }
                addToast({
                    type: 'error',
                    title: 'Password reset error',
                    description: 'Error trying to reset your password!',
                });
            }
        },
        [params, addToast, history],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Password Reset</h1>
                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="New password"
                        />
                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="Password confirmation"
                        />

                        <Button type="submit">Change password</Button>
                    </Form>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default ResetPassword;
