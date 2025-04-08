import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addToQueueRequest } from "@/api/songs";

type Song = {
  name: string;
  uri: string;
  external_urls: { spotify: string };
  artists: { name: string }[];
  album: { images: { url: string }[] };
};

type SongCardsProps = {
  secondSearch: Song[];
  token: string | null;
};

export const SongCards: React.FC<SongCardsProps> = ({
  secondSearch,
  token,
}) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  if (!secondSearch || secondSearch.length === 0) {
    return <p>No se encontraron canciones. Intenta otra búsqueda 🎵</p>;
  }

  const addToQueue = async (song: Song) => {
    setLoadingStates((prev) => ({ ...prev, [song.uri]: true }));

    try {
      const { data } = await addToQueueRequest(song.uri);

      toast.success(`${song.name} se agregó a la cola de reproducción.`);
    } catch (error: any) {
      console.error("Error al agregar la canción:", error);
      toast.error(
        error?.response?.data?.error ||
          error.message ||
          "Ocurrió un error al agregar la canción"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [song.uri]: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {secondSearch.map((song, i) => (
          <div
            key={i}
            className="m-2 p-5 border border-gray-300 rounded-lg shadow-lg text-center"
          >
            <h2 className="text-xl font-semibold">
              {song.name || "Sin título"}
            </h2>
            <h4 className="text-gray-600 mb-2">
              {song.artists?.[0]?.name || "Artista desconocido"}
            </h4>

            <div className="flex justify-center items-center mb-3">
              {song.album?.images?.[0]?.url && (
                <img
                  src={song.album.images[0].url}
                  alt={song.name}
                  width={192}
                  height={192}
                  className="rounded-lg transition-transform transform hover:scale-110 cursor-pointer object-cover aspect-square"
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => addToQueue(song)}
                disabled={loadingStates[song.uri]}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loadingStates[song.uri]
                  ? "Agregando..."
                  : "Agregar a la cola🎵"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
