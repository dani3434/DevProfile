import React from 'react';
import {
  Container,
  Content,
  GoBackButton,
  Header,
  HeaderTitle,
  IconHeader,
  Title,
  UserAvatar,
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
import { useNavigation } from '@react-navigation/native';
import { InputControl } from '../../components/Form/InputControl/inputControl';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import avatarDefault from '../../assets/avatar02.png';

interface IFormInputs {
  [name: string]: any;
}
interface ScreenNavigatorProp {
  goBack: () => void;
}
const formSchema = yup.object({
  old_password: yup.string().required('Campo Obrigatório.'),
  password: yup.string().required('Campo Obrigatório.'),
  password_confirmation: yup
    .string()
    .required('Campo Obrigatório.')
    .when('password', (password, schema) => {
      return password
        ? schema.oneOf([yup.ref('password')], 'Confirmação Incorreta')
        : schema;
    }),
});

const getResolver = <T extends FieldValues>(
  schema: yup.AnyObjectSchema,
): Resolver<T> => yupResolver(schema);

export const UserProfilePassword: React.FunctionComponent = () => {
  const { user, updateUser } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: getResolver<IFormInputs>(formSchema),
  });
  const navigation = useNavigation<ScreenNavigatorProp>();

  const handleUpdatePassword = async (form: IFormInputs) => {
    const data = {
      name: user.name,
      email: user.email,
      old_password: form.old_password,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    try {
      const response = await api.put('profile', data);
      updateUser(response.data);
      Alert.alert('Senha Atualizada', 'Os dados da senha foram atualizados.');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro ao atualizar',
        'Ocorreu um erro ao atualizar a senha.Tente Novamente.',
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
          <Header>
            <GoBackButton onPress={navigation.goBack}>
              <IconHeader name="chevron-left" />
            </GoBackButton>

            <HeaderTitle>Usuário</HeaderTitle>
            <UserAvatar
              source={
                user.avatar_url ? { uri: user.avatar_url } : avatarDefault
              }
            />
          </Header>

          <Content>
            <Title>Alterar Senha</Title>
            <InputControl
              placeholder="Senha Atual"
              control={control}
              secureTextEntry
              name="old_password"
              error={
                errors.old_password && (errors.old_password.message as string)
              }
            />
            <InputControl
              placeholder="Nova Senha"
              control={control}
              secureTextEntry
              name="password"
              error={errors.password && (errors.password.message as string)}
            />

            <InputControl
              placeholder="Confirmar Senha"
              control={control}
              secureTextEntry
              name="password_confirmation"
              error={
                errors.password_confirmation &&
                (errors.password_confirmation.message as string)
              }
            />

            <Button
              title="Salvar Alterações"
              onPress={handleSubmit(handleUpdatePassword)}
              disabled={
                !!errors.password_confirmation ||
                !!errors.password ||
                !!errors.old_password
              }
            />
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
