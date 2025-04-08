"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Disc3, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { SongCards } from "./components/SongCards/SongCards";
import { getSongs } from "./api/songs";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
  uri: string;
}

function App() {
  const [search, setSearch] = useState<string>("");
  const [exist, setExist] = useState<boolean>(false);
  const [secondSearch, setSecondSearch] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function searchSpotify(searchTerm: string) {
    setIsLoading(true);
    try {
      const { data } = await getSongs(searchTerm);
      setExist(true);
      setSecondSearch(data.tracks.items);
    } catch (error) {
      console.error("Error al buscar canciones:", error);
      toast.error("Error al buscar canciones");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!search.trim()) {
      toast.error("Escribe algo antes de buscar");
      return;
    }
    searchSpotify(search);
  }

  return (
    <div className="flex flex-col items-center justify-center mt-3 bg-cover bg-center bg-fixed text-center">
      <h2 className="text-2xl font-bold dark:text-white text-black mb-4">
        Busca tus canciones o artistas favoritos 🎵
      </h2>
      <form
        onSubmit={handleSearch}
        className="flex flex-col items-center space-y-4"
      >
        <div className="flex items-center border-2 rounded-lg w-full max-w-md">
          <label htmlFor="search-input">
            <Search className="w-5 h-5 text-gray-500 ml-2" />
          </label>
          <input
            type="text"
            placeholder="Pink Floyd..."
            className="bg-transparent pl-2 py-2 pr-3 w-full border-none outline-none ring-gray-950"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-green-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <p>Buscar</p>
          )}
        </Button>
      </form>

      {!exist && (
        <p className="mt-20 text-gray-500 dark:text-gray-400">
          Busca una canción para comenzar
          <Disc3 className="inline-block ml-2 animate-bounce" />
        </p>
      )}

      {exist && <SongCards secondSearch={secondSearch} token={null} />}
    </div>
  );
}

export default App;
