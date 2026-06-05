export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-b border-gray-700 text-white">
      <h1 className="font-bold text-xl">FresherFlow</h1>
      <button className="border border-gray-500 px-4 py-2 rounded-lg text-white">
        Login
      </button>
    </nav>
  );
}