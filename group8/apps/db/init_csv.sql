COPY genre_info(genre_id,genre_name)
FROM '/var/lib/postgresql/data/db_files/genre_info.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY people(mid,person_id)
FROM '/var/lib/postgresql/data/db_files/people.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY countries(mid,country_id)
FROM '/var/lib/postgresql/data/db_files/countries.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY spoken_languages(mid,language_id)
FROM '/var/lib/postgresql/data/db_files/spoken_languages.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY rating(user_id,mid,rating,timestamp)
FROM '/var/lib/postgresql/data/db_files/rating.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY user_names(user_id,fname,lname)
FROM '/var/lib/postgresql/data/db_files/user_names.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY language_info(language_id,language_name)
FROM '/var/lib/postgresql/data/db_files/language_info.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY companies(mid,company_id)
FROM '/var/lib/postgresql/data/db_files/companies.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY company_info(company_id,company_name,country_id)
FROM '/var/lib/postgresql/data/db_files/company_info.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY tags(user_id,mid,tag,timestamp)
FROM '/var/lib/postgresql/data/db_files/tags.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY genres(mid,genre_id)
FROM '/var/lib/postgresql/data/db_files/genres.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY country_info(country_id,country_name)
FROM '/var/lib/postgresql/data/db_files/country_info.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY person(person_id,name,department,birthday,deathday,gender,birth_place)
FROM '/var/lib/postgresql/data/db_files/person.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY movies(mid,adult,budget,language_id,overview,popularity,poster_path,runtime,status,tagline,title,video,vote_average,vote_count,year,revenue)
FROM '/var/lib/postgresql/data/db_files/movies.csv' 
DELIMITER ',' 
CSV HEADER;
 
 
COPY translations(mid,language_id)
FROM '/var/lib/postgresql/data/db_files/translations.csv' 
DELIMITER ',' 
CSV HEADER;