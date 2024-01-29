import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FormEvent } from 'react'
import { TextField, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function AlbumPicker() {
  const [albums, setAlbums] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const target = e.target as typeof e.target & {
        artist: { value: string };
      };
      const artist = encodeURIComponent(target.artist.value);
      const url = `https://musicbrainz.org/ws/2/release?fmt=json&query=artist:${artist}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching data');
      const mbResult = await response.json();
      const { releases } = mbResult as { releases: { title: string }[] };
      setAlbums(releases.map(({ title }) => title));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <TextField
        name="artist"
        label="Artist Name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Search
      </Button>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {albums.map((album, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{album}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
      <AlbumPicker />
      <h1>Vite + React</h1>
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
