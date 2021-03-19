create or replace function get_activity_trend(
	movie_id integer default null
) 
	returns table (
		month text, 
		activity bigint, 
		avg_rating decimal
	)
	language plpgsql
as $$
	begin
		return query  
			with 
				rating_month as (
					select 
						DATE_TRUNC('month',timestamp) AS  month, 
						count(rating) as rating_activity, avg(rating) as avg_rating 
					from ratings 
					where mid = movie_id 
					group by DATE_TRUNC('month',timestamp)
				),
				tag_month as (
					select 
						DATE_TRUNC('month',timestamp) AS  month,  
						count(tag) as tag_activity 
					from tags 
					where mid = movie_id 
					group by  DATE_TRUNC('month',timestamp)
				)
			
			select 
				to_char(processed.coalesce_month, 'YYYY-MM'),
				coalesce(processed.activity,0) as activity,
				coalesce(processed.avg_rating,0) as avg_rating
			from (
				select 
					coalesce(rating_month.month, t.month) as coalesce_month, 
					coalesce(rating_month.rating_activity, 0) + coalesce(t.tag_activity, 0) as activity, 
					rating_month.avg_rating
				from rating_month 
				full outer join (
					select tag_month.month, tag_month.tag_activity from tag_month
				) as t 
				on t.month = rating_month.month
				where (rating_month.month is not null or t.month is not null)
			) as processed;
			
end; $$
