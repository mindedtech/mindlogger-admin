import { SVGProps } from 'react';

export const FolderShared = ({
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
      d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM15 9C16.1 9 17 9.9 17 11C17 12.1 16.1 13 15 13C13.9 13 13 12.1 13 11C13 9.9 13.9 9 15 9ZM19 17H11V16C11 14.67 13.67 14 15 14C16.33 14 19 14.67 19 16V17Z"
      fill={color || 'currentColor'}
    />
  </svg>
);
