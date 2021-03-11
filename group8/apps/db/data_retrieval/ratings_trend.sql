select DATE_TRUNC('month',timestamp) as month, avg(rating) as avg_rating from ratings where mid = 862 group by DATE_TRUNC('month',timestamp)

-- Standard deviation query
select stddev(rating) from (select rating from ratings where mid = 862) as test;