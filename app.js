const express = require('express') // require()→ is commonJS
const crypto = require('node:crypto') // Allows you to create unique IDs
const movies = require('./movies.json')
const z = require('zod')
const { validateMovie, validatepartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.disable('x-powered-by') // Disable the header of X-Powered-By: express (advertising)

// Normal methods: GET/HEAD/POST
// Complex methods: PUT/PATCH/DELETE Require OPTIONS for "CORS PRE_Flight"

const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:52330',
  'https://ztbjnkzm-5500.aue.devtunnels.ms',
  'https://ztbjnkzm-5500.aue.devtunnels.ms/class-3/web/index.html',
]

// All the resources that are MOVIES are identified with /movies
app.get('/movies', (req, res) => {
  // This is to fix the CORS (Cross Origin Resource Sharing)
  const origin = req.header('origin')
  // console.log(origin)
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  // The '*' means that all origins that are not our own irigins are allowed too
  // res.header('Access-Control-Allow-Origin', '*')
  // or with the localhost
  // res.header('Access-Control-Allow-Origin', 'http://localhost:52330')
  // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

//   movie && res.json(movie)
app.get('/movies/:id', (req, res) => {
  //path-to-regexp
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found 😭' })
})

app.post('/movies', (req, res) => {
  console.log(req)
  const result = validateMovie(req.body)
  if (!result.success) {
    //or
    // if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // It creates a UUID V4 (Universal Unique Identifier)
    ...result.data,
  }
  // This would not be REST because we are saving the state in memory
  movies.push(newMovie)

  res.status(201).json(newMovie) // Updates the client's catche memory
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  // console.log(origin)
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not Found 😭😭😭' })
  }

  movies.splice(movieIndex, 1)
  console.log("message: 'Movie Deleted 😭😭'")

  return res.json({ message: 'Movie Deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatepartialMovie(req.body)
  if (!result.success) {
    //or
    // if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  // const movie = movies.find(movie => movie.id === id)
  // console.log(movie)
  // console.log(movieIndex)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found 😭😭' })
  }
  const updateMovie = { ...movies[movieIndex], ...result.data }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  // console.log(origin)
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  }
  res.send(200)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
