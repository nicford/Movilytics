with rating_month as (select DATE_TRUNC('month',timestamp) AS  month, count(rating) as rating_activity, avg(rating) as avg_rating from ratings where mid = $1 group by DATE_TRUNC('month',timestamp)),
tag_month as (select DATE_TRUNC('month',timestamp) AS  month,  count(tag) as tag_activity from tags where mid = $1 group by  DATE_TRUNC('month',timestamp))

select rating_month.month, coalesce(rating_month.rating_activity, 0) + coalesce(t.tag_activity, 0) as activity, rating_month.avg_rating from rating_month 
full outer join (
	select month, tag_activity from tag_month
) as t 
on t.month = rating_month.month
