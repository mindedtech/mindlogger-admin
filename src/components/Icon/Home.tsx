import { SVGProps } from 'react';

export const Home = ({
  width = 24,
  height = 24,
  color = '#000',
}: SVGProps<SVGElement>): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 20.5V14.5H14V20.5H19V12.5H22L12 3.5L2 12.5H5V20.5H10Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
