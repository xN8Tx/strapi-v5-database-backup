import { Td, Tr, EmptyStateLayout } from '@strapi/design-system';
import { EmptyDocuments } from '@strapi/icons/symbols';

import { getTranslation } from '../utils/getTranslation';
import { useIntl } from 'react-intl';

export const ContentNotFound = () => {
  const { formatMessage } = useIntl();

  return (
    <Tr>
      <Td colSpan={3}>
        <EmptyStateLayout
          content={formatMessage({
            id: getTranslation('dataNotFound.message'),
            defaultMessage: 'Data content found',
          })}
          hasRadius
          icon={<EmptyDocuments width="16rem" />}
        />
      </Td>
    </Tr>
  );
};
