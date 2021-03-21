create or replace function get_tag_avg(
	movie_tag varchar(100)[] default null
) 
	returns table (
		tag varchar(100),
		tag_rating decimal
	)
	language plpgsql
as $$
	begin 
		return query 
			select tag_table.tag, COALESCE(avg(ratings.rating),0) as tag_rating  from ratings 
			inner join (
				select tags.user_id, tags.mid, tags.tag from tags 
				where (movie_tag ISNULL or tags.tag =  any(movie_tag))
			) as tag_table
			on tag_table.mid = ratings.mid and tag_table.user_id = ratings.user_id
			group by tag_table.tag;
end $$