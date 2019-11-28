import React from 'react';

import { TimelineVisibility } from '../data/timeline';
import { Tooltip, Icon } from '@material-ui/core';

interface TimelineVisibilityIconProps {
  className?: string;
  visibility: TimelineVisibility;
}

const TimelineVisibilityIcon: React.FC<TimelineVisibilityIconProps> = props => {
  if (props.visibility === 'Public')
    return (
      <Tooltip title="Everyone can see the timeline.">
        <Icon className={props.className}>public</Icon>
      </Tooltip>
    );
  else if (props.visibility === 'Register')
    return (
      <Tooltip title="Only registers can see the timeline.">
        <Icon className={props.className}>person</Icon>
      </Tooltip>
    );
  else if (props.visibility === 'Private')
    return (
      <Tooltip title="Only members can see the timeline.">
        <Icon className={props.className}>group</Icon>
      </Tooltip>
    );
  else throw new Error('Unknown visibility.');
};

export default TimelineVisibilityIcon;
