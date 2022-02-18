import { Add, Delete, QuestionMark, Save } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { FabIcon } from '../../../types/types';

type FabContentWrapperProps = {
  text: string;
  icon: FabIcon;
};

export const FabContentWrapper: React.FC<FabContentWrapperProps> = props => {
  const renderIcon = () => {
    switch (props.icon) {
      case FabIcon.Add:
        return <Add />;
      case FabIcon.Save:
        return <Save />;
      case FabIcon.Delete:
        return <Delete />;
      default:
        return <QuestionMark />;
    }
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
      {renderIcon()}
      <Typography sx={{ fontWeight: 'bold', textAlign: 'center', paddingTop: 0.5 }}>
        {props.text}
      </Typography>
    </Stack>
  );
};
