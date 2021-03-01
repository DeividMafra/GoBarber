/* eslint-disable no-unused-expressions */
import React, { useRef, useCallback } from 'react';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Background, Container, Content } from './styles';

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback(async (data: object) => {
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
        } catch (err) {
            // console.log(err.inner);

            const errors = getValidationErrors(err);

            formRef.current?.setErrors(errors);
        }
    }, []);

    return (
        <Container>
            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Password"
                    />

                    <Button type="submit">Enter</Button>
                    <a href="forgot">Forgot my password</a>
                </Form>

                <a href="register">
                    <FiLogIn />
                    Register
                </a>
            </Content>

            <Background />
        </Container>
    );
};

export default SignIn;
