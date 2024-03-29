import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FormEvent } from 'react'

function AlbumPicker() {
  // Update the state to hold an array of objects, each containing title and release date
  const [albums, setAlbums] = useState<{ title: string; date: string }[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      artist: { value: string };
    };
    const artist = encodeURIComponent(target.artist.value);
    const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=artist:${artist}`;
    const response = await fetch(url);
    const mbResult = await response.json() as {
      releases: { title: string; date?: string }[];
    };
    const { releases } = mbResult;
    
    // Map over the releases to extract both title and date
    setAlbums(releases.map(({ title, date }) => ({ title, date: date || 'Unknown' })));
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Artist name:
        <input name="artist" />
      </label>
      <button type="submit">Search</button>
      <p>Albums:</p>
      <ol>
      {albums.map((album, index) => (
        <li key={index}>{album.title} - Released on: {album.date}</li> // Display title and date
      ))}
    </ol>
    </form>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <AlbumPicker />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
