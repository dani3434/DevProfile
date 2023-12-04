import React from 'react';
import { Container } from './styles';
import { TextInputProps } from 'react-native';
import theme from '../../../global/styles/theme';

export const Input: React.FunctionComponent<TextInputProps> = ({
  ...otherProps
}) => {
  return (
    <Container placeholderTextColor={theme.colors.gray500} {...otherProps} />
  );
};
