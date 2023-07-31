import React, { useState } from 'react';
import '../styles.css';


interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}
interface TooltipIconProps {
  children?: React.ReactNode;
  icon: React.ComponentType<IconProps>;
  tooltipText: string;
  handleClick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  size?: number;
}



const TooltipIcon: React.FC<TooltipIconProps> = ({ icon: Icon, tooltipText, handleClick, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [color, setColor] = useState('');

  const handleMouseEnter = () => {
    setIsHovered(true);
    setColor('#8b88b5');
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
    setColor('');
  }

  return (
    <div
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
      onClick={ handleClick }
      style={{ ...style, position: 'relative' }}
    >
      <Icon size={30} color={ color } />
      {isHovered && <div className="tooltip-text">{ tooltipText }</div>}
    </div>
  );
};

export default TooltipIcon;

