import React from 'react';
import { Tooltip, Icon } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { TimelineVisibility } from '../data/timeline';

export interface TimelineVisibilityIconProps {
  className?: string;
  visibility: TimelineVisibility;
}

const TimelineVisibilityIcon: React.FC<TimelineVisibilityIconProps> = props => {
  const {t} = useTranslation();

  if (props.visibility === 'Public')
    return (
      <Tooltip title={t("timeline.visibilityTooltip.public")}>
        <Icon className={props.className}>public</Icon>
      </Tooltip>
    );
  else if (props.visibility === 'Register')
    return (
      <Tooltip title={t("timeline.visibilityTooltip.register")}>
        <Icon className={props.className}>person</Icon>
      </Tooltip>
    );
  else if (props.visibility === 'Private')
    return (
      <Tooltip title={t("timeline.visibilityTooltip.private")}>
        <Icon className={props.className}>group</Icon>
      </Tooltip>
    );
  else throw new Error('Unknown visibility.');
};

export default TimelineVisibilityIcon;
