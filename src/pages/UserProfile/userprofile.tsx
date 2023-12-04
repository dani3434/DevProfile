import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Conatiner,
  Content,
  EmailData,
  EmailTitle,
  GoBackButton,
  Header,
  HeaderTitle,
  HeaderTop,
  Icon,
  NameData,
  NameTitle,
  PhotoButton,
  PhotoContainer,
  UserAvatar,
  UserEmailDetail,
  UserNameDetail,
} from './styles';
import avatarDefault from '../../assets/avatar02.png';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Form/Button/button';

interface ScreenNavigationProps {
  goBack: () => void;
  navigate: (screen: string) => void;
}
export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation<ScreenNavigationProps>();

  return (
    <Conatiner>
      <Header>
        <HeaderTop>
          <GoBackButton onPress={goBack}>
            <Icon name="chevron-left" />
          </GoBackButton>

          <HeaderTitle>Seu perfil</HeaderTitle>
        </HeaderTop>

        <PhotoContainer>
          <UserAvatar
            source={user.avatar_url ? { uri: user.avatar_url } : avatarDefault}
          />
          <PhotoButton>
            <Icon name="camera" />
          </PhotoButton>
        </PhotoContainer>
      </Header>

      <Content>
        <UserNameDetail>
          <NameTitle>Name</NameTitle>
          <NameData>{user.name}</NameData>
        </UserNameDetail>

        <UserEmailDetail>
          <EmailTitle>Email</EmailTitle>
          <EmailData>{user.email}</EmailData>
        </UserEmailDetail>

        <Button
          title="Editar dados"
          onPress={() => navigate('UserProfileEdit')}
        />
        <Button
          title="Trocar senha"
          onPress={() => navigate('UserProfilePassword')}
        />
      </Content>
    </Conatiner>
  );
};
