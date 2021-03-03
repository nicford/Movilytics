--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-03-03 17:48:25 UTC

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
-- TOC entry 3007 (class 1262 OID 13395)
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

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
-- TOC entry 3008 (class 0 OID 0)
-- Dependencies: 3007
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16397)
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    country_name text NOT NULL,
    country_id character varying(2) NOT NULL,
    country_code integer NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16386)
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    genre_id integer NOT NULL,
    genre_name character varying(50) NOT NULL
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 16384)
-- Name: genre_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genre_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genre_genre_id_seq OWNER TO postgres;

--
-- TOC entry 3009 (class 0 OID 0)
-- Dependencies: 200
-- Name: genre_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genre_genre_id_seq OWNED BY public.genre.genre_id;


--
-- TOC entry 206 (class 1259 OID 16426)
-- Name: links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.links (
    mid integer NOT NULL,
    imdbid integer NOT NULL,
    tmbdid integer NOT NULL
);


ALTER TABLE public.links OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 24576)
-- Name: movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie (
    movie_id integer NOT NULL,
    title text NOT NULL,
    genres integer[],
    overview text,
    budget integer,
    adult boolean,
    language_id character varying(2) NOT NULL,
    popularity integer,
    poster_path text,
    company_id integer,
    production_countries character varying(2)[],
    spoken_languages character varying(2)[],
    video boolean,
    vote_average integer,
    vote_count integer,
    status text,
    tagline text,
    people_invovled integer[]
);


ALTER TABLE public.movie OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16431)
-- Name: people; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.people (
    id integer NOT NULL,
    name text NOT NULL,
    department text NOT NULL,
    birthday date DEFAULT CURRENT_DATE NOT NULL,
    deathday date,
    gender character varying(10),
    country_id character varying(2)
);


ALTER TABLE public.people OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16415)
-- Name: production_companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_companies (
    company_id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    country_id character varying(2) NOT NULL
);


ALTER TABLE public.production_companies OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16413)
-- Name: production_companies_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.production_companies_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.production_companies_company_id_seq OWNER TO postgres;

--
-- TOC entry 3010 (class 0 OID 0)
-- Dependencies: 204
-- Name: production_companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.production_companies_company_id_seq OWNED BY public.production_companies.company_id;


--
-- TOC entry 211 (class 1259 OID 16458)
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    user_id integer NOT NULL,
    mid integer NOT NULL,
    rating integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16456)
-- Name: rating_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rating_user_id_seq OWNER TO postgres;

--
-- TOC entry 3011 (class 0 OID 0)
-- Dependencies: 210
-- Name: rating_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_user_id_seq OWNED BY public.rating.user_id;


--
-- TOC entry 202 (class 1259 OID 16392)
-- Name: spoken_languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spoken_languages (
    language_id character varying(2) NOT NULL,
    language_name character varying(50) NOT NULL
);


ALTER TABLE public.spoken_languages OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16447)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    f_name text NOT NULL,
    l_name text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16445)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3012 (class 0 OID 0)
-- Dependencies: 208
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 2845 (class 2604 OID 16389)
-- Name: genre genre_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre ALTER COLUMN genre_id SET DEFAULT nextval('public.genre_genre_id_seq'::regclass);


--
-- TOC entry 2846 (class 2604 OID 16418)
-- Name: production_companies company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_companies ALTER COLUMN company_id SET DEFAULT nextval('public.production_companies_company_id_seq'::regclass);


--
-- TOC entry 2849 (class 2604 OID 16461)
-- Name: rating user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN user_id SET DEFAULT nextval('public.rating_user_id_seq'::regclass);


--
-- TOC entry 2848 (class 2604 OID 16450)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 2856 (class 2606 OID 16404)
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (country_id);


--
-- TOC entry 2852 (class 2606 OID 16391)
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 2860 (class 2606 OID 16430)
-- Name: links links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (mid);


--
-- TOC entry 2868 (class 2606 OID 24583)
-- Name: movie movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie
    ADD CONSTRAINT movie_pkey PRIMARY KEY (movie_id);


--
-- TOC entry 2862 (class 2606 OID 16439)
-- Name: people people_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_id_key UNIQUE (id);


--
-- TOC entry 2858 (class 2606 OID 16420)
-- Name: production_companies production_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_companies
    ADD CONSTRAINT production_companies_pkey PRIMARY KEY (company_id);


--
-- TOC entry 2866 (class 2606 OID 16464)
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (user_id, mid);


--
-- TOC entry 2854 (class 2606 OID 16396)
-- Name: spoken_languages spoken_languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_pkey PRIMARY KEY (language_id);


--
-- TOC entry 2864 (class 2606 OID 16455)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2870 (class 2606 OID 16440)
-- Name: people people_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(country_id);


--
-- TOC entry 2869 (class 2606 OID 16421)
-- Name: production_companies production_companies_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_companies
    ADD CONSTRAINT production_companies_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(country_id);


--
-- TOC entry 2871 (class 2606 OID 16465)
-- Name: rating rating_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2021-03-03 17:48:25 UTC

--
-- PostgreSQL database dump complete
--

