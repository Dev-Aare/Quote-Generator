import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchTracks } from '../lib/spotify'
import { FaSearch, FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa'
import TrackCard from '../components/TrackCard'

function Home() {
  const [query, setQuery] = useState('')
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(new Audio())

  const { data: tracks, isLoading, refetch } = useQuery({
    queryKey: ['tracks', query],
    queryFn: () => searchTracks(query),
    enabled: false,
  })

  useEffect(() => {
    const audio = audioRef.current
    if (currentTrack?.preview_url) {
      audio.src = currentTrack.preview_url
      if (isPlaying) audio.play()
      else audio.pause()
    }

    audio.onended = () => setIsPlaying(false)
    return () => audio.pause()
  }, [currentTrack, isPlaying])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query) refetch()
  }

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    const currentIndex = tracks?.findIndex((t) => t.id === currentTrack?.id)
    if (currentIndex !== undefined && currentIndex < tracks.length - 1) {
      setCurrentTrack(tracks[currentIndex + 1])
      setIsPlaying(true)
    }
  }

  const prevTrack = () => {
    const currentIndex = tracks?.findIndex((t) => t.id === currentTrack?.id)
    if (currentIndex !== undefined && currentIndex > 0) {
      setCurrentTrack(tracks[currentIndex - 1])
      setIsPlaying(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs..."
            className="w-full pl-10 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-spotify text-white"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-spotify text-white py-2 rounded hover:bg-green-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Player Controls */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              className="w-16 h-16 rounded"
            />
            <div>
              <p className="font-semibold">{currentTrack.name}</p>
              <p className="text-sm text-gray-400">{currentTrack.artists[0].name}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={prevTrack} className="text-spotify hover:text-green-600">
              <FaBackward size={24} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-spotify hover:text-green-600"
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button onClick={nextTrack} className="text-spotify hover:text-green-600">
              <FaForward size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Track List */}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tracks?.map((track) => (
            <TrackCard key={track.id} track={track} playTrack={playTrack} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home