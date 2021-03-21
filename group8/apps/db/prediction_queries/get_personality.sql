create or replace function get_personality (
	tag_inputs varchar(100)[] default null
) 
	returns table(
		openness decimal,
		agreeableness decimal,
		emotional_stability decimal,
		conscientiousness decimal,
		extraversion decimal
	)
	language plpgsql
as $$
	begin 
		return query
			with avg_movie_ratings as (
				select 
					mid, 
					avg_rating 
				from movie_stats 
				where mid in 
				(
					select 
				 		mid 
				 	from tags 
				 	where tag = any(tag_inputs)
					group by mid
				)
			), 
			user_rating_map as (
				select 
					user_id, 
					prediction, 
					mov_ratings.mid, 
					mov_ratings.avg_rating 
				from user_predictive_rate 
				inner join (
					select 
						avg_movie_ratings.mid, 
						avg_movie_ratings.avg_rating from avg_movie_ratings
				) as mov_ratings
				on user_predictive_rate.mid = mov_ratings.mid
			)
	
		select 
			COALESCE(avg(traits.openness), 0) as openness,
			COALESCE(avg(traits.agreeableness), 0) as agreeableness,
			COALESCE(avg(traits.emotional_stability), 0) as emotional_stability,
			COALESCE(avg(traits.conscientiousness), 0) as conscientiousness,
			COALESCE(avg(traits.extraversion), 0) as extraversion
		from user_rating_map 
		inner join(
			select 
				user_traits.user_id, 
				user_traits.openness, 
				user_traits.agreeableness, 
				user_traits.emotional_stability, 
				user_traits.conscientiousness, 
				user_traits.extraversion 
			from user_traits
		) as traits
		on user_rating_map.user_id = traits.user_id
		where user_rating_map.prediction > user_rating_map.avg_rating;
		
end; $$
