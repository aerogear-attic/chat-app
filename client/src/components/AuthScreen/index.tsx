import React from 'react';
import { useMemo } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import AnimatedSwitch from '../AnimatedSwitch';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { RouteComponentProps } from 'react-router-dom';

const Container = styled.div`
  background: white;
  color: #0a0a0a;

  form {
    font-family: var(--font-family) !important;
    margin: 30pt auto;
    width: 70%;
    text-align: center;
  }
`;

const Intro = styled.div`
`;

const TitleIcon = styled.div`
  font-size: 30pt;
  width: 100%;
  text-align: center;
  color: black;
  width: 125px;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding-top: 70px;
  display: block;
`;

const Title = styled.h2`
  width: 100%;
  text-align: center;
  font-size: 2em;
  color: #0a0a0a;
`;

// eslint-disable-next-line
const Alternative = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;

  label {
    color: var(--secondary-bg);
  }
`;

const AuthScreen: React.FC<RouteComponentProps<any>> = ({
  history,
  location,
}) => {
  const alternative = useMemo(() => {
    if (location.pathname === '/sign-in') {
      const handleSignUp = () => {
        history.replace('/sign-up');
      };

      return (
        <Alternative>
          Don't have an account yet?{' '}
          <label onClick={handleSignUp}>Sign up!</label>
        </Alternative>
      );
    } else {
      const handleSignIn = () => {
        history.replace('/sign-in');
      };

      return (
        <Alternative>
          Already have an accout? <label onClick={handleSignIn}>Sign in!</label>
        </Alternative>
      );
    }
  }, [location.pathname, history]);

  return (
    <Container className="AuthScreen Screen">
      <Intro className="AuthScreen-intro">
        <TitleIcon>&#x1F64C;</TitleIcon>
        <Title className="Title-icon">Chat App</Title>
      </Intro>
      <AnimatedSwitch>
        <Route exact path="/sign-in" component={SignInForm} />
        <Route exact path="/sign-up" component={SignUpForm} />
      </AnimatedSwitch>
      {alternative}
    </Container>
  );
};

export default AuthScreen;
