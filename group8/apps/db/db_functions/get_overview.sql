create or replace function get_overview(
	movie_id integer default null
)
	returns table (
		mid integer,
		title text,
		overview text,
		budget integer,
		adult boolean,
		popularity decimal,
		poster_path varchar(255),
		video boolean, 
		vote_average decimal,
		vote_count integer,
		runtime integer,
		status varchar(50),
		tagline text,
		released_year integer,
		revenue bigint,
		genre_list varchar(20)[],
		language_list varchar(30)[],
		country_list varchar(255)[],
		avg_rating decimal,
		translation_list varchar(30)[],
		tags_list varchar(100)[], 
		likes bigint,
		dislikes bigint
	)
	language plpgsql
as $$
	begin
		return query
			with movie_avg as (select movie_stats.mid, movie_stats.avg_rating from movie_stats where movie_stats.mid = movie_id)
			
			select 
				movies.mid, 
				movies.title,
				movies.overview,
				movies.budget,
				movies.adult,
				movies.popularity,
				movies.poster_path,
				movies.video,
				movies.vote_average,
				movies.vote_count,
				movies.runtime,
				movies.status,
				movies.tagline,
				movies.released_year,
				movies.revenue,
				genre.genre_list, 
				lang.language_list, 
				country.country_list, 
				rating.avg_rating, 
				translation_table.translation_list, 
				tags.tags_list,
				like_dislike.likes,
				like_dislike.dislikes
			from movies 
			
			inner join(
				select * from movie_avg
			) as rating 
			on movies.mid = rating.mid

			left join(
				select ratings.mid,
					count(*) filter(where ratings.rating >= (select movie_avg.avg_rating from movie_avg)) as likes,
					count(*) filter(where ratings.rating < (select movie_avg.avg_rating from movie_avg)) as dislikes
				from ratings 
				where ratings.mid = movie_id
				group by ratings.mid
			) as like_dislike
			on movies.mid = like_dislike.mid
			
			left join(
				select 
					genre_table.mid, 
					array_agg(distinct genre_info.genre_name) as genre_list 
				from genre_info
				inner join(
					select genres.mid, genres.genre_id from genres
				) as genre_table
				on genre_info.genre_id = genre_table.genre_id
				where genre_table.mid = movie_id
				group by genre_table.mid
			) as genre 
			on movies.mid = genre.mid
			
			left join (
				select 
					language_table.mid, 
					array_agg(distinct language_info.language_name) as language_list
				from language_info
				inner join (
					select spoken_languages.mid, spoken_languages.language_id from spoken_languages
				) as language_table 
				on language_info.language_id = language_table.language_id
				where language_table.mid = movie_id
				group by language_table.mid
			) as lang
			on movies.mid = lang.mid
			
			left join (
				select 
					country_table.mid, 
					array_agg(distinct country_info.country_name) as country_list
				from country_info
				inner join (
					select countries.mid, countries.country_id from countries
				) as country_table 
				on country_info.country_id = country_table.country_id
				where country_table.mid = movie_id
				group by country_table.mid
			) as country
			on movies.mid = country.mid
			
			left join(
				select 
					language_table.mid, 
					array_agg( distinct language_info.language_name ) as translation_list
				from language_info
				inner join (
					select translations.mid, translations.language_id from translations
				) as language_table 
				on language_info.language_id = language_table.language_id
				where language_table.mid = movie_id
				group by language_table.mid
			) as translation_table
			on movies.mid = translation_table.mid
			
			left join(
				select 
					tags.mid, 
					array_agg( distinct tags.tag )as tags_list
				from tags 
				where tags.mid = movie_id
				group by tags.mid
			) as tags
			on movies.mid = tags.mid;
end; $$