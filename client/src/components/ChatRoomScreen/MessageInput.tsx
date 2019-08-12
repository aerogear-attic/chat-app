import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  padding: 5px;
  margin-top: 20px;
  border-top: 1px solid #f1f1f1;
  width: calc(100% - 10px);
`;

const InputContainer = styled.div`
  flex: 1;
  flex-row: row;
  margin: 10px 20px;
`;

const ActualInput = styled.input`
font-family: var(--font-family) !important;
  width: calc(100% - 50px);
  border: none;
  font-size: 10px;
  outline: none;
  font-size: 18px;
  line-height: 45px;
`;

const Meta = styled.div`
  color: var(--secondary-bg);
  font-size: 25px;
`;

const SendButton = styled(Button)`
  background-color: var(--primary-bg) !important;
  color: white !important;
  min-width: 50px !important;
  width: 50px !important;
  height: 50px;
  border-radius: 999px !important;
  padding-left: 20px !important;
  margin: auto 20px auto 5px !important;

  svg {
    margin-left: -3px;
  }
`;

interface MessageInputProps {
  onSendMessage(content: string): any;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const onKeyPress = (e: any) => {
    if (e.charCode === 13) {
      submitMessage();
    }
  };

  const onChange = ({ target }: any) => {
    setMessage(target.value);
  };

  const submitMessage = () => {
    if (!message) return;

    setMessage('');

    if (typeof onSendMessage === 'function') {
      onSendMessage(message);
    }
  };

  return (
    <Container>
      <InputContainer>
        <ActualInput
          data-testid="message-input"
          type="text"
          placeholder="Type a message"
          value={message}
          onKeyPress={onKeyPress}
          onChange={onChange}
        />
        <Meta>
          &#9786;
          &#128206;
        </Meta>
      </InputContainer>
      <SendButton
        data-testid="send-button"
        variant="contained"
        onClick={submitMessage}>
        <SendIcon />
      </SendButton>

    </Container>
  );
};

export default MessageInput;
