import styled from "styled-components";

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  padding-bottom: 6px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textLabel};
`;

const Input = styled.input`
  width: 100%;
  height: 45px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textDark};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function TextField({ id, label, ...inputProps }) {
  return (
    <FieldWrapper>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} {...inputProps} />
    </FieldWrapper>
  );
}
