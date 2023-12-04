import React, { useState } from 'react';
import {
  Container,
  Content,
  Title,
  LogoImage,
  ForgotPasswordButton,
  ForgotPasswordTitle,
  CreateAccount,
  Icon,
  CreateAccountTitle,
} from './styles';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from 'react-native';
import { FieldValues, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../components/Form/Button/button';
import Logo from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
import { InputControl } from '../../components/Form/InputControl/inputControl';
import { useAuth } from '../../context/AuthContext';

export interface ScreenNavigatorProp {
  navigate: (screen: string) => void;
}

export interface IFormInputs {
  [name: string]: any;
}
export type StringKeys<T> = {
  [K in keyof T]: string;
};

const formSchema = yup.object({
  email: yup.string().email('Email Inválido.').required('Informe o Email.'),
  password: yup.string().required('Informe a senha.'),
});

const getResolver = <T extends FieldValues>(
  schema: yup.AnyObjectSchema,
): Resolver<T> => yupResolver(schema);

export const SignIn: React.FunctionComponent = () => {
  const auth = useAuth();
  const [loadind, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: getResolver<IFormInputs>(formSchema),
  });

  const navigation = useNavigation<ScreenNavigatorProp>();

  const handleSignIn = (form: IFormInputs) => {
    const data = {
      email: form.email,
      password: form.password,
    };

    try {
      setLoading(true);
      auth.signIn(data);
    } catch (error) {
      Alert.alert(
        'Erro na auntenticação',
        'Ocorreu um erro ao fazer o login,verifique as credenciais.',
      );
    } finally {
      setLoading(false); // Este bloco é executado independentemente de ocorrer um erro ou não
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
            <View>
              <Title>Faça seu login</Title>
            </View>
            <InputControl
              control={control}
              error={errors.email && (errors.email.message as string)}
              name="email"
              autoCorrect={false}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <InputControl
              control={control}
              error={errors.password && (errors.password.message as string)}
              name="password"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Senha"
              secureTextEntry={true}
            />
            <Button
              title="Entrar"
              disabled={loadind || !!errors.password || !!errors.email}
              onPress={handleSubmit(handleSignIn)}
            />

            <ForgotPasswordButton
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <ForgotPasswordTitle>Esqueci minha senha</ForgotPasswordTitle>
            </ForgotPasswordButton>
          </Content>
        </Container>
      </ScrollView>
      <CreateAccount onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" />
        <CreateAccountTitle>Criar uma Conta</CreateAccountTitle>
      </CreateAccount>
    </KeyboardAvoidingView>
  );
};
