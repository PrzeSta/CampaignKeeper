import { useState } from 'react';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';

export const NotesView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  return (
    <ViewWithNavBarWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dialogType={dialogType}
      setDialogType={setDialogType}
    />
  );
};