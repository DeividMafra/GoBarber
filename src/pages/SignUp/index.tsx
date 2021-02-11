/* eslint-disable no-unused-expressions */
import React from 'react';

import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Background, Container, Content } from './styles';

const SignUp: React.FC = () => (
    <Container>
        <Background />

        <Content>
            <img src={logoImg} alt="GoBarber" />

            <form>
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
            </form>

            <a href="login">
                <FiArrowLeft />
                Back to login page
            </a>
        </Content>
    </Container>
);

export default SignUp;
