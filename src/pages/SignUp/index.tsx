import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import { useToast } from '../../hooks/toast';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Background, Container, AnimationContainer, Content } from './styles';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(
        async (data: SignUpFormData) => {
            try {
                formRef.current?.setErrors({});

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

                await api.post('/users', data);

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'User registered successfully!',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }
                addToast({
                    type: 'error',
                    title: 'Register error',
                    description: 'Error on registering. Please try again!',
                });
            }
        },
        [addToast, history],
    );

    return (
        <Container>
            <Background />

            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Register</h1>
                        <Input name="name" icon={FiUser} placeholder="Name" />
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
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                        Back to login page
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SignUp;
