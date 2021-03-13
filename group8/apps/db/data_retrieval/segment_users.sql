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

-- User Genre Mappings 
select * from crosstab(
	'select user_id, genre_name, avg(rating) as avg_genre_rating from (
		select user_id, ratings.mid, t.genre_name, rating from ratings 
		inner join (
			select mid, genre_name from (
				select genres.mid, t.genre_name, k.rating from genres 
				inner join (
					select genre_id, genre_name from genre_info
				) as t 
				on t.genre_id = genres.genre_id 
				inner join (
					select mid, rating from ratings group by mid, rating 
				) as k
				on k.mid = genres.mid
				group by genres.mid, t.genre_name, k.rating
			) as tmp_1
		) as t
		on t.mid = ratings.mid 
	) as tmp_2
	group by user_id, genre_name
	order by 1,2'
) as t ("User ID" integer, 
		"Animation" decimal, 
		"Adventure" decimal, 
		"Family" decimal, 
		"Comedy" decimal, 
		"Fantasy" decimal,
		"Romance" decimal,
		"Drama" decimal,
		"Action" decimal,
		"Crime" decimal,
		"Thriller" decimal,
		"Horror" decimal,
		"History" decimal,
		"Science Fiction" decimal,
		"Mystery" decimal,
		"War" decimal,
		"Music" decimal,
		"Documentary" decimal,
		"Western" decimal,
		"TV Movie" decimal)	
