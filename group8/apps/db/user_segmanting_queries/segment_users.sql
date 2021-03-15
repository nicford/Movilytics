with tag_list as (
	select ratings.user_id, ratings.mid, ratings.rating, t.tag from ratings 
	inner join (
	select * from tags where tag in (select tag from tags where mid = 862)
	) as t 
	on ratings.mid = t.mid and ratings.user_id = t.user_id
)
,tag_data as (
	select j.tag, avg(rating) from (
		select * from tag_list	
	) as j
	group by j.tag
)

select 
	tag_list.tag,
	count(*) filter(where tag_list.rating >= (select tag_data.avg from tag_data where tag_data.tag = tag_list.tag)) as likes,
	count(*) filter(where tag_list.rating < (select tag_data.avg from tag_data where tag_data.tag = tag_list.tag)) as dislikes
from tag_list
group by tag
