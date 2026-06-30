export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-white flex items-center justify-center font-bold text-black text-sm">
            F
          </span>
          <h1 className="font-bold text-sm tracking-tight text-white">
            FresherFlow
          </h1>
          <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 rounded px-1.5 py-0.5 font-mono">
            v1.0.0-beta
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium cursor-pointer">
            Documentation
          </button>
          <button className="text-xs bg-zinc-900 border border-zinc-850 hover:bg-zinc-900/60 text-zinc-200 hover:text-white px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}

