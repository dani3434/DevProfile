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
  name: yup.string().required('Informe o nome completo'),
  email: yup.string().email('Email Inválido.').required('Informe o Email.'),
});

const getResolver = <T extends FieldValues>(
  schema: yup.AnyObjectSchema,
): Resolver<T> => yupResolver(schema);

export const UserProfileEdit: React.FunctionComponent = () => {
  const { user, updateUser } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: getResolver<IFormInputs>(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });
  const navigation = useNavigation<ScreenNavigatorProp>();

  const handleProfileEdit = async (form: IFormInputs) => {
    const data = {
      name: form.name,
      email: form.email,
    };

    try {
      const response = await api.put('profile', data);
      updateUser(response.data);
      Alert.alert('Perfil Atualizado', 'Os dados de perfil foram atualizados.');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro ao atualizar',
        'Ocorreu um erro ao atualizar o perfil.Tente Novamente.',
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
            <Title>Editar Dados</Title>
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

            <Button
              title="Salvar Alterações"
              onPress={handleSubmit(handleProfileEdit)}
              disabled={!!errors.name || !!errors.email}
            />
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
