export default function PortfolioPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold text-slate-100">Portfolio</h1>
      <p className="mt-1 text-sm text-slate-500">
        Net positions and P&amp;L will be summarized here. Not connected to data
        yet.
      </p>
      <div
        className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 py-16 text-center"
        role="status"
      >
        <p className="text-slate-400">No positions</p>
        <p className="mt-1 text-sm text-slate-500">
          Connect a data source in a later iteration.
        </p>
      </div>
    </div>
  );
}
