import React from 'react';
import clsx from 'clsx';

import {
  PersonalTimelineInfo,
  timelineVisibilityTooltipTranslationMap
} from '../data/timeline';
import {
  Card,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Col,
  Row
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { PersonalTimelineManageItem } from './EditItem';

export interface UserInfoCardProps {
  timeline: PersonalTimelineInfo;
  onManage?: (item: PersonalTimelineManageItem) => void;
  onMember: () => void;
  className?: string;
  avatarKey?: string | number;
  onHeight?: (height: number) => void;
}

const UserInfoCard: React.FC<UserInfoCardProps> = props => {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (props.onHeight) {
      props.onHeight(document.getElementById('user-info-card')!.clientHeight);
    }
  });

  const [manageDropdownOpen, setManageDropdownOpen] = React.useState<boolean>(
    false
  );
  const toggleManageDropdown = (): void =>
    setManageDropdownOpen(!manageDropdownOpen);

  return (
    <Card
      id="user-info-card"
      className={clsx('container-fluid round', props.className)}
    >
      <Row>
        <Col className="col-auto">
          <img
            key={props.avatarKey}
            src={props.timeline.owner._links.avatar}
            className="avatar large rounded"
          />
        </Col>
        <Col>
          <Row>
            <p className="col-auto">
              {props.timeline.owner.nickname}
              <small className="ml-3 text-secondary">
                @{props.timeline.owner.username}
              </small>
            </p>
            <small className="col pt-sm-1">
              {t(
                timelineVisibilityTooltipTranslationMap[
                  props.timeline.visibility
                ]
              )}
            </small>
          </Row>
          <p>{props.timeline.description}</p>
        </Col>
      </Row>
      <Row className="justify-content-end">
        {props.onManage != null ? (
          <Dropdown isOpen={manageDropdownOpen} toggle={toggleManageDropdown}>
            <DropdownToggle color="primary">Manage</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => props.onManage!('nickname')}>
                Nickname
              </DropdownItem>
              <DropdownItem onClick={() => props.onManage!('avatar')}>
                Avatar
              </DropdownItem>
              <DropdownItem onClick={() => props.onManage!('property')}>
                Timeline Properties
              </DropdownItem>
              <DropdownItem onClick={props.onMember}>
                Timeline Members
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button color="primary" onClick={props.onMember}>
            Members
          </Button>
        )}
      </Row>
    </Card>
  );
};

export default UserInfoCard;
