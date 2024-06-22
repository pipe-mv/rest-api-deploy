const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    require_error: 'Movie title is required',
  }),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Crime',
      'Drama',
      'Comedy',
      'Fantasy',
      'Horor',
      'Thriller',
      'sci-Fi',
    ]),
    {
      require_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of a enum Genre',
    }
  ),
  year: z.number().int().min(1900).max(new Date().getFullYear(), {
    message: 'Year must be less or equivalent to the current year',
  }),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL',
  }),
})

function validateMovie(input) {
  return movieSchema.safeParse(input)
}

function validatepartialMovie(input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatepartialMovie,
}
