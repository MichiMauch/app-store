interface AppInfo {
  filename: string;
  displayName: string;
  description: string;
  version: string;
  size: number;
  sizeFormatted: string;
  lastModified: string;
  iconUrl: string | null;
}

function formatDate(iso: string): string {
  const formatted = new Date(iso).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatted} Uhr`;
}

export default function AppCard({ app }: { app: AppInfo }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {app.iconUrl ? (
          <img
            src={app.iconUrl}
            alt={app.displayName}
            className="h-14 w-14 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
            >
              <path d="M17.523 2.237a1 1 0 0 0-1.046 0L12 5.09 7.523 2.237a1 1 0 0 0-1.046 0L2.523 4.84A1 1 0 0 0 2 5.714v5.572a1 1 0 0 0 .523.874L6 14.43v5.572a1 1 0 0 0 .523.874l4.954 2.887a1 1 0 0 0 1.046 0l4.954-2.887A1 1 0 0 0 18 20V14.43l3.477-2.026A1 1 0 0 0 22 11.53V5.714a1 1 0 0 0-.523-.874l-3.954-2.603Z" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold leading-tight">
            {app.displayName}
          </h2>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted">
            {app.version && <span>{app.version}</span>}
            <span>{app.sizeFormatted}</span>
            <span>{formatDate(app.lastModified)}</span>
          </div>
          {app.description && (
            <p className="mt-2 text-sm text-muted">{app.description}</p>
          )}
        </div>
      </div>
      <a
        href={`/api/download/${encodeURIComponent(app.filename)}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
          <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
        </svg>
        Download
      </a>
    </div>
  );
}
