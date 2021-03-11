select movies.*, genre.genre_list, lang.language_list, country.country_list, rating.avg_rating from movies 
inner join(
	select distinct mid, 
		   array( select genre_inner.genre_name from genres
				  inner join(
					select genre_id, genre_name from genre_info 
				  ) as genre_inner
				 on genres.genre_id = genre_inner.genre_id 
				 where mid = 862
	) as genre_list 
	from genres 
	where mid = 862
) as genre 
on movies.mid = genre.mid
inner join (
	select distinct mid, 
		   array( select distinct language_inner.language_name from spoken_languages
				  inner join(
					select language_id, language_name from language_info 
				  ) as language_inner
				 on spoken_languages.language_id = language_inner.language_id 
				 where mid = 862
	) as language_list
	from spoken_languages 
	where mid = 862
) as lang
on movies.mid = lang.mid
inner join (
    select distinct mid, 
        array( select distinct country_inner.country_name from countries
                inner join(
                    select country_id, country_name from country_info 
                ) as country_inner
                on countries.country_id = country_inner.country_id 
                where mid = 862
    ) as country_list
    from countries 
    where mid = 862
) as country
on movies.mid = country.mid
inner join(
    select mid, avg(rating) as avg_rating from ratings where mid = 862 group by mid 
) as rating 
on movies.mid = rating.mid