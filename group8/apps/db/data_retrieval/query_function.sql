-- Script to create functions used when querying for advance search
create or replace function get_movies (
	result_limit integer default 100,
	result_offset integer default 0,
	keyword text default null,
	sort_by text default null,
	ascending boolean default True,
	year integer default null,
	allowed_ratings integer[] default null,
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
			select distinct filtered.mid, filtered.title, filtered.poster_path, filtered.vote_average, filtered.tagline, filtered.status 
			from (
				select movies.mid, movies.title, movies.poster_path, movies.vote_average, movies.tagline, movies.popularity, movies.status, genres_table.genre_id, rating_table.avg_rating
				from movies
				inner join(
					select ratings.mid, avg(ratings.rating) as avg_rating from ratings group by ratings.mid
				) as rating_table
				on movies.mid = rating_table.mid
				inner join(
					select genres.mid, genres.genre_id from genres group by genres.mid, genres.genre_id	
				) as genres_table
				on movies.mid = genres_table.mid
				where 
				(keyword ISNULL OR movies.title ilike keyword)
				and 
				(allowed_ratings ISNULL OR rating_table.avg_rating >= ANY(allowed_ratings))
				and 
				(status_arg ISNULL OR movies.status = status_arg)
				and 
				(genres_arg ISNULL OR genres_table.genre_id = ANY(genres_arg))
				ORDER BY 
				CASE WHEN sort_by ISNULL AND ascending THEN movies.popularity END DESC,
				CASE WHEN sort_by ISNULL AND not ascending THEN movies.popularity END ASC,
				CASE WHEN sort_by = 'title' AND not ascending THEN movies.title END DESC,
				CASE WHEN sort_by = 'title' AND not ascending THEN movies.title END DESC
			) as filtered
			limit result_limit offset result_offset;
end; $$

-- Query from function format example, do not pass in value if value is null 
select * from get_movies(keyword := 'Toy Story', sort_by := 'title', allowed_ratings := '{3,4,5}')

-- To query data in bulk for pagination, please use the result_offset parameter
-- Result offset is by default set to 0 
select * from get_movies(result_offset := 100, sort_by := 'title', allowed_ratings := '{3,4,5}')