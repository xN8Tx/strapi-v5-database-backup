import { useIntl } from 'react-intl';

import { Page } from '@strapi/strapi/admin';
import { Header } from '../components/Header';
import { Content } from '../components/Content';

const HomePage = () => {
  const { formatMessage } = useIntl();
  return (
    <Page.Main>
      <Header />
      <Content />
    </Page.Main>
  );
};

export { HomePage };
