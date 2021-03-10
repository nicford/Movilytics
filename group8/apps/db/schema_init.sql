--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

-- Started on 2021-03-10 19:09:12 UTC

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 16385)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    index integer NOT NULL,
    mid integer NOT NULL,
    company_id integer
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16388)
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
-- TOC entry 202 (class 1259 OID 16390)
-- Name: company_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_info (
    company_id integer NOT NULL,
    company_name character varying(100) NOT NULL,
    country_id character varying(2)
);


ALTER TABLE public.company_info OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16393)
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    index integer NOT NULL,
    mid integer NOT NULL,
    country_id character varying(2)
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16396)
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
-- TOC entry 205 (class 1259 OID 16398)
-- Name: country_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country_info (
    country_id character varying(2) NOT NULL,
    country_name character varying(255) NOT NULL
);


ALTER TABLE public.country_info OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16401)
-- Name: genre_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre_info (
    genre_id integer NOT NULL,
    genre_name character varying(20) NOT NULL
);


ALTER TABLE public.genre_info OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16404)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    index integer NOT NULL,
    mid integer NOT NULL,
    genre_id integer
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16407)
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
-- TOC entry 209 (class 1259 OID 16409)
-- Name: language_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language_info (
    language_id character varying(2) NOT NULL,
    language_name character varying(30)
);


ALTER TABLE public.language_info OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16412)
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
    tagline text
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16418)
-- Name: people; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.people (
    index integer NOT NULL,
    mid integer NOT NULL,
    person_id integer
);


ALTER TABLE public.people OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16421)
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
-- TOC entry 213 (class 1259 OID 16423)
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
-- TOC entry 214 (class 1259 OID 16426)
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
-- TOC entry 215 (class 1259 OID 16429)
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
-- TOC entry 216 (class 1259 OID 16431)
-- Name: spoken_languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spoken_languages (
    index integer NOT NULL,
    mid integer NOT NULL,
    language_id character varying(2)
);


ALTER TABLE public.spoken_languages OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16434)
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
-- TOC entry 220 (class 1259 OID 16565)
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
-- TOC entry 219 (class 1259 OID 16563)
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
-- TOC entry 218 (class 1259 OID 16441)
-- Name: user_names; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_names (
    user_id integer NOT NULL,
    firstname character varying(40) NOT NULL,
    lastname character varying(40) NOT NULL
);


ALTER TABLE public.user_names OWNER TO postgres;

--
-- TOC entry 2869 (class 2606 OID 16445)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (index);


--
-- TOC entry 2871 (class 2606 OID 16447)
-- Name: company_info company_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_pkey PRIMARY KEY (company_id);


--
-- TOC entry 2873 (class 2606 OID 16449)
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (index);


--
-- TOC entry 2875 (class 2606 OID 16451)
-- Name: country_info country_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country_info
    ADD CONSTRAINT country_info_pkey PRIMARY KEY (country_id);


--
-- TOC entry 2877 (class 2606 OID 16453)
-- Name: genre_info genre_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre_info
    ADD CONSTRAINT genre_info_pkey PRIMARY KEY (genre_id);


--
-- TOC entry 2879 (class 2606 OID 16455)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (index);


--
-- TOC entry 2881 (class 2606 OID 16457)
-- Name: language_info language_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language_info
    ADD CONSTRAINT language_info_pkey PRIMARY KEY (language_id);


--
-- TOC entry 2883 (class 2606 OID 16459)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (mid);


--
-- TOC entry 2885 (class 2606 OID 16461)
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (index);


--
-- TOC entry 2887 (class 2606 OID 16463)
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (person_id);


--
-- TOC entry 2889 (class 2606 OID 16465)
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (index);


--
-- TOC entry 2891 (class 2606 OID 16467)
-- Name: spoken_languages spoken_languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_pkey PRIMARY KEY (index);


--
-- TOC entry 2895 (class 2606 OID 16569)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (index);


--
-- TOC entry 2893 (class 2606 OID 16471)
-- Name: user_names user_names_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_names
    ADD CONSTRAINT user_names_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2896 (class 2606 OID 16472)
-- Name: companies companies_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company_info(company_id);


--
-- TOC entry 2897 (class 2606 OID 16477)
-- Name: companies companies_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2898 (class 2606 OID 16482)
-- Name: company_info company_info_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_info
    ADD CONSTRAINT company_info_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country_info(country_id);


--
-- TOC entry 2899 (class 2606 OID 16487)
-- Name: countries countries_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country_info(country_id);


--
-- TOC entry 2900 (class 2606 OID 16492)
-- Name: countries countries_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2901 (class 2606 OID 16497)
-- Name: genres genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genre_info(genre_id);


--
-- TOC entry 2902 (class 2606 OID 16502)
-- Name: genres genres_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2903 (class 2606 OID 16507)
-- Name: people people_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2904 (class 2606 OID 16512)
-- Name: people people_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(person_id);


--
-- TOC entry 2905 (class 2606 OID 16517)
-- Name: ratings ratings_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2906 (class 2606 OID 16522)
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_names(user_id);


--
-- TOC entry 2907 (class 2606 OID 16527)
-- Name: spoken_languages spoken_languages_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.language_info(language_id);


--
-- TOC entry 2908 (class 2606 OID 16532)
-- Name: spoken_languages spoken_languages_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spoken_languages
    ADD CONSTRAINT spoken_languages_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2910 (class 2606 OID 16575)
-- Name: tags tags_mid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_mid_fkey FOREIGN KEY (mid) REFERENCES public.movies(mid);


--
-- TOC entry 2909 (class 2606 OID 16570)
-- Name: tags tags_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_names(user_id);


-- Completed on 2021-03-10 19:09:17 UTC

--
-- PostgreSQL database dump complete
--

