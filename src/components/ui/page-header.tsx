'use client';

import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  showHomeLink?: boolean;
  action?: React.ReactNode;
};

/**
 * Reusable page header with optional back link and home breadcrumb.
 * Used on standalone pages outside the dashboard layout (e.g. /favorites).
 */
export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  showHomeLink = true,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-10">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        {showHomeLink && (
          <>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            {backHref && <span className="text-muted-foreground/40">/</span>}
          </>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5 -ml-0.5" />
            <span>{backLabel}</span>
          </Link>
        )}
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
