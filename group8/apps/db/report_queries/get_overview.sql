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
		one_star bigint,
		two_star bigint,
		three_star bigint,
		four_star bigint,
		five_star bigint,
		likes bigint,
		dislikes bigint,
		cast_names varchar(100)[],
		cast_roles varchar(100)[]
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
				like_dislike.one_star,
				like_dislike.two_star,
				like_dislike.three_star,
				like_dislike.four_star,
				like_dislike.five_star,
				like_dislike.likes,
				like_dislike.dislikes,
				people_list.cast_names,
				people_list.cast_roles
			from movies 

			inner join(
				select * from movie_avg
			) as rating 
			on movies.mid = rating.mid

			left join(
				select ratings.mid,
					count(*) filter(where ratings.rating >= 1 and ratings.rating < 2) as one_star,
					count(*) filter(where ratings.rating >= 2 and ratings.rating < 3) as two_star,
					count(*) filter(where ratings.rating >= 3 and ratings.rating < 4) as three_star,
					count(*) filter(where ratings.rating >= 4 and ratings.rating < 5) as four_star,
					count(*) filter(where ratings.rating >= 5) as five_star,
					count(*) filter(where ratings.rating >= (select movie_avg.avg_rating from movie_avg)) as likes,
					count(*) filter(where ratings.rating < (select movie_avg.avg_rating from movie_avg)) as dislikes
				from ratings 
				where ratings.mid = movie_id
				group by ratings.mid
			) as like_dislike
			on movies.mid = like_dislike.mid

			left join(
				select 
					genre_group.mid,
					array_agg(genre_group.genre_name) as genre_list
				from(
					select genre_table.mid, genre_info.genre_id, genre_info.genre_name
					from genre_info 
					inner join(
						select genres.mid, genres.genre_id from genres
					) as genre_table
					on genre_info.genre_id = genre_table.genre_id
					where genre_table.mid = movie_id 
					group by genre_table.mid, genre_info.genre_id, genre_info.genre_name
				) as genre_group
				group by genre_group.mid
			) as genre 
			on movies.mid = genre.mid

			left join (
				select 
					language_group.mid,
					array_agg(language_group.language_name) as language_list
				from(
					select language_table.mid, language_info.language_id, language_info.language_name
					from language_info 
					inner join(
						select spoken_languages.mid, spoken_languages.language_id from spoken_languages
					) as language_table
					on language_info.language_id = language_table.language_id
					where language_table.mid = movie_id 
					group by language_table.mid, language_info.language_id, language_info.language_name
				) as language_group
				group by language_group.mid
			) as lang
			on movies.mid = lang.mid

			left join (
				select 
					country_group.mid,
					array_agg(country_group.country_name) as country_list
				from(
					select country_table.mid, country_info.country_id, country_info.country_name
					from country_info 
					inner join(
						select countries.mid, countries.country_id from countries
					) as country_table
					on country_info.country_id = country_table.country_id
					where country_table.mid = movie_id 
					group by country_table.mid, country_info.country_id, country_info.country_name
				) as country_group
				group by country_group.mid
			) as country
			on movies.mid = country.mid

			left join(
				select 
					language_group.mid,
					array_agg(language_group.language_name) as translation_list
				from(
					select translations.mid, language_table.language_id, language_table.language_name
					from translations 
					inner join(
						select language_info.language_id, language_info.language_name from language_info 
					) as language_table
					on translations.language_id = language_table.language_id
					where translations.mid = movie_id 
					group by translations.mid, language_table.language_id, language_table.language_name
				) as language_group
				group by language_group.mid
			) as translation_table
			on movies.mid = translation_table.mid

			left join(
				select 
					tags_table.mid, 
					array_agg( tags_table.tag ) as tags_list
				from (
					select 
						tags.mid,
						tags.tag
					from tags 
					where tags.mid = movie_id
					group by tags.mid, tags.tag
				) as tags_table
				group by tags_table.mid
			) as tags
			on movies.mid = tags.mid

			left join(
				select 
					people_group.mid,
					array_agg(people_group.name) as cast_names,
					array_agg(people_group.department) as cast_roles
				from(
					select people.mid, person_name.name, person_name.department
					from people 
					inner join(
						select person.person_id, person.name, person.department from person 
					) as person_name
					on person_name.person_id = people.person_id
					where people.mid = movie_id 
					group by people.mid, person_name.name, person_name.department
				) as people_group
				group by people_group.mid
			) as people_list 
			on movies.mid = people_list.mid;
end; $$