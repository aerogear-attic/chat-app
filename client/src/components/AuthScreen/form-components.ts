import MaterialButton from '@material-ui/core/Button';
import MaterialTextField from '@material-ui/core/TextField';
import styled from 'styled-components';

export const SignForm = styled.div`
  height: calc(100% - 265px);
`;

export const ActualForm = styled.form`
  padding: 20px;
`;

export const Section = styled.div`
  padding-bottom: 35px;
`;

export const Legend = styled.legend`
  font-weight: bold;
  color: white;
`;

export const Label = styled.label`
`;

export const Input = styled.input`
  color: black;

  &::placeholder {
    color: var(--secondary-bg);
  }
`;

export const TextField = styled(MaterialTextField)`
  width: 100%;
  position: relative;

  > div::before {
    border-color: #f1f1f1 !important;
  }

  input {
    color: black !important;

    &::placeholder {
      color: var(--secondary-bg) !important;
    }
  }

  label {
  }
`;

export const Button = styled(MaterialButton)`
  width: 100px;
  display: block !important;
  margin: auto !important;
  background-color: var(--secondary-bg) !important;

  &[disabled] {
    color: rgba(255,255,255, 0.5) !important;
  }

  &:not([disabled]) {
    color: white;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 15px;
  margin-top: 20px;
`;
