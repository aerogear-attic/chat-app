import Button from '@material-ui/core/Button';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import React from 'react';
import styled from 'styled-components';
import { History } from 'history';

const Container = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;

  button {
    min-width: 50px;
    width: 50px;
    height: 50px;
    border-radius: 999px;
    background-color: var(--secondary-bg);
    color: white;

    &:hover {
      background-color: var(--secondary-bg-shade);
    }
  }
`;

interface ChildComponentProps {
  history: History;
  onCreateClick: any
}

const CreateChatButton: React.FC<ChildComponentProps> = ({ history, onCreateClick }) => {
  
  return (
    <Container>
      <Button
        data-testid="new-chat-button"
        variant="contained"
        color="secondary"
        onClick={onCreateClick}>
        <ArrowIcon />
      </Button>
    </Container>
  );
};

export default CreateChatButton;