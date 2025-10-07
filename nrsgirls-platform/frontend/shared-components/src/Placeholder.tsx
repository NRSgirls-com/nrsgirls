import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export type PlaceholderProps = {
  className?: string;
  message?: string;
};

export function Placeholder({
  className,
  message,
  children
}: PropsWithChildren<PlaceholderProps>) {
  return (
    <div className={clsx('shared-components-placeholder', className)}>
      {children ?? message ?? 'Shared component placeholder'}
    </div>
  );
}
