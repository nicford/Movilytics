-- function to get average genre rating and company rating 
create or replace function get_genre_company_avg (
	movie_id integer DEFAULT NULL
) 
	returns table(
		genre_avg decimal,
		company_avg decimal 
	)
	language plpgsql
as $$
	begin 	
		return query 
			with 
				genre_table as (
					select avg(genre_info.genre_avg_rating) as genre_avg 
					from genre_info 
						where genre_info.genre_id in (
							select genres.genre_id from genres 
							where (movie_id ISNULL OR genres.mid = movie_id)
						)
				),
				company_table as (
					select avg(company_info.avg_company_rating) as company_avg 
					from company_info 
						where company_info.company_id  in (
							select companies.company_id from companies 
							where (movie_id ISNULL OR companies.mid = movie_id)
						)
				)
			
			select genre_table.genre_avg, company_table.company_avg from genre_table, company_table;
end;$$
			
			