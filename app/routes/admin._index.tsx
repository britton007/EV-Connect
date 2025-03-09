import { Link } from "@remix-run/react";

export default function Admin() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Admin Panel
        </h1>
        <nav className="flex flex-col items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back to Home
          </Link>
          <p className="text-gray-700 dark:text-gray-300">
            Monitor logs, manage users and charge points here.
          </p>
        </nav>
      </div>
    </div>
  );
}
