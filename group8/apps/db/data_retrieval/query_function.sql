-- Query from function format example, do not pass in value if value is null 
select * from get_movies(keyword := 'Toy Story', sort_by := 'title', allowed_ratings := '{3,4,5}')

-- To query data in bulk for pagination, please use the result_offset parameter
-- Result offset is by default set to 0 
select * from get_movies(result_offset := 100, sort_by := 'title', allowed_ratings := '{3,4,5}')