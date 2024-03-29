import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { ReferenceFieldsState } from '../../../../../types/types';
import {
  convertReferenceFieldToString,
  getUpdatedReferenceField,
} from '../../../../../utils/utils';
import { AddReferenceDialog } from '../../../../components/AddReferenceDialog/AddReferenceDialog';
import { FieldTextArea } from '../../../../components/FieldTextArea/FieldTextArea';
import { Schema } from '../../../codexSlice';

type CodexFieldListProps = {
  currentSchema: Schema;
  fields: ReferenceFieldsState;
  setFields: (newEntryFields: ReferenceFieldsState) => void;
};

/**
 * Component responsible for displaying all fields from new/edited entry.
 * Contains dialog used to add reference to another object to entry field
 * @param props
 * @returns
 */
export const CodexFieldList: React.FC<CodexFieldListProps> = props => {
  const [currentField, setCurrentField] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleFieldInput = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const newValue = event.target.value;
    const newFields = props.fields;
    newFields[fieldName] = getUpdatedReferenceField(newFields[fieldName], newValue);
    props.setFields({ ...newFields });
  };

  const renderFields = () =>
    props.currentSchema.fields.map(fieldName => (
      <FieldTextArea
        key={fieldName}
        name={fieldName}
        value={convertReferenceFieldToString(props.fields[fieldName])}
        onChange={event => handleFieldInput(event, fieldName)}
        setCurrentField={setCurrentField}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />
    ));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ width: '100%' }}
      >
        {renderFields()}
      </Stack>
      <AddReferenceDialog
        currentField={currentField}
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        fields={props.fields}
        setFields={props.setFields}
      />
    </Box>
  );
};
