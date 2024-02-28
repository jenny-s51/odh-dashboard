import React from 'react';

const MyRectComponent = () => {
  const [expandIconHovered, setExpandIconHovered] = React.useState(false);

  const onMouseEnter = () => {
    setExpandIconHovered(true);
  };

  const onMouseLeave = () => {
    setExpandIconHovered(false);
  };

  console.log('???', expandIconHovered);
  return (
    <rect
      className={'action-icon-collapsed'}
      // Add other props as needed
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></rect>
  );
};

export default MyRectComponent;
