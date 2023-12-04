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
  email: yup.string().email('Email Inválido.').required('Informe o Email.'),
});

const getResolver = <T extends FieldValues>(
  schema: yup.AnyObjectSchema,
): Resolver<T> => yupResolver(schema);

export const ForgotPassword: React.FunctionComponent = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: getResolver<IFormInputs>(formSchema),
  });
  const navigation = useNavigation<ScreenNavigatorProp>();

  const handleForgotPassword = async (form: IFormInputs) => {
    const data = {
      email: form.email,
    };

    try {
      await api.post('password/forgot', data);
      Alert.alert(
        'Email enviado',
        'Você receberá um email com as instruções para a redefinição da senha.',
      );
      navigation.navigate('ResetPassword');
    } catch (error) {
      Alert.alert(
        'Erro no envio de email',
        'Ocorreu um erro ao enviar um email. Tente Novamente.',
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
            <Title>Esqueci minha senha</Title>

            <InputControl
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              control={control}
              name="email"
              error={errors.email && (errors.email.message as string)}
            />

            <Button
              title="Enviar"
              onPress={handleSubmit(handleForgotPassword)}
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
