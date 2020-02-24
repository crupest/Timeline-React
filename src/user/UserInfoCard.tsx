import React from 'react';
import clsx from 'clsx';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { fromEvent } from 'rxjs';

import {
  PersonalTimelineInfo,
  timelineVisibilityTooltipTranslationMap
} from '../data/timeline';
import { TimelineCardComponentProps } from '../timeline/TimelinePageTemplateUI';

export type PersonalTimelineManageItem = 'avatar' | 'nickname';

export type UserInfoCardProps = TimelineCardComponentProps<
  PersonalTimelineInfo,
  PersonalTimelineManageItem
>;

const UserInfoCard: React.FC<UserInfoCardProps> = props => {
  const { t } = useTranslation();

  const notifyHeight = (): void => {
    if (props.onHeight) {
      props.onHeight(document.getElementById('user-info-card')!.clientHeight);
    }
  };

  React.useEffect(() => {
    const subscription = fromEvent(window, 'resize').subscribe(notifyHeight);
    return () => subscription.unsubscribe();
  });

  const [manageDropdownOpen, setManageDropdownOpen] = React.useState<boolean>(
    false
  );
  const toggleManageDropdown = (): void =>
    setManageDropdownOpen(!manageDropdownOpen);

  return (
    <div
      id="user-info-card"
      className={clsx('rounded border bg-light', props.className)}
    >
      <img
        src={props.timeline.owner._links.avatar}
        onLoad={notifyHeight}
        className="avatar large rounded-circle float-left"
      />
      <div>
        {props.timeline.owner.nickname}
        <small className="ml-3 text-secondary">
          @{props.timeline.owner.username}
        </small>
      </div>
      <p className="mb-0">{props.timeline.description}</p>
      <small className="mt-1 d-block">
        {t(timelineVisibilityTooltipTranslationMap[props.timeline.visibility])}
      </small>
      <div className="text-right">
        {props.onManage != null ? (
          <Dropdown isOpen={manageDropdownOpen} toggle={toggleManageDropdown}>
            <DropdownToggle outline color="primary">
              {t('timeline.manage')}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => props.onManage!('nickname')}>
                {t('timeline.manageItem.nickname')}
              </DropdownItem>
              <DropdownItem onClick={() => props.onManage!('avatar')}>
                {t('timeline.manageItem.avatar')}
              </DropdownItem>
              <DropdownItem onClick={() => props.onManage!('property')}>
                {t('timeline.manageItem.property')}
              </DropdownItem>
              <DropdownItem onClick={props.onMember}>
                {t('timeline.manageItem.member')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button color="primary" outline onClick={props.onMember}>
            {t('timeline.memberButton')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
