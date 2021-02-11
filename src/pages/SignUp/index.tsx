import React from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Background, Container, Content } from './styles';

const SignUp: React.FC = () => {
    function handleSubmit(data): void {
        console.log(data);
    }

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
