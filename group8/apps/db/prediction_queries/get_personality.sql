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
				 		distinct on (mid) mid 
				 	from tags 
				 	where tag = any(tag_inputs)
				)
			), 
			sto as (
				select 
					user_id, 
					prediction, 
					t.mid, 
					t.avg_rating 
				from user_predictive_rate 
				inner join (
					select * from avg_movie_ratings
				) as t
				on user_predictive_rate.mid = t.mid
			)
	
		select 
			avg(openness) as openness,
			avg(agreeableness) as agreeableness,
			avg(emotional_stability) as emotional_stability,
			avg(conscientiousness) as conscientiousness,
			avg(extraversion) as extraversion
		from sto 
		inner join(
			select * from user_traits
		) as j
		on sto.user_id = j.user_id
		where prediction > avg_rating;
		
end; $$
