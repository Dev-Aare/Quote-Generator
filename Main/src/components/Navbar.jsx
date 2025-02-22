import { Link } from 'react-router-dom'
import { FaSpotify } from 'react-icons/fa'

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-spotify">
          <FaSpotify /> Music Player
        </Link>
      </div>
    </nav>
  )
}

export default Navbar