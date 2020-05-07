import React from 'react';

export interface CollapseButtonProps {
  collapse: boolean;
  toggle: (visibility: boolean) => void;
  className?: string;
}

const CollapseButton: React.FC<CollapseButtonProps> = (props) => {
  const { toggle, collapse, className } = props;

  const onClick = React.useCallback(() => {
    toggle(!collapse);
  }, [toggle, collapse]);

  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 100 100"
      className={className}
      onClick={onClick}
    >
      {(() => {
        if (collapse) {
          return (
            <>
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="50"
                x2="90"
                y1="17"
                y2="17"
              />
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="10"
                x2="50"
                y1="83"
                y2="83"
              />
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="17"
                x2="17"
                y1="50"
                y2="90"
              />
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="83"
                x2="83"
                y1="10"
                y2="50"
              />
            </>
          );
        } else {
          return (
            <>
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="55"
                x2="95"
                y1="38"
                y2="38"
              />
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="5"
                x2="45"
                y1="62"
                y2="62"
              />
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="38"
                x2="38"
                y1="55"
                y2="95"
              />
              <line
                stroke="currentcolor"
                strokeWidth="14"
                x1="62"
                x2="62"
                y1="5"
                y2="45"
              />
            </>
          );
        }
      })()}
    </svg>
  );
};

export default CollapseButton;
