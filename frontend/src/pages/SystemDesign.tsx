const SystemDesign = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 tracking-wide">
          System Design Overview
        </h1>

        {/* Section Wrapper */}
        <div className="space-y-8 text-white">
          {/* Frontend Section */}
          <section className="p-6 bg-white/20 rounded-xl shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-blue-200">
              Frontend Architecture
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-lg">
              <li>
                <strong>Framework:</strong> Built with React (Vite + TypeScript)
                for speed & type safety.
              </li>
              <li>
                <strong>Styling:</strong> Tailwind CSS for a modern, responsive
                UI.
              </li>
              <li>
                <strong>Routing:</strong> Managed with React Router for smooth
                navigation.
              </li>
              <li>
                <strong>Componentization:</strong> Modular reusable UI
                components (Navbar, Forms, Tables, etc).
              </li>
            </ul>
          </section>

          {/* Backend Section */}
          <section className="p-6 bg-white/20 rounded-xl shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-blue-200">
              Backend Services
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-lg">
              <li>
                <strong>Server:</strong> Built with Node.js (Express) for robust
                API development.
              </li>
              <li>
                <strong>Authentication:</strong> Secure JWT-based
                authentication.
              </li>
              <li>
                <strong>Database:</strong> Uses PostgreSQL + Prisma ORM for
                structured data storage.
              </li>
              <li>
                <strong>REST API:</strong> Handles URL shortening,
                authentication, and data retrieval.
              </li>
            </ul>
          </section>

          {/* Dev Environment Section */}
          <section className="p-6 bg-white/20 rounded-xl shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-blue-200">
              Local Development Setup
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-lg">
              <li>
                <strong>Frontend:</strong> Runs on{" "}
                <code>http://localhost:3000</code>
              </li>
              <li>
                <strong>Backend:</strong> Runs on{" "}
                <code>http://localhost:5000</code>
              </li>
              <li>
                <strong>Prisma Studio:</strong> Use{" "}
                <code>npx prisma studio</code> to manage the database locally.
              </li>
            </ul>
          </section>

          {/* Features Section */}
          <section className="p-6 bg-white/20 rounded-xl shadow-lg border border-white/10">
            <h2 className="text-2xl font-bold mb-3 text-blue-200">
              Key Features
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-lg">
              <li>✨ Custom short codes & click tracking.</li>
              <li>🚀 Fast and optimized API responses.</li>
              <li>🛠️ Dynamic Navbar adjusts based on auth state.</li>
              <li>🔗 User profile page with history of shortened URLs.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SystemDesign;
