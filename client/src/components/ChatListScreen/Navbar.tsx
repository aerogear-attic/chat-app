import React from 'react';
import { Toolbar } from '@material-ui/core';
import styled from 'styled-components';

const Container = styled(Toolbar)`
    background-color: var(--primary-bg);
    color: var(--primary-text);
    font-size: 20px;
    line-height: 40px;
` as typeof Toolbar;

const Navbar: React.FC = () => (
    <Container>
        Chat App
    </Container>
);

export default Navbar;
