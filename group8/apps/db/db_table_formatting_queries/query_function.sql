-- Script to create functions used when querying for advance search
create or replace function get_movies (
	keyword text default null,
	sortBy text default null,
	ascending boolean default True,
	year integer default null,
	minRating integer[] default null,
	genres_arg integer[] default null,
	status_arg varchar(50) default null
) 
	returns table (
		title text, 
		poster_path varchar(255), 
		vote_average decimal, 
		tagline text, 
		status varchar(50))
	language plpgsql
as $$
	begin
		return query
			select distinct filtered.title, filtered.poster_path, filtered.vote_average, filtered.tagline, filtered.status 
			from (
				select movies.title, movies.poster_path, movies.vote_average, movies.tagline, movies.popularity, movies.status, genres_table.genre_id, rating_table.avg_rating
				from movies
				inner join(
					select mid, avg(rating) as avg_rating from ratings group by mid
				) as rating_table
				on movies.mid = rating_table.mid
				inner join(
					select mid, genre_id from genres group by mid, genre_id	
				) as genres_table
				on movies.mid = genres_table.mid
				where 
				(keyword ISNULL OR movies.title like keyword)
				and 
				(minRating ISNULL OR rating_table.avg_rating >= ANY(minRating))
				and 
				(status_arg ISNULL OR movies.status = status_arg)
				and 
				(genres_arg ISNULL OR genres_table.genre_id = ANY(genres_arg))
				ORDER BY 
				CASE WHEN sortBy ISNULL AND ascending THEN movies.popularity END DESC,
				CASE WHEN sortBy ISNULL AND not ascending THEN movies.popularity END ASC,
				CASE WHEN sortBy = 'title' AND not ascending THEN movies.title END DESC,
				CASE WHEN sortBy = 'title' AND not ascending THEN movies.title END DESC
			) as filtered;
end; $$

-- Query from function format example, do not pass in value if value is null 
select * from get_movies(title := 'Toy Story', sortBy := 'title', minRating := '{3,4,5}')