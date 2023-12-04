import React from 'react';
import { Container, Error } from './styles';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { Input } from '../Input/input';
import { IFormInputs } from '../../../pages/SignIn/signIn';

interface Props extends TextInputProps {
  control: Control<IFormInputs>;
  name: string;
  error: string | undefined;
}

export const InputControl: React.FunctionComponent<Props> = ({
  control,
  name,
  error,
  ...otherProps
}) => {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input onChangeText={onChange} value={value} {...otherProps} />
        )}
        name={name}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
};
