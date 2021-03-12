select distinct mid, array(select distinct tag from tags where mid = $1) from tags where mid = $1 

-- In combination with movies table 
select * from movies
inner join(
	select distinct mid, array(select distinct tag from tags where mid = $1) as tag_list from tags where mid = $1 
) as tags
on movies.mid = tags.mid 