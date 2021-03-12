select distinct mid, array(select distinct tag from tags where mid = 862) from tags where mid = 862 

-- In combination with movies table 
select * from movies
inner join(
	select distinct mid, array(select distinct tag from tags where mid = 862) as tag_list from tags where mid = 862 
) as tags
on movies.mid = tags.mid 

-- Segmant by tags
select mid, tag, count(*) from tags where mid = 862 group by tag, mid