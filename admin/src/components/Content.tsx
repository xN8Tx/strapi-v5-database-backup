import type { BackupData } from 'src/types';

import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { Thead, Th, Tr, Typography, Table, VisuallyHidden, Tbody } from '@strapi/design-system';
import { Layouts, Page, useFetchClient } from '@strapi/strapi/admin';
import { getTranslation } from '../utils/getTranslation';

import { ContentItem } from './ContentItem';
import { ContentNotFound } from './ContentNotFound';

export const Content = () => {
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: 'database-backup',
    async queryFn() {
      const { data } = await get<Record<'data', BackupData[]>>('/strapi-v5-database-backup');

      return data.data;
    },
  });

  if (isLoading) {
    return <Page.Loading />;
  }

  if (isError) {
    return <Page.Error />;
  }

  return (
    <Layouts.Content>
      <Table>
        <Thead>
          <Tr>
            {/*<Th>
              <Typography variant="sigma">ID</Typography>
            </Th>*/}
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTranslation('plugin.table.title'),
                  defaultMessage: 'Title',
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTranslation('plugin.table.createdat'),
                  defaultMessage: 'Created at',
                })}
              </Typography>
            </Th>
            <Th>
              <VisuallyHidden>
                {formatMessage({
                  id: getTranslation('plugin.table.actions'),
                  defaultMessage: 'Actions',
                })}
              </VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.length > 0 &&
            data.map((entry) => <ContentItem entry={entry} key={entry.id} />)}
          {data && data.length === 0 && <ContentNotFound />}
        </Tbody>
      </Table>
    </Layouts.Content>
  );
};
