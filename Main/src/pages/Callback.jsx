import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle Spotify auth callback if using user authentication
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      // Here you would typically exchange code for token
      // For this example, we just redirect back
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify"></div>
    </div>
  )
}

export default Callback