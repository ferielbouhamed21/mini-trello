import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Mini Trello</h1>
          <p className="text-xl text-gray-600 mb-8">
            Organize your projects and tasks efficiently
          </p>
          <Link
            href="/boards"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Boards
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Boards</h3>
            <p className="text-gray-600">
              Create and manage multiple project boards
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lists</h3>
            <p className="text-gray-600">
              Organize tasks into customizable lists
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cards</h3>
            <p className="text-gray-600">
              Track individual tasks with details and labels
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
