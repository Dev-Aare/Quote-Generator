import { FaPlay } from 'react-icons/fa'

function TrackCard({ track, playTrack }) {
  return (
    <div
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => track.preview_url && playTrack(track)}
    >
      <img
        src={track.album.images[0]?.url}
        alt={track.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{track.name}</h3>
        <p className="text-gray-400 mb-2">{track.artists[0].name}</p>
        <button
          className="flex items-center gap-2 text-spotify hover:text-green-600"
          disabled={!track.preview_url}
        >
          <FaPlay /> {track.preview_url ? 'Play Preview' : 'No Preview'}
        </button>
      </div>
    </div>
  )
}

export default TrackCard