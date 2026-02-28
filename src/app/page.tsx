"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import AppCard from "./components/AppCard";

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

export default function Home() {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data) => setApps(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.421.15L3.5 7.6a1 1 0 0 0-.5.866v9a1 1 0 0 0 .5.866l9 5.196a1 1 0 0 0 1 0l9-5.196a1 1 0 0 0 .5-.866v-9a1 1 0 0 0-.5-.866l-9.013-5.423A1 1 0 0 0 13.5 2ZM12 8l5.196 3L12 14 6.804 11 12 8Z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold">Keine Apps vorhanden</h2>
            <p className="mt-1 text-sm text-muted">
              APK-Dateien in das Apps-Verzeichnis legen, um sie hier anzuzeigen.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <AppCard key={app.filename} app={app} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
