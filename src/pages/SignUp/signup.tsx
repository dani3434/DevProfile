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
  name: yup.string().required('Informe o nome completo'),
  email: yup.string().email('Email Inválido.').required('Informe o Email.'),
  password: yup.string().required('Informe a senha.'),
});

const getResolver = <T extends FieldValues>(
  schema: yup.AnyObjectSchema,
): Resolver<T> => yupResolver(schema);

export const SignUp: React.FunctionComponent = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: getResolver<IFormInputs>(formSchema),
  });
  const navigation = useNavigation<ScreenNavigatorProp>();

  const handleSignUp = async (form: IFormInputs) => {
    const data = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    try {
      await api.post('users', data);
      Alert.alert(
        'Cadastro Realizado',
        'Você já pode fazer login na aplicação.',
      );
    } catch (error) {
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer um cadastro.Tente Novamente.',
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
            <Title>Crie sua conta</Title>
            <InputControl
              placeholder="Nome Completo"
              control={control}
              name="name"
              error={errors.name && (errors.name.message as string)}
            />
            <InputControl
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              control={control}
              name="email"
              error={errors.email && (errors.email.message as string)}
            />
            <InputControl
              placeholder="Senha"
              secureTextEntry={true}
              control={control}
              name="password"
              error={errors.password && (errors.password.message as string)}
            />
            <Button title="Criar Conta" onPress={handleSubmit(handleSignUp)} />
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
