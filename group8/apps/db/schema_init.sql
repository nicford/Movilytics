--
-- Name: countries; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE countries (
    country_name text NOT NULL,
    country_id character varying(2) NOT NULL,
    country_code integer NOT NULL
);


ALTER TABLE countries OWNER TO postgres;

--
-- Name: genre; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE genre (
    genre_id integer NOT NULL,
    genre_name character varying(50) NOT NULL
);


ALTER TABLE genre OWNER TO postgres;

-- 
-- Name: genre_genre_id_seq; Type: SEQUENCE; Schema:  Owner: postgres
--

CREATE SEQUENCE genre_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE genre_genre_id_seq OWNER TO postgres;

--
-- Name: genre_genre_id_seq; Type: SEQUENCE OWNED BY; Schema:  Owner: postgres
--

ALTER SEQUENCE genre_genre_id_seq OWNED BY genre.genre_id;


--
-- Name: links; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE links (
    mid integer NOT NULL,
    imdbid integer NOT NULL,
    tmbdid integer NOT NULL
);


ALTER TABLE links OWNER TO postgres;

--
-- Name: movie; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE movie (
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


ALTER TABLE movie OWNER TO postgres;

--
-- Name: people; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE people (
    id integer NOT NULL,
    name text NOT NULL,
    department text NOT NULL,
    birthday date DEFAULT CURRENT_DATE NOT NULL,
    deathday date,
    gender character varying(10),
    country_id character varying(2)
);


ALTER TABLE people OWNER TO postgres;

--
-- Name: production_companies; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE production_companies (
    company_id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    country_id character varying(2) NOT NULL
);


ALTER TABLE production_companies OWNER TO postgres;

--
-- Name: production_companies_company_id_seq; Type: SEQUENCE; Schema:  Owner: postgres
--

CREATE SEQUENCE production_companies_company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE production_companies_company_id_seq OWNER TO postgres;

--
-- Name: production_companies_company_id_seq; Type: SEQUENCE OWNED BY; Schema:  Owner: postgres
--

ALTER SEQUENCE production_companies_company_id_seq OWNED BY production_companies.company_id;


--
-- Name: rating; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE rating (
    user_id integer NOT NULL,
    mid integer NOT NULL,
    rating integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE rating OWNER TO postgres;

--
-- Name: rating_user_id_seq; Type: SEQUENCE; Schema:  Owner: postgres
--

CREATE SEQUENCE rating_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE rating_user_id_seq OWNER TO postgres;

--
-- Name: rating_user_id_seq; Type: SEQUENCE OWNED BY; Schema:  Owner: postgres
--

ALTER SEQUENCE rating_user_id_seq OWNED BY rating.user_id;


--
-- Name: spoken_languages; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE spoken_languages (
    language_id character varying(2) NOT NULL,
    language_name character varying(50) NOT NULL
);


ALTER TABLE spoken_languages OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema:  Owner: postgres
--

CREATE TABLE users (
    user_id integer NOT NULL,
    f_name text NOT NULL,
    l_name text NOT NULL,
    email text NOT NULL
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema:  Owner: postgres
--

CREATE SEQUENCE users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema:  Owner: postgres
--

ALTER SEQUENCE users_user_id_seq OWNED BY users.user_id;


--
-- Name: genre genre_id; Type: DEFAULT; Schema:  Owner: postgres
--

ALTER TABLE ONLY genre ALTER COLUMN genre_id SET DEFAULT nextval('genre_genre_id_seq'::regclass);


--
-- Name: production_companies company_id; Type: DEFAULT; Schema:  Owner: postgres
--

ALTER TABLE ONLY production_companies ALTER COLUMN company_id SET DEFAULT nextval('production_companies_company_id_seq'::regclass);


--
-- Name: rating user_id; Type: DEFAULT; Schema:  Owner: postgres
--

ALTER TABLE ONLY rating ALTER COLUMN user_id SET DEFAULT nextval('rating_user_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema:  Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN user_id SET DEFAULT nextval('users_user_id_seq'::regclass);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (country_id);


--
-- Name: genre genre_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY genre
    ADD CONSTRAINT genre_pkey PRIMARY KEY (genre_id);


--
-- Name: links links_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY links
    ADD CONSTRAINT links_pkey PRIMARY KEY (mid);


--
-- Name: movie movie_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY movie
    ADD CONSTRAINT movie_pkey PRIMARY KEY (movie_id);


--
-- Name: people people_id_key; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY people
    ADD CONSTRAINT people_id_key UNIQUE (id);


--
-- Name: production_companies production_companies_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY production_companies
    ADD CONSTRAINT production_companies_pkey PRIMARY KEY (company_id);


--
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (user_id, mid);


--
-- Name: spoken_languages spoken_languages_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY spoken_languages
    ADD CONSTRAINT spoken_languages_pkey PRIMARY KEY (language_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: people people_country_id_fkey; Type: FK CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY people
    ADD CONSTRAINT people_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(country_id);


--
-- Name: production_companies production_companies_country_id_fkey; Type: FK CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY production_companies
    ADD CONSTRAINT production_companies_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(country_id);


--
-- Name: rating rating_user_id_fkey; Type: FK CONSTRAINT; Schema:  Owner: postgres
--

ALTER TABLE ONLY rating
    ADD CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id);


