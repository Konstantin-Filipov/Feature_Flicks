import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import MovieCardInfo from './movieCard';

function filterMoviesByCategory(movies, selectedCategory) {
    if (selectedCategory === null || selectedCategory === "All Categories") {
      return movies; // Return all movies if no category is selected
    }
  
    return movies.filter(movie => movie.description.categories.includes(selectedCategory));
}

function getWeekdayFromDate(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    const weekday = daysOfWeek[date.getDay()];
    return weekday;
}

export default function AppMovies({ movies, screenings, selectedCategory }) {
    // Filter the movies by category
    let filteredMovies = filterMoviesByCategory(movies, selectedCategory);

    // Create a map of screening dates to movies
    const screeningsByDate = {};

    // Create array for each date and push the appropriate screening to this date
    screenings.forEach((screening) => {
        const date = new Date(screening.time).toLocaleDateString();
        if (!screeningsByDate[date]) {
            screeningsByDate[date] = [];
        }
        screeningsByDate[date].push(screening);
    });

    return (
        <section id='movies' className='block movies-block'>
            <Container fluid>
                {Object.keys(screeningsByDate).map((date) => {
                    // filter out screenings for which there are no matching movies
                    const validScreenings = screeningsByDate[date].filter((screening) => {
                        return filteredMovies.find((m) => m.id === screening.movieId);
                    });

                    // when there are no valid screenings, skip rendering this date
                    if (validScreenings.length === 0) {
                        return null;
                    }

                    return (
                        <div key={date}>
                            <h2>{getWeekdayFromDate(date)} {date}</h2>
                            <Row>{validScreenings.map((screening) => {
                                    const movie = filteredMovies.find((m) => m.id === screening.movieId);
                                    return (
                                        <Col sm={3} key={screening.movieId}>
                                            <MovieCardInfo movie={movie} screening={screening} />
                                        </Col>
                                    );
                            })}</Row>
                        </div>
                    );
                })}
            </Container>
        </section>
    );
}
