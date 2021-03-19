-- Script to create functions used when querying for advance search
create or replace function get_movies (
	result_limit integer default 100,
	result_offset integer default 0,
	keyword text default null,
	sort_by text default null,
	ascending boolean default True,
	start_year integer default null,
	end_year integer default null,
	allowed_ratings integer default null,
	genres_arg integer[] default null,
	status_arg varchar(50) default null
) 
	returns table (
		mid integer,
		title text, 
		poster_path varchar(255), 
		vote_average decimal, 
		tagline text, 
		status varchar(50))
	language plpgsql
as $$
	begin
		return query
			select filtered.mid, filtered.title, filtered.poster_path, filtered.vote_average, filtered.tagline, filtered.status
			from (
				select distinct on (movies.mid) movies.mid, movies.title, movies.poster_path, movies.vote_average, movies.tagline, movies.popularity, movies.released_year, movies.status, genres_table.genre_id, rating_table.avg_rating, rating_table.polarity
				from movies
				inner join(
					select movie_stats.mid, movie_stats.avg_rating, movie_stats.polarity from movie_stats 
				) as rating_table
				on movies.mid = rating_table.mid
				inner join(
					select genres.mid, genres.genre_id from genres group by genres.mid, genres.genre_id	
				) as genres_table
				on movies.mid = genres_table.mid
				where 
				(keyword ISNULL OR movies.title ilike concat('%',keyword,'%'))
				and 
				(allowed_ratings ISNULL OR rating_table.avg_rating >= allowed_ratings)
				and 
				(status_arg ISNULL OR movies.status = status_arg)
				and 
				(genres_arg ISNULL OR genres_table.genre_id = ANY(genres_arg))
				and 
				(start_year ISNULL or movies.released_year >= start_year)
				and
				(end_year ISNULL or movies.released_year <= end_year)
				ORDER BY movies.mid
			) as filtered
			ORDER BY
			CASE WHEN sort_by = 'popularity' AND ascending = FALSE THEN filtered.popularity END DESC,
			CASE WHEN sort_by = 'popularity' AND ascending = TRUE THEN filtered.popularity END ASC,
			CASE WHEN sort_by = 'title' AND ascending = FALSE THEN filtered.title END DESC,
			CASE WHEN sort_by = 'title' AND ascending = TRUE THEN filtered.title END ASC,
			CASE WHEN sort_by = 'year' AND ascending = FALSE THEN filtered.released_year END DESC,
			CASE WHEN sort_by = 'year' AND ascending = TRUE THEN filtered.released_year END ASC,
			CASE WHEN sort_by = 'polarity' AND ascending = FALSE THEN filtered.polarity END DESC,
			CASE WHEN sort_by = 'polarity' AND ascending = TRUE THEN filtered.polarity END ASC,
			CASE WHEN sort_by = 'rating' AND ascending = FALSE THEN filtered.avg_rating END DESC,
			CASE WHEN sort_by = 'rating' AND ascending = TRUE THEN filtered.avg_rating END ASC
			limit result_limit offset result_offset;
end; $$