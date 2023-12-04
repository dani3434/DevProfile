import React from 'react';
import {
  BackToSignIn,
  BackToSignInTitle,
  Container,
  Content,
  Icon,
  LogoImage,
  Title,
} from './styles';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Resolver, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../components/Form/Button/button';
import Logo from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigatorProp } from '../SignIn/signIn';
import { InputControl } from '../../components/Form/InputControl/inputControl';
import { api } from '../../services/api';

interface IFormInputs {
  [name: string]: any;
}

const formSchema = yup.object({
  token: yup.string().uuid('Código Invalido').required('Informe o código'),
  password: yup.string().required('Informe a nova senha.'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Confirmação incorreta.'),
});

const getResolver = <T extends FieldValues>(
  schema: yup.AnyObjectSchema,
): Resolver<T> => yupResolver(schema);

export const Resetpassword: React.FunctionComponent = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: getResolver<IFormInputs>(formSchema),
  });
  const navigation = useNavigation<ScreenNavigatorProp>();

  const handleResetPassword = async (form: IFormInputs) => {
    const data = {
      token: form.token,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    try {
      await api.post('password/reset', data);
      Alert.alert(
        'Senha Redefinida',
        'A senha foi redefinida com sucesso. Efetue o login para acessar.',
      );
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert(
        'Erro ao resetar senha',
        'Ocorreu um erro ao resetar sua senha.Tente Novamente.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      enabled
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <Content>
            <LogoImage source={Logo} />
            <Title>Redefinir a senha</Title>
            <InputControl
              placeholder="Código"
              control={control}
              name="token"
              error={errors.token && (errors.token.message as string)}
            />
            <InputControl
              placeholder="Senha"
              secureTextEntry={true}
              control={control}
              name="password"
              error={errors.password && (errors.password.message as string)}
            />

            <InputControl
              placeholder="Senha"
              secureTextEntry={true}
              control={control}
              name="password_confirmation"
              error={
                errors.password_confirmation &&
                (errors.password_confirmation.message as string)
              }
            />
            <Button
              title="Enviar"
              onPress={handleSubmit(handleResetPassword)}
            />
          </Content>
        </Container>
      </ScrollView>
      <BackToSignIn onPress={() => navigation.navigate('SignIn')}>
        <Icon name="arrow-left" />
        <BackToSignInTitle>Fazer Login</BackToSignInTitle>
      </BackToSignIn>
    </KeyboardAvoidingView>
  );
};
