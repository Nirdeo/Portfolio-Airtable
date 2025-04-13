import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
        Bienvenue sur Mon Portfolio
      </h1>
      <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl">
        Découvrez une sélection de mes projets récents et explorez mes compétences en développement web.
      </p>
      <Link href="/projets">
        <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg">
          Voir mes projets
        </span>
      </Link>
    </div>
  );
}