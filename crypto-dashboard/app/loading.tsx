export default function Loading() {
    return (
        <main className="min-h-screen p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 animate-pulse"/>
            <div className="space-y-z">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                    key={i}
                    className="h-14 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                    />
                ))}
            </div>
        </main>
    );
}