--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


--
-- Name: get_genre_company_avg(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_genre_company_avg(movie_id integer DEFAULT NULL::integer) RETURNS TABLE(genre_avg numeric, company_avg numeric)
    LANGUAGE plpgsql
    AS $$
	begin 	
		return query 
			with 
				genre_table as (
					select avg(genre_info.genre_avg_rating) as genre_avg 
					from genre_info 
						where genre_info.genre_id in (
							select genres.genre_id from genres where genres.mid = movie_id
						)
				),
				company_table as (
					select avg(company_info.avg_company_rating) as company_avg 
					from company_info 
						where company_info.company_id  in (
							select companies.company_id from companies where companies.mid = movie_id
						)
				)
			
			select genre_table.genre_avg, company_table.company_avg from genre_table, company_table;
end;$$;


ALTER FUNCTION public.get_genre_company_avg(movie_id integer) OWNER TO postgres;

--
-- Name: get_movies(integer, integer, text, text, boolean, integer, integer, integer[], integer[], character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_movies(result_limit integer DEFAULT 100, result_offset integer DEFAULT 0, keyword text DEFAULT NULL::text, sort_by text DEFAULT NULL::text, ascending boolean DEFAULT true, start_year integer DEFAULT NULL::integer, end_year integer DEFAULT NULL::integer, allowed_ratings integer[] DEFAULT NULL::integer[], genres_arg integer[] DEFAULT NULL::integer[], status_arg character varying DEFAULT NULL::character varying) RETURNS TABLE(mid integer, title text, poster_path character varying, vote_average numeric, tagline text, status character varying)
    LANGUAGE plpgsql
    AS $$
	begin
		return query
			select filtered.mid, filtered.title, filtered.poster_path, filtered.vote_average, filtered.tagline, filtered.status
			from (
				select distinct on (movies.mid) movies.mid, movies.title, movies.poster_path, movies.vote_average, movies.tagline, movies.popularity, movies.released_year, movies.status, genres_table.genre_id, rating_table.avg_rating, rating_table.polarity
				from movies
				inner join(
					select movie_stats.mid, movie_stats.avg_rating, movie_stats.polarity from movie_stats 
				) as rating_table
				on movies.mid = rating_table.mid
				inner join(
					select genres.mid, genres.genre_id from genres group by genres.mid, genres.genre_id	
				) as genres_table
				on movies.mid = genres_table.mid
				where 
				(keyword ISNULL OR movies.title ilike keyword)
				and 
				(allowed_ratings ISNULL OR rating_table.avg_rating >= ANY(allowed_ratings))
				and 
				(status_arg ISNULL OR movies.status = status_arg)
				and 
				(genres_arg ISNULL OR genres_table.genre_id = ANY(genres_arg))
				and 
				(start_year ISNULL or movies.released_year >= start_year)
				and
				(end_year ISNULL or movies.released_year <= end_year)
				ORDER BY movies.mid
			) as filtered
			ORDER BY
			CASE WHEN sort_by = 'popularity' AND ascending = FALSE THEN filtered.popularity END DESC,
			CASE WHEN sort_by = 'popularity' AND ascending = TRUE THEN filtered.popularity END ASC,
			CASE WHEN sort_by = 'title' AND ascending = FALSE THEN filtered.title END DESC,
			CASE WHEN sort_by = 'title' AND ascending = TRUE THEN filtered.title END ASC,
			CASE WHEN sort_by = 'year' AND ascending = FALSE THEN filtered.released_year END DESC,
			CASE WHEN sort_by = 'year' AND ascending = TRUE THEN filtered.released_year END ASC,
			CASE WHEN sort_by = 'polarity' AND ascending = FALSE THEN filtered.polarity END DESC,
			CASE WHEN sort_by = 'polarity' AND ascending = TRUE THEN filtered.polarity END ASC,
			CASE WHEN sort_by = 'rating' AND ascending = FALSE THEN filtered.avg_rating END DESC,
			CASE WHEN sort_by = 'rating' AND ascending = TRUE THEN filtered.avg_rating END ASC
			limit result_limit offset result_offset;
end; $$;


ALTER FUNCTION public.get_movies(result_limit integer, result_offset integer, keyword text, sort_by text, ascending boolean, start_year integer, end_year integer, allowed_ratings integer[], genres_arg integer[], status_arg character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    index integer NOT NULL,
    mid integer NOT NULL,
    company_id integer
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.companies ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.companies_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: company_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_info (
    company_id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    country_id character varying(2),
    avg_company_rating numeric
);


ALTER TABLE public.company_info OWNER TO postgres;

--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    index integer NOT NULL,
    mid integer NOT NULL,
    country_id character varying(2)
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: countries_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.countries ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.countries_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: country_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country_info (
    country_id character varying(2) NOT NULL,
    country_name character varying(255) NOT NULL
);


ALTER TABLE public.country_info OWNER TO postgres;

--
-- Name: genre_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre_info (
    genre_id integer NOT NULL,
    genre_name character varying(20) NOT NULL,
    genre_avg_rating numeric
);


ALTER TABLE public.genre_info OWNER TO postgres;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    index integer NOT NULL,
    mid integer NOT NULL,
    genre_id integer
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.genres ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.genres_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: language_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language_info (
    language_id character varying(2) NOT NULL,
    language_name character varying(30)
);


ALTER TABLE public.language_info OWNER TO postgres;

--
-- Name: movie_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_stats (
    mid integer NOT NULL,
    avg_rating numeric,
    polarity numeric
);


ALTER TABLE public.movie_stats OWNER TO postgres;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    mid integer NOT NULL,
    title text NOT NULL,
    overview text,
    budget integer NOT NULL,
    adult boolean NOT NULL,
    language_id character varying(2) NOT NULL,
    popularity numeric NOT NULL,
    poster_path character varying(255),
    video boolean,
    vote_average numeric NOT NULL,
    vote_count integer NOT NULL,
    runtime integer,
    status character varying(50) NOT NULL,
    tagline text,
    released_year integer,
    revenue bigint
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: people; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.people (
    index integer NOT NULL,
    mid integer NOT NULL,
    person_id integer
);


ALTER TABLE public.people OWNER TO postgres;

--
-- Name: people_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.people ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.people_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    person_id integer NOT NULL,
    name character varying(80) NOT NULL,
    department character varying(20) NOT NULL,
    birthday date,
    deathday date,
    gender integer NOT NULL,
    birth_place character varying(255)
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    index integer NOT NULL,
    user_id integer NOT NULL,
    mid integer NOT NULL,
    rating integer NOT NULL,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: ratings_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ratings ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ratings_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: spoken_languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spoken_languages (
    index integer NOT NULL,
    mid integer NOT NULL,
    language_id character varying(2)
);


ALTER TABLE public.spoken_languages OWNER TO postgres;

--
-- Name: spoken_languages_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.spoken_languages ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.spoken_languages_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    index integer NOT NULL,
    user_id integer NOT NULL,
    mid integer NOT NULL,
    tag character varying(100) NOT NULL,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tags ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tags_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.translations (
    index integer NOT NULL,
    mid integer NOT NULL,
    language_id character varying(2) NOT NULL
);


ALTER TABLE public.translations OWNER TO postgres;

--
-- Name: translations_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.translations ALTER COLUMN index ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.translations_index_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user_genre_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_genre_mapping (
    user_id integer NOT NULL,
    animation numeric,
    adventure numeric,
    family numeric,
    comedy numeric,
    fantasy numeric,
    romance numeric,
    drama numeric,
    action numeric,
    crime numeric,
    thriller numeric,
    horror numeric,
    history numeric,
    science_fiction numeric,
    mystery numeric,
    war numeric,
    music numeric,
    documentary numeric,
    western numeric,
    tv_movie numeric
);


ALTER TABLE public.user_genre_mapping OWNER TO postgres;

--
-- Name: user_names; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_names (
    user_id integer NOT NULL,
    firstname character varying(40) NOT NULL,
    lastname character varying(40) NOT NULL
);


ALTER TABLE public.user_names OWNER TO postgres;

--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (index);


--
-- Name: company_info company_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_pkey PRIMARY KEY (company_id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (index);


--
-- Name: country_info country_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country_info
    ADD CONSTRAINT country_info_pkey PRIMARY KEY (country_id);


--
-- Name: genre_info genre_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre_info
    ADD CONSTRAINT genre_info_pkey PRIMARY KEY (genre_id);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (index);


--
-- Name: language_info language_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language_info
    ADD CONSTRAINT language_info_pkey PRIMARY KEY (language_id);


--
-- Name: movie_stats movie_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_stats
    ADD CONSTRAINT movie_stats_pkey PRIMARY KEY (mid);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (mid);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (index);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (person_id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (index);


--
-- Name: spoken_languages spoken_languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_pkey PRIMARY KEY (index);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (index);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (index);


--
-- Name: user_genre_mapping user_genre_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_genre_mapping
    ADD CONSTRAINT user_genre_mapping_pkey PRIMARY KEY (user_id);


--
-- Name: user_names user_names_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_names
    ADD CONSTRAINT user_names_pkey PRIMARY KEY (user_id);


--
-- Name: companies companies_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company_info(company_id);


--
-- Name: companies companies_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: company_info company_info_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country_info(country_id);


--
-- Name: countries countries_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country_info(country_id);


--
-- Name: countries countries_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: genres genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre_info(genre_id);


--
-- Name: genres genres_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: movie_stats movie_stats_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_stats
    ADD CONSTRAINT movie_stats_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: people people_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: people people_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(person_id);


--
-- Name: ratings ratings_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_names(user_id);


--
-- Name: spoken_languages spoken_languages_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.language_info(language_id);


--
-- Name: spoken_languages spoken_languages_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: tags tags_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: tags tags_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_names(user_id);


--
-- Name: translations translations_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.language_info(language_id);


--
-- Name: translations translations_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- Name: user_genre_mapping user_genre_mapping_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_genre_mapping
    ADD CONSTRAINT user_genre_mapping_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_names(user_id);


--
-- PostgreSQL database dump complete
--

