import { SVGProps } from 'react';

export const FolderSharedOutlined = ({
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
      d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM15 13C16.1 13 17 12.1 17 11C17 9.9 16.1 9 15 9C13.9 9 13 9.9 13 11C13 12.1 13.9 13 15 13ZM11 17H19V16C19 14.67 16.33 14 15 14C13.67 14 11 14.67 11 16V17Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
