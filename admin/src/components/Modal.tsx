import { ChangeEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';

import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Field, Modal, Button } from '@strapi/design-system';
import { Download } from '@strapi/icons';

import { getTranslation } from '../utils/getTranslation';
import { BackupData } from '../types';

export const CreateBackup = () => {
  const queryClient = useQueryClient();

  const { formatMessage } = useIntl();
  const { post } = useFetchClient();
  const { toggleNotification } = useNotification();

  const [title, setTitle] = useState<string>('');

  const mutation = useMutation(
    async (title: string) => {
      const response = await post<Record<'data', BackupData[]>>('/strapi-v5-database-backup', {
        title,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['database-backup']);
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: getTranslation('modal.success'),
            defaultMessage: 'Succesfully create backup.',
          }),
        });
      },
      onError: () =>
        toggleNotification({
          type: 'danger',
          message: formatMessage({
            id: getTranslation('modal.error'),
            defaultMessage: 'Error when create new backup.',
          }),
        }),
    }
  );

  const onSubmitHandler = () => {
    mutation.mutate(title);
  };

  const titleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);
  };

  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button variant="default" startIcon={<Download />}>
          {formatMessage({
            id: getTranslation('plugin.create-backup'),
            defaultMessage: 'Create backup',
          })}
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Create new backup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Field.Root name="name" required>
            <Field.Label>Title</Field.Label>
            <Field.Input value={title} onChange={titleChangeHandler} />
          </Field.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Cancel</Button>
          </Modal.Close>
          <Button onClick={onSubmitHandler}>Confirm</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
