create or replace function get_tag_likes_dislikes(
	movie_id integer default null
)
	returns table (
		tag varchar(100),
		likes bigint, 
		dislikes bigint,
		polarity decimal
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
						select tags.mid, tags.user_id, tags.tag from tags where tags.tag in (select tags.tag from tags where mid = movie_id)
					) as t 
					on ratings.mid = t.mid and ratings.user_id = t.user_id
				),
				tag_data as (
					select j.tag, avg(rating) 
					from (
						select tag_list.user_id, tag_list.mid, tag_list.rating, tag_list.tag  from tag_list	
					) as j
					group by j.tag
				),
				like_dislike as (
					select 
						tag_list.tag,
						count(*) filter(where tag_list.rating >= (select tag_data.avg from tag_data where tag_data.tag = tag_list.tag)) as likes,
						count(*) filter(where tag_list.rating < (select tag_data.avg from tag_data where tag_data.tag = tag_list.tag)) as dislikes
					from tag_list
					group by tag_list.tag
				)
				
				select like_dislike.tag, like_dislike.likes, like_dislike.dislikes, round(coalesce(tag_polarity.polarity,0), 2) as polarity from like_dislike
				left join(
					select tags.tag, coalesce(stddev(all_tag_ratings.rating), 0) as polarity from tags 
					inner join (
						select ratings.user_id, ratings.mid, ratings.rating from ratings 
					) as all_tag_ratings
					on all_tag_ratings.user_id = tags.user_id and all_tag_ratings.mid = tags.mid
					group by tags.tag
				) as tag_polarity
				on like_dislike.tag = tag_polarity.tag;
				
end; $$
