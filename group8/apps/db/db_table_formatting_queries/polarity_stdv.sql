-- Standard deviation query
select stddev(rating) from (select rating from ratings where mid = 862) as test;