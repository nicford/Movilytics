create or replace function get_genre_population_avg_diff(
	movie_id integer default null
)
	returns table (
		local_avg decimal,
		animation_glob_avg decimal,
		animation_count bigint,
		adventure_glob_avg decimal,
		adventure_count bigint,
		family_glob_avg decimal,
		family_count bigint,
		comedy_glob_avg decimal,
		comedy_count bigint,
		fantasy_glob_avg decimal,
		fantasy_count bigint,
		romance_glob_avg decimal,
		romance_count bigint,
		drama_glob_avg decimal,
		drama_count bigint,
		action_glob_avg decimal,
		action_count bigint,
		crime_glob_avg decimal,
		crime_count bigint,
		thriller_glob_avg decimal,
		thriller_count bigint,
		horror_glob_avg decimal,
		horror_count bigint,
		history_glob_avg decimal,
		history_count bigint,
		science_fiction_glob_avg decimal, 
		science_fiction_count bigint,
		mystery_glob_avg decimal, 
		mystery_count bigint,
		war_glob_avg decimal,
		war_count bigint,
		music_glob_avg decimal,
		music_count bigint,
		documentary_glob_avg decimal,
		documentary_count bigint,
		western_glob_avg decimal,
		western_count bigint,
		tv_movie_glob_avg decimal,
		tv_movie_count bigint
	)
	language plpgsql
as $$
	begin
		return query 
			with 
				global_avg as (
					select avg(animation) as animation_glob_avg,
					   avg(adventure) as adventure_glob_avg,
					   avg(family) as family_glob_avg,
					   avg(comedy) as comedy_glob_avg,
					   avg(fantasy) as fantasy_glob_avg,
					   avg(romance) as romance_glob_avg,
					   avg(drama) as drama_glob_avg,
					   avg(action) as action_glob_avg,
					   avg(crime) as crime_glob_avg,
					   avg(thriller) as thriller_glob_avg,
					   avg(horror) as horror_glob_avg,
					   avg(history) as history_glob_avg,
					   avg(science_fiction) as science_fiction_glob_avg,
					   avg(mystery) as mystery_glob_avg,
					   avg(war) as war_glob_avg,
					   avg(music) as music_glob_avg,
					   avg(documentary) as documentary_glob_avg,
					   avg(western) as western_glob_avg,
					   avg(tv_movie) as tv_movie_glob_avg
					from user_genre_mapping
					where user_id in (select user_id from ratings where mid = 862)
				),
				curr_avg as (
					select 
						avg(rating) as local_avg 
					from ratings where mid = 862
				),
				population_table as (
					select 
						count(*) filter (where animation > (select genre_avg_rating from genre_info where genre_name = 'Animation')) as animation_count,
						count(*) filter (where family > (select genre_avg_rating from genre_info where genre_name = 'Family')) as family_count,
						count(*) filter (where history > (select genre_avg_rating from genre_info where genre_name = 'History')) as history_count,
						count(*) filter (where comedy > (select genre_avg_rating from genre_info where genre_name = 'Comedy')) as comedy_count, 
						count(*) filter (where documentary > (select genre_avg_rating from genre_info where genre_name = 'Documentary')) as documentary_count ,
						count(*) filter (where tv_movie > (select genre_avg_rating from genre_info where genre_name = 'TV Movie')) as tv_movie_count,
						count(*) filter (where fantasy > (select genre_avg_rating from genre_info where genre_name = 'Fantasy')) as fantasy_count,
						count(*) filter (where science_fiction > (select genre_avg_rating from genre_info where genre_name = 'Science Fiction')) as science_fiction_count,
						count(*) filter (where war > (select genre_avg_rating from genre_info where genre_name = 'War')) as war_count,
						count(*) filter (where music > (select genre_avg_rating from genre_info where genre_name = 'Music')) as music_count,
						count(*) filter (where horror > (select genre_avg_rating from genre_info where genre_name = 'Horror')) as horror_count,
						count(*) filter (where action > (select genre_avg_rating from genre_info where genre_name = 'Action')) as action_count,
						count(*) filter (where drama > (select genre_avg_rating from genre_info where genre_name = 'Drama')) as drama_count,
						count(*) filter (where crime > (select genre_avg_rating from genre_info where genre_name = 'Crime')) as crime_count,
						count(*) filter (where western > (select genre_avg_rating from genre_info where genre_name = 'Western')) as western_count,
						count(*) filter (where thriller > (select genre_avg_rating from genre_info where genre_name = 'Thriller')) as thriller_count,
						count(*) filter (where mystery > (select genre_avg_rating from genre_info where genre_name = 'Mystery')) as mystery_count,
						count(*) filter (where adventure > (select genre_avg_rating from genre_info where genre_name = 'Adventure')) as adventure_count,
						count(*) filter (where romance > (select genre_avg_rating from genre_info where genre_name = 'Romance')) as romance_count
					from user_genre_mapping 
					where user_id in (select user_id from ratings where mid = 862) 
				)

				select 
					curr_avg.local_avg, 
					global_avg.animation_glob_avg, 
					population_table.animation_count,
					global_avg.adventure_glob_avg, 
					population_table.adventure_count,
					global_avg.family_glob_avg, 
					population_table.family_count,
					global_avg.comedy_glob_avg, 
					population_table.comedy_count,
					global_avg.fantasy_glob_avg,
					population_table.fantasy_count,
					global_avg.romance_glob_avg,
					population_table.romance_count,
					global_avg.drama_glob_avg,
					population_table.drama_count,
					global_avg.action_glob_avg,
					population_table.action_count,
					global_avg.crime_glob_avg,
					population_table.crime_count,
					global_avg.thriller_glob_avg,
					population_table.thriller_count,
					global_avg.horror_glob_avg,
					population_table.horror_count,
					global_avg.history_glob_avg,
					population_table.history_count,
					global_avg.science_fiction_glob_avg,
					population_table.science_fiction_count,
					global_avg.mystery_glob_avg,
					population_table.mystery_count,
					global_avg.war_glob_avg,
					population_table.war_count,
					global_avg.music_glob_avg,
					population_table.music_count,
					global_avg.documentary_glob_avg,
					population_table.documentary_count,
					global_avg.western_glob_avg,
					population_table.western_count,
					global_avg.tv_movie_glob_avg,
					population_table.tv_movie_count
				from global_avg, curr_avg, population_table;
end; $$
