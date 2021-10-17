/* eslint-disable no-unused-expressions */
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { AnimationContainer, Background, Container, Content } from './styles';

interface ForgotPasswordFormDate {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: ForgotPasswordFormDate) => {
            formRef.current?.setErrors({});

            try {
                setLoading(true);
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Email is required')
                        .email('Please enter a valid email'),
                });
                await schema.validate(data, {
                    abortEarly: false,
                });

                // password recovery
                await api.post('/password/forgot', {
                    email: data.email,
                });

                addToast({
                    type: 'success',
                    title: 'Password recovery email sent',
                    description:
                        'We sent you an email to recovery your password!',
                });
                // history.push('/dashboard');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }
                addToast({
                    type: 'error',
                    title: 'Password recovery error',
                    description:
                        'Error trying to recovery your password. Please try again!',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Password Recovery</h1>
                        <Input
                            name="email"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Button loading={loading} type="submit">
                            Recovery
                        </Button>
                    </Form>

                    <Link to="/signin">
                        <FiLogIn />
                        Back to Login
                    </Link>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default ForgotPassword;
