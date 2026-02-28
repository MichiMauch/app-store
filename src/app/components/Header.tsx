export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M13.5 2c-.178 0-.356.013-.492.022l-.074.005a1 1 0 0 0-.421.15L3.5 7.6a1 1 0 0 0-.5.866v9a1 1 0 0 0 .5.866l9 5.196a1 1 0 0 0 1 0l9-5.196a1 1 0 0 0 .5-.866v-9a1 1 0 0 0-.5-.866l-9.013-5.423A1 1 0 0 0 13.5 2ZM12 8l5.196 3L12 14 6.804 11 12 8Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold">App Store</h1>
          <p className="text-sm text-muted">Private Android Apps</p>
        </div>
      </div>
    </header>
  );
}
