COPY links(mid,imdbid,tmdbid)
FROM '/var/lib/postgresql/data/csv_data/links.csv' 
DELIMITER ',' 
CSV HEADER;

 
COPY people(person_id,name,department,birthday,deathday,gender,birth_place)
FROM '/var/lib/postgresql/data/csv_data/people.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY countries(country_id,country_name)
FROM '/var/lib/postgresql/data/csv_data/countries.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY spoken_languages(language_id,language_name)
FROM '/var/lib/postgresql/data/csv_data/spoken_languages.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY rating(user_id,mid,rating,timestamp)
FROM '/var/lib/postgresql/data/csv_data/rating.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY genre(genre_id,genre_name)
FROM '/var/lib/postgresql/data/csv_data/genre.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY production_companies(company_id,company_name,country_id)
FROM '/var/lib/postgresql/data/csv_data/production_companies.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY movies(movie_id,adult,budget,genre_id,language_id,overview,popularity,poster_path,company_id,country_id,runtime,spoken_languages,status,tagline,title,video,vote_average,vote_count,person_id)
FROM '/var/lib/postgresql/data/csv_data/movies.csv' 
DELIMITER ',' 
CSV HEADER;