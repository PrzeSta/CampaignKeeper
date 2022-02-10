import { useState } from 'react';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';

export const SessionsView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <ViewWithNavBarWrapper isOpen={isOpen} setIsOpen={setIsOpen} />;
};
