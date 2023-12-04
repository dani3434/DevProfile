import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  Conatiner,
  Content,
  ContentTitle,
  EmailData,
  EmailTitle,
  GoBackButton,
  Header,
  HeaderTitle,
  Icon,
  NameData,
  NameTitle,
  UserAvatar,
  UserDetailAvatar,
  UserEmailDetail,
  UserNameDetail,
} from './styles';
import { IUser } from '../../model/user';
import { api } from '../../services/api';
import avatarDefault from '../../assets/avatar02.png';
import { useAuth } from '../../context/AuthContext';

interface RouteParams {
  userId: string;
}
interface ScreenNavigationProps {
  goBack: () => void;
}
export const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = useState<IUser>({} as IUser);
  const route = useRoute();
  const { userId } = route.params as RouteParams;
  const { user } = useAuth();
  const { goBack } = useNavigation<ScreenNavigationProps>();

  useEffect(() => {
    const loadUser = async () => {
      const response = await api.get(`/users/${userId}`);
      setUserDetails(response.data);
    };

    loadUser();
  }, [userId]);

  return (
    <Conatiner>
      <Header>
        <GoBackButton onPress={goBack}>
          <Icon name="chevron-left" />
        </GoBackButton>

        <HeaderTitle>Usuário</HeaderTitle>
        <UserAvatar
          source={user.avatar_url ? { uri: user.avatar_url } : avatarDefault}
        />
      </Header>

      <Content>
        <ContentTitle>Detalhes do Usuário</ContentTitle>
        <UserDetailAvatar
          source={
            userDetails.avatar_url
              ? { uri: userDetails.avatar_url }
              : avatarDefault
          }
        />

        <UserNameDetail>
          <NameTitle>Name</NameTitle>
          <NameData>{userDetails.name}</NameData>
        </UserNameDetail>

        <UserEmailDetail>
          <EmailTitle>Email</EmailTitle>
          <EmailData>{userDetails.email}</EmailData>
        </UserEmailDetail>
      </Content>
    </Conatiner>
  );
};
