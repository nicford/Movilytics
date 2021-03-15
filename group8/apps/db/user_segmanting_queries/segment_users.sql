create or replace function get_tag_likes_dislikes(
	movie_id integer default null
)
	returns table (
		tag varchar(100),
		likes bigint, 
		dislikes bigint
	)
	language plpgsql
as $$
	begin 
		return query
			with 
				tag_list as (
					select ratings.user_id, ratings.mid, ratings.rating, t.tag 
					from ratings 
					inner join (
						select * from tags where tags.tag in (select tags.tag from tags where mid = movie_id)
					) as t 
					on ratings.mid = t.mid and ratings.user_id = t.user_id
				)
				,tag_data as (
					select j.tag, avg(rating) 
					from (
						select * from tag_list	
					) as j
					group by j.tag
				)

				select 
					tag_list.tag,
					count(*) filter(where tag_list.rating >= (select tag_data.avg from tag_data where tag_data.tag = tag_list.tag)) as likes,
					count(*) filter(where tag_list.rating < (select tag_data.avg from tag_data where tag_data.tag = tag_list.tag)) as dislikes
				from tag_list
				group by tag_list.tag;
end; $$
