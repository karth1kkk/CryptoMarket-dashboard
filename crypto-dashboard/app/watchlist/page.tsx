export default function WatchlistPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Watchlist
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Saved symbols will appear here. This view is not wired to storage yet.
      </p>
      <div
        className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/90 py-16 text-center dark:border-slate-600/50"
        role="status"
      >
        <p className="text-slate-500 dark:text-slate-400">No saved assets</p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Use the market table to find symbols to track.
        </p>
      </div>
    </div>
  );
}
