create or replace function get_overview(
	movie_id integer default null
)
	returns table (
		mid integer,
		title text,
		overview text,
		budget integer,
		adult boolean,
		popularity decimal,
		poster_path varchar(255),
		video boolean, 
		vote_average decimal,
		vote_acount integer,
		runtime integer,
		status varchar(50),
		tagline text,
		released_year integer,
		revenue integer,
		genre_list varchar(20)[],
		language_list varchar(30)[],
		country_list varchar(255)[],
		avg_rating decimal,
		translation_list varchar(30)[],
		tags_list varchar(100)[]
	)