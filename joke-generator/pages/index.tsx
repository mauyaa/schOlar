import { useState } from 'react';
import Head from 'next/head';

interface Joke {
  type: string;
  setup?: string;
  delivery?: string;
  joke?: string;
  error?: boolean;
}

export default function JokeGenerator() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    setJoke(null);

    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any');
      if (!response.ok) {
        throw new Error('Failed to fetch joke');
      }
      const data: Joke = await response.json();
      setJoke(data);
    } catch (err) {
      setError('Could not fetch a joke. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Random Joke Generator</title>
        <meta name="description" content="Generate random jokes from an external API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            😂 Joke Generator
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Click the button below to get a random joke!
          </p>

          {/* Joke Display */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 min-h-32 flex items-center justify-center">
            {loading && (
              <p className="text-lg text-gray-500">Loading joke...</p>
            )}

            {error && (
              <p className="text-lg text-red-600">{error}</p>
            )}

            {joke && !loading && !error && (
              <div className="w-full">
                {joke.type === 'twopart' ? (
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mb-4">
                      {joke.setup}
                    </p>
                    <p className="text-lg text-purple-600 font-bold">
                      {joke.delivery}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl text-gray-800">{joke.joke}</p>
                )}
              </div>
            )}

            {!joke && !loading && !error && (
              <p className="text-lg text-gray-400">Click the button to generate a joke</p>
            )}
          </div>

          {/* Button */}
          <button
            onClick={fetchJoke}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Loading...' : 'Get a Joke 🎉'}
          </button>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Powered by <a
              href="https://jokeapi.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline font-semibold"
            >
              JokeAPI
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
