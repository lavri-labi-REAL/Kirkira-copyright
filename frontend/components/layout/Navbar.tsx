import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-nav border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center group">
            <span className="font-bold text-lg tracking-widest uppercase">
              <span className="text-primary">K</span><span className="text-gray-800">IRA</span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
