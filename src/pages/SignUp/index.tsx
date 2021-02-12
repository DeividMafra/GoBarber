import React, { useCallback } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';

import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Background, Container, Content } from './styles';

const SignUp: React.FC = () => {
    const handleSubmit = useCallback(async (data: object) => {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required('Name is required'),
                email: Yup.string()
                    .required('Email is required')
                    .email('Please enter a valid email'),
                password: Yup.string().min(
                    10,
                    'Please enter at least 10 digits',
                ),
            });
            await schema.validate(data, {
                abortEarly: false,
            });
        } catch (error) {
            console.log(error.inner);
        }
    }, []);

    return (
        <Container>
            <Background />

            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <Input name="name" icon={FiUser} placeholder="Name" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Password"
                    />

                    <Button type="submit">Enter</Button>
                </Form>

                <a href="login">
                    <FiArrowLeft />
                    Back to login page
                </a>
            </Content>
        </Container>
    );
};

export default SignUp;
