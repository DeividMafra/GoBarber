/* eslint-disable no-unused-expressions */
import React, { useRef, useCallback } from 'react';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Background, Container, AnimationContainer, Content } from './styles';

interface SignInFormDate {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignInFormDate) => {
            formRef.current?.setErrors({});

            try {
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Email is required')
                        .email('Please enter a valid email'),
                    password: Yup.string().required('Password is required'),
                });
                await schema.validate(data, {
                    abortEarly: false,
                });

                await signIn({
                    email: data.email,
                    password: data.password,
                });

                history.push('/dashboard');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }
                addToast({
                    type: 'error',
                    title: 'Login error',
                    description:
                        'Error on login. Please check your credentials!',
                });
            }
        },
        [signIn, addToast, history],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Password"
                        />

                        <Button type="submit">Enter</Button>
                        <Link to="forgot-password">Forgot my password</Link>
                    </Form>

                    <Link to="/signup">
                        <FiLogIn />
                        Register
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default SignIn;
