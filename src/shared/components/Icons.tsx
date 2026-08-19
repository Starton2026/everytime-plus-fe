import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Icon>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5h16l-6.2 7.3V19l-3.6 1.8v-8.5L4 5Z" />
    </Icon>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 11.6V5a1 1 0 0 1 1-1h6.6a1 1 0 0 1 .7.3l7.4 7.4a1 1 0 0 1 0 1.4l-6.6 6.6a1 1 0 0 1-1.4 0L4.3 12.3a1 1 0 0 1-.3-.7Z" />
      <circle cx="8.4" cy="8.4" r="1.2" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4 20 4.3-1.1L19 8.2a1.5 1.5 0 0 0 0-2.1l-1.1-1.1a1.5 1.5 0 0 0-2.1 0L5.1 15.7 4 20Z" />
      <path d="m14.8 6.6 2.6 2.6" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 6.5h15" />
      <path d="M9.5 6.5V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5" />
      <path d="M17.5 6.5V19a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V6.5" />
      <path d="M10.5 10.5v5.5M13.5 10.5v5.5" />
    </Icon>
  );
}

export function ThumbUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.5 10.5v9H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2.5Z" />
      <path d="M7.5 10.5 12 3.9a1.9 1.9 0 0 1 3.3 1.8l-1 3.9h4.2a1.8 1.8 0 0 1 1.7 2.4l-1.9 5.8a2.7 2.7 0 0 1-2.6 1.7H7.5" />
    </Icon>
  );
}

export function ThumbDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <g transform="rotate(180 12 12)">
        <path d="M7.5 10.5v9H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2.5Z" />
        <path d="M7.5 10.5 12 3.9a1.9 1.9 0 0 1 3.3 1.8l-1 3.9h4.2a1.8 1.8 0 0 1 1.7 2.4l-1.9 5.8a2.7 2.7 0 0 1-2.6 1.7H7.5" />
      </g>
    </Icon>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6.2L7 20v-4H6a2 2 0 0 1-2-2V6Z" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8" />
      <path d="M17 8.5 20.5 12 17 15.5M20 12h-9" />
    </Icon>
  );
}

export function BoardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="4.5" width="16" height="15" rx="2" />
      <path d="M8 9h8M8 12.5h8M8 16h5" />
    </Icon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
    </Icon>
  );
}
