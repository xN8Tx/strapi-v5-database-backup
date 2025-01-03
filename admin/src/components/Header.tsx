import { useIntl } from 'react-intl';

import { Layouts } from '@strapi/strapi/admin';
import { getTranslation } from '../utils/getTranslation';
import { CreateBackup } from './Modal';

export const Header = () => {
  const { formatMessage } = useIntl();

  return (
    <Layouts.Header
      title={formatMessage({
        id: getTranslation('plugin.name'),
        defaultMessage: 'Database backup',
      })}
      primaryAction={<CreateBackup />}
    />
  );
};
