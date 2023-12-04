import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  UserAvatarButton,
  UserAvatar,
  UserInfoDetail,
  UserGreeting,
  UserName,
  Icon,
  LogoutButton,
  UserList,
  UserListHeader,
  UserListEmpty,
} from './styles';
import avatarDefault from '../../assets/avatar02.png';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { IUser } from '../../model/user';
import { api } from '../../services/api';
import { User } from '../../components/User/user';

interface ScreenNavigatorProps {
  navigate: (screen: string, params?: unknown) => void;
  addListener: (event: string, callback: (...args: any[]) => void) => void;
}
export const Home: React.FunctionComponent = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { user, signOut } = useAuth();
  const { navigate, addListener } = useNavigation<ScreenNavigatorProps>();

  useEffect(() => {
    const LoadUsers = async () => {
      const response = await api.get('users');
      setUsers(response.data);
      console.log('função carregada');
    };

    const unsubscribe = addListener('focus', () => {
      // Esta função será chamada toda vez que a tela Home receber o foco
      LoadUsers();
    });

    // Certifique-se de cancelar a inscrição ao desmontar o componente
    return unsubscribe;
  }, [addListener]);

  const handleSignOut = () => {
    Alert.alert('Tem Certeza?', 'Deseja realment sair da aplicação?', [
      {
        text: 'Cancelar',
        onPress: () => {},
      },
      {
        text: 'Sair',
        onPress: () => signOut(),
      },
    ]);
  };

  const handleUserDetails = (userId: string) => {
    navigate('UserDetails', { userId });
  };

  const handleUserProfile = () => {
    navigate('UserProfile');
  };

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <UserAvatarButton onPress={handleUserProfile}>
              <UserAvatar
                source={
                  user.avatar_url ? { uri: user.avatar_url } : avatarDefault
                }
              />
            </UserAvatarButton>

            <UserInfoDetail>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>{user.name}</UserName>
            </UserInfoDetail>
          </UserInfo>
          <LogoutButton onPress={handleSignOut}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <UserList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <User data={item} onPress={() => handleUserDetails(item.id)} />
        )}
        ListHeaderComponent={<UserListHeader>Usuários</UserListHeader>}
        ListEmptyComponent={
          <UserListEmpty>Ops! ainda não há registros.</UserListEmpty>
        }
      />
    </Container>
  );
};
