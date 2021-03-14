with avg_rating as (select avg(rating) from ratings where mid = 862)
	
select mid,
	count(*) filter(where rating > (select * from avg_rating)) as likes,
	count(*) filter(where rating < (select * from avg_rating)) as dislikes
from ratings 
where mid = 862
group by mid