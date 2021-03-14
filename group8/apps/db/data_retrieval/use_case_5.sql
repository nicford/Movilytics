update companies 
set companies.avg_company_rating = k.avg_company_rating
select index, mid, companies.company_id, k.avg_company_rating from companies 
left join (
	select company_id, avg(rating) as avg_company_rating from (
		select t.company_id, ratings.mid, rating from ratings
		inner join (
			select company_id, mid from companies group by company_id, mid
		) as t 
		on t.mid = ratings.mid
	) as j 
	group by company_id
) as k
on k.company_id = companies.mid


select person_id, avg(rating) as avg_person_rating from (
	select t.person_id, t.mid, rating from ratings
	inner join (
		select person_id, mid from people group by person_id, mid
	) as t 
	on t.mid = ratings.mid
) as j 
where person_id is not null
group by person_id