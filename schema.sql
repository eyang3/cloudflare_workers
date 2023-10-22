--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4 (Homebrew)

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
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: locs; Type: TABLE; Schema: public; Owner: eyang3
--

CREATE TABLE public.locs (
    ipaddress cidr,
    userid character varying(32),
    ban boolean
);


ALTER TABLE public.locs OWNER TO eyang3;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: eyang3
--

CREATE TABLE public.posts (
    postid uuid DEFAULT gen_random_uuid() NOT NULL,
    post text,
    userid character varying(32),
    upvotes integer,
    downvotes integer,
    hashtags text[],
    post_date timestamp without time zone,
    replyto uuid
);


ALTER TABLE public.posts OWNER TO eyang3;

--
-- Name: usertable; Type: TABLE; Schema: public; Owner: eyang3
--

CREATE TABLE public.usertable (
    userid character varying(32) NOT NULL,
    userimg character varying(256),
    username character varying(32),
    ipaddresses inet[],
    lastpost date,
    numposts integer DEFAULT 10,
    numpost_today integer DEFAULT 0
);


ALTER TABLE public.usertable OWNER TO eyang3;

--
-- Name: locs locs_ipaddress_userid_key; Type: CONSTRAINT; Schema: public; Owner: eyang3
--

ALTER TABLE ONLY public.locs
    ADD CONSTRAINT locs_ipaddress_userid_key UNIQUE (ipaddress, userid);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: eyang3
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (postid);


--
-- Name: usertable usertable_pkey; Type: CONSTRAINT; Schema: public; Owner: eyang3
--

ALTER TABLE ONLY public.usertable
    ADD CONSTRAINT usertable_pkey PRIMARY KEY (userid);


--
-- Name: date_index; Type: INDEX; Schema: public; Owner: eyang3
--

CREATE INDEX date_index ON public.posts USING btree (post_date);

ALTER TABLE public.posts CLUSTER ON date_index;


--
-- Name: hashtag_index; Type: INDEX; Schema: public; Owner: eyang3
--

CREATE INDEX hashtag_index ON public.posts USING gin (hashtags);


--
-- Name: locs_ipaddress_idx; Type: INDEX; Schema: public; Owner: eyang3
--

CREATE INDEX locs_ipaddress_idx ON public.locs USING btree (ipaddress);


--
-- Name: userid_index; Type: INDEX; Schema: public; Owner: eyang3
--

CREATE INDEX userid_index ON public.usertable USING btree (userid);


--
-- PostgreSQL database dump complete
--

