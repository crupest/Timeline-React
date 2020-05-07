import React from 'react';
import clsx from 'clsx';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { fromEvent } from 'rxjs';

import {
  TimelineInfo,
  timelineVisibilityTooltipTranslationMap,
} from '../data/timeline';
import { useAvatarVersion, useAvatarUrlWithGivenVersion } from './api';
import { useUser } from '../data/user';

import { TimelineCardComponentProps } from '../timeline/TimelinePageTemplateUI';

export type PersonalTimelineManageItem = 'avatar' | 'nickname';

export type UserInfoCardProps = TimelineCardComponentProps<
  TimelineInfo,
  PersonalTimelineManageItem
>;

const UserInfoCard: React.FC<UserInfoCardProps> = (props) => {
  const { onHeight, onManage } = props;
  const { t } = useTranslation();
  const user = useUser();

  const avatarVersion = useAvatarVersion();
  const avatarUrl = useAvatarUrlWithGivenVersion(
    user != null && user.username === props.timeline.owner.username
      ? avatarVersion
      : undefined,
    props.timeline.owner._links.avatar
  );

  const containerRef = React.useRef<HTMLDivElement>(null!);

  const notifyHeight = React.useCallback((): void => {
    if (onHeight) {
      onHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, [onHeight]);

  React.useEffect(() => {
    const subscription = fromEvent(window, 'resize').subscribe(notifyHeight);
    return () => subscription.unsubscribe();
  });

  const [manageDropdownOpen, setManageDropdownOpen] = React.useState<boolean>(
    false
  );
  const toggleManageDropdown = React.useCallback(
    (): void => setManageDropdownOpen((old) => !old),
    []
  );
  const onManageProperty = React.useCallback(
    (): void => onManage!('property'),
    [onManage]
  );
  const onManageAvatar = React.useCallback((): void => onManage!('avatar'), [
    onManage,
  ]);
  const onManageNickname = React.useCallback(
    (): void => onManage!('nickname'),
    [onManage]
  );

  return (
    <div
      ref={containerRef}
      className={clsx('rounded border bg-light p-2', props.className)}
      onTransitionEnd={notifyHeight}
    >
      <img
        src={avatarUrl}
        onLoad={notifyHeight}
        className="avatar large mr-2 mb-2 rounded-circle float-left"
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
      <div className="text-right mt-2">
        {props.onManage != null ? (
          <Dropdown isOpen={manageDropdownOpen} toggle={toggleManageDropdown}>
            <DropdownToggle outline color="primary">
              {t('timeline.manage')}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={onManageNickname}>
                {t('timeline.manageItem.nickname')}
              </DropdownItem>
              <DropdownItem onClick={onManageAvatar}>
                {t('timeline.manageItem.avatar')}
              </DropdownItem>
              <DropdownItem onClick={onManageProperty}>
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
