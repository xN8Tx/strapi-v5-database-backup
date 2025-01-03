import type { BackupData } from '../types';
import { useIntl } from 'react-intl';

import { Trash, Download } from '@strapi/icons';
import {
  Td,
  Tr,
  Typography,
  IconButtonGroup,
  Flex,
  Button,
  IconButton,
  Box,
} from '@strapi/design-system';

import { getTranslation } from '../utils/getTranslation';
import { useMutation, useQueryClient } from 'react-query';
import { Page, useFetchClient, useNotification } from '@strapi/strapi/admin';

export const ContentItem = ({ entry }: { entry: BackupData }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();

  const { del, get } = useFetchClient();
  const { toggleNotification } = useNotification();

  const { mutate: deleteBackup, isLoading: isDelete } = useMutation(
    async () => {
      const response = await del<Record<'data', BackupData[]>>(
        `/strapi-v5-database-backup/${entry.id}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['database-backup']);
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: getTranslation('deleteAction.success'),
            defaultMessage: 'Succesfully delete backup.',
          }),
        });
      },
      onError: () =>
        toggleNotification({
          type: 'danger',
          message: formatMessage({
            id: getTranslation('deleteAction.error'),
            defaultMessage: 'Error when delete backup.',
          }),
        }),
    }
  );

  const { mutate: restoreBackup, isLoading: isRestore } = useMutation(
    async () => {
      const response = await get<Record<'data', BackupData[]>>(
        `/strapi-v5-database-backup/${entry.id}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['database-backup']);
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: getTranslation('restoreAction.success'),
            defaultMessage: 'Succesfully restore backup.',
          }),
        });
      },
      onError: () =>
        toggleNotification({
          type: 'danger',
          message: formatMessage({
            id: getTranslation('restoreAction.error'),
            defaultMessage: 'Error when restore backup.',
          }),
        }),
    }
  );

  if (isRestore || isDelete) {
    return <Page.Loading />;
  }

  const onDeleteHandler = () => {
    deleteBackup();
  };

  const onRestoreHandler = () => {
    restoreBackup();
  };

  return (
    <Tr>
      {/*<Td>
        <Typography textColor="neutral800">{entry.id}</Typography>
      </Td>*/}
      <Td>
        <Typography textColor="neutral800">{entry.title}</Typography>
      </Td>
      <Td>
        <Typography textColor="neutral800">{new Date(entry.createdAt).toLocaleString()}</Typography>
      </Td>
      <Td>
        <Flex style={{ justifyContent: 'flex-end' }}>
          <Button onClick={onRestoreHandler}>
            {formatMessage({
              id: getTranslation('plugin.table.restore'),
              defaultMessage: 'Restore',
            })}
          </Button>
          <Box paddingLeft={4}>
            <IconButtonGroup>
              <IconButton
                onClick={() => console.log('download')}
                label={formatMessage({
                  id: getTranslation('plugin.table.download'),
                  defaultMessage: 'Download',
                })}
                borderWidth={0}
              >
                <Download />
              </IconButton>
              <IconButton
                variant="danger-light"
                onClick={onDeleteHandler}
                label={formatMessage({
                  id: getTranslation('plugin.table.delete'),
                  defaultMessage: 'Delete',
                })}
                borderWidth={0}
              >
                <Trash />
              </IconButton>
            </IconButtonGroup>
          </Box>
        </Flex>
      </Td>
    </Tr>
  );
};
