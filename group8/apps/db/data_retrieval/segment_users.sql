-- Segmant by ratings 
with avg_rating as (select avg(rating) from ratings where mid = 862),
	likes_tmp as (select mid, count(*) as likes from ratings where rating > (select * from avg_rating) AND mid = 862 group by mid),
	dislikes_tmp as (select mid, count(*) as dislikes from ratings where rating < (select * from avg_rating) AND mid = 862 group by mid)
	
	
select t.mid, likes, t.dislikes from likes_tmp
inner join(
	select * from dislikes_tmp
) as t
on likes_tmp.mid = t.mid

-- Segmant by tags
select mid, tag, count(*) from tags where mid = 862 group by tag, mid