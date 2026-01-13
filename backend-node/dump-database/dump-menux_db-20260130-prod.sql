--
-- PostgreSQL database dump
--

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.2

-- Started on 2026-01-30 17:34:18 -03

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
-- TOC entry 2 (class 3079 OID 16385)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3731 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 954 (class 1247 OID 33719)
-- Name: categories_pricerule_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.categories_pricerule_enum AS ENUM (
    'SUM',
    'AVERAGE',
    'HIGHEST',
    'NONE'
);


--
-- TOC entry 924 (class 1247 OID 17142)
-- Name: customers_customer_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.customers_customer_type_enum AS ENUM (
    'registered',
    'anonymous'
);


--
-- TOC entry 927 (class 1247 OID 17228)
-- Name: menu_items_menutype_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.menu_items_menutype_enum AS ENUM (
    'PRODUCT',
    'WINE',
    'PIZZA'
);


--
-- TOC entry 936 (class 1247 OID 25419)
-- Name: menus_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.menus_type_enum AS ENUM (
    'PRODUCT',
    'PIZZA',
    'WINE',
    'DESSERT'
);


--
-- TOC entry 903 (class 1247 OID 16879)
-- Name: orders_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.orders_status_enum AS ENUM (
    'WAITING',
    'PREPARING',
    'READY',
    'DELIVERED',
    'FINISHED',
    'CANCELED'
);


--
-- TOC entry 906 (class 1247 OID 16914)
-- Name: tables_priority_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tables_priority_enum AS ENUM (
    'MEDIUM',
    'HIGH'
);


--
-- TOC entry 909 (class 1247 OID 16920)
-- Name: tables_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tables_status_enum AS ENUM (
    'FREE',
    'OCCUPIED',
    'CLOSING',
    'CLOSED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 17132)
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type character varying NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    session_id character varying NOT NULL,
    item_id character varying,
    context character varying,
    name character varying,
    price character varying,
    item_count integer,
    total_value numeric(10,2),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 218 (class 1259 OID 16416)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "restaurantId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    pai uuid,
    "isComposition" boolean DEFAULT false NOT NULL,
    "isVisible" boolean DEFAULT true NOT NULL,
    "maxChoices" integer,
    "canPriceBeZero" boolean DEFAULT false NOT NULL,
    "isOptional" boolean DEFAULT false NOT NULL,
    "priceRule" public.categories_pricerule_enum DEFAULT 'SUM'::public.categories_pricerule_enum NOT NULL,
    "deletedAt" timestamp without time zone
);


--
-- TOC entry 234 (class 1259 OID 33608)
-- Name: category_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "categoryId" uuid NOT NULL,
    "compositionCategoryId" uuid NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    min integer,
    max integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 33696)
-- Name: choice_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.choice_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    extra_price numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "choosenMenuItemId" uuid NOT NULL,
    "parentMenuItemId" uuid NOT NULL
);


--
-- TOC entry 227 (class 1259 OID 16936)
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying,
    phone character varying,
    anon_id character varying,
    origin character varying,
    restaurant_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    customer_type public.customers_customer_type_enum DEFAULT 'registered'::public.customers_customer_type_enum NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 17114)
-- Name: daily_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_metrics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    restaurant_id uuid NOT NULL,
    date date NOT NULL,
    total_orders integer DEFAULT 0 NOT NULL,
    total_revenue numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    average_ticket numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    average_decision_time double precision DEFAULT '0'::double precision NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 33657)
-- Name: menu_item_option_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_item_option_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    menu_item_option_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    price numeric(10,2),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 17246)
-- Name: menu_item_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_item_options (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "menuItemId" uuid NOT NULL,
    "optionItemId" uuid NOT NULL
);


--
-- TOC entry 217 (class 1259 OID 16405)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    allergens text,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "categoryId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    code character varying,
    ingredients text,
    tags text,
    "menuId" uuid NOT NULL,
    "menuType" public.menu_items_menutype_enum DEFAULT 'PRODUCT'::public.menu_items_menutype_enum NOT NULL,
    "optionsConfig" json,
    "maxChoices" integer DEFAULT 1,
    vintage character varying,
    country character varying,
    winery character varying,
    grape character varying,
    region character varying,
    style character varying,
    "glassPrice" numeric(10,2),
    "deletedAt" timestamp without time zone
);


--
-- TOC entry 235 (class 1259 OID 33628)
-- Name: menu_items_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_items_options (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    menu_item_id uuid,
    category_group_id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 16441)
-- Name: menus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menus (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "restaurantId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    type public.menus_type_enum DEFAULT 'PRODUCT'::public.menus_type_enum NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 16397)
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 16396)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3732 (class 0 OID 0)
-- Dependencies: 215
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 231 (class 1259 OID 17238)
-- Name: order_item_compositions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item_compositions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderItemId" uuid NOT NULL,
    "menuItemId" uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "groupKey" character varying,
    name character varying,
    "priceRule" character varying,
    "extraPrice" numeric(10,2) DEFAULT '0'::numeric NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 16518)
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    observation character varying,
    order_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    decision_time integer,
    is_suggestion boolean DEFAULT false NOT NULL,
    suggestion_type character varying
);


--
-- TOC entry 223 (class 1259 OID 16507)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(20) NOT NULL,
    status public.orders_status_enum DEFAULT 'WAITING'::public.orders_status_enum NOT NULL,
    total numeric(10,2) NOT NULL,
    "tableNumber" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    restaurant_id uuid,
    waiter_id uuid,
    table_id uuid,
    customer_id uuid,
    transaction_id uuid,
    temporary_customer_id character varying,
    total_decision_time integer
);


--
-- TOC entry 219 (class 1259 OID 16428)
-- Name: restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    cnpj character varying,
    "tradingName" character varying,
    "corporateName" character varying,
    "logoUrl" text,
    description text,
    phone character varying,
    email character varying,
    address text,
    "openingHours" character varying,
    instagram character varying,
    facebook character varying,
    whatsapp character varying,
    website character varying,
    "headerUrl" text
);


--
-- TOC entry 221 (class 1259 OID 16452)
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "restaurantId" character varying NOT NULL,
    "tableCode" character varying NOT NULL,
    "customerName" character varying,
    "startedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "endedAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 25428)
-- Name: system_parameters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_parameters (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "restaurantId" uuid NOT NULL,
    "pizzaCategoryId" uuid,
    "wineCategoryId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16865)
-- Name: tables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tables (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    number integer NOT NULL,
    status public.tables_status_enum DEFAULT 'FREE'::public.tables_status_enum NOT NULL,
    capacity integer DEFAULT 0 NOT NULL,
    "currentPeople" integer DEFAULT 0 NOT NULL,
    "openedAt" timestamp without time zone,
    "closedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    restaurant_id uuid NOT NULL,
    waiter_id uuid,
    priority public.tables_priority_enum,
    total numeric(10,2) DEFAULT '0'::numeric NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 16958)
-- Name: upsell_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upsell_rules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    trigger_product_id uuid NOT NULL,
    upgrade_product_id uuid NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    upsell_type character varying DEFAULT 'upsell'::character varying NOT NULL,
    restaurant_id uuid NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16462)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    restaurant_id uuid,
    "jobTitle" character varying,
    phone character varying,
    "avatarUrl" character varying,
    "deletedAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 16584)
-- Name: waiters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waiters (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    nickname character varying,
    "avatarUrl" character varying,
    "pinCode" character varying(4) NOT NULL,
    password character varying,
    restaurant_id uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    can_transfer_orders boolean DEFAULT false NOT NULL,
    can_close_table boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL
);


--
-- TOC entry 3376 (class 2604 OID 16400)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3718 (class 0 OID 17132)
-- Dependencies: 230
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.analytics_events VALUES ('35794574-bf2f-4ab5-9ea3-b29b4814e937', 'impression', '2026-01-20 17:04:42.504', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('4b91f753-8453-4c5e-a30b-2772fc67e36d', 'impression', '2026-01-20 17:04:47.235', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('1380695d-0ecf-41e9-99ff-b9a06b316288', 'impression', '2026-01-20 17:04:49.643', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('75221443-620c-4e0c-8f65-ef81bc96ccbe', 'impression', '2026-01-20 17:04:53.811', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('c729d3e9-92ee-4081-9149-5df4b82e52ea', 'impression', '2026-01-20 17:04:53.894', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('608e8901-f4a4-4def-b436-29249bd36374', 'impression', '2026-01-20 17:04:57.779', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('1fa27bb5-6998-4df7-a291-90b95cd24c82', 'view', '2026-01-20 17:04:58.598', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', NULL, 'Cabernet Sauvignon', '89.00', NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('39095e06-3d04-4da3-a5e6-eb4ee3b2c1d9', 'click', '2026-01-20 17:04:58.599', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('0f31777a-a0f2-40e0-9129-325439553a89', 'impression', '2026-01-20 17:05:01.677', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('65910f29-1003-4537-bc84-592eb2fe97ce', 'impression', '2026-01-20 17:05:05.627', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.362164');
INSERT INTO public.analytics_events VALUES ('269abf19-d3c4-4956-bfb8-93687af21d29', 'impression', '2026-01-20 17:05:05.71', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('aab988ea-c9eb-4167-b86e-4c1172092d12', 'impression', '2026-01-20 17:05:09.662', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('77e9fea1-5fb3-477b-905b-418f3d1e10d0', 'impression', '2026-01-20 17:05:13.627', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('5d788b3d-a69f-40c3-b73c-679fe9237378', 'impression', '2026-01-20 17:05:17.611', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('fc8e0fe8-80d4-4b1e-a6fe-317fe12fb2d7', 'impression', '2026-01-20 17:05:17.693', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('20daa19e-b713-4ab2-890c-b2a0fc0b922c', 'impression', '2026-01-20 17:05:21.676', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('d1e6dd3f-0889-491b-b5d6-c9dc13ed74b3', 'cart_update', '2026-01-20 17:05:23.157', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 1, 89.00, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('c314ae4c-e15c-4f91-8b7d-bd337a04c4d6', 'impression', '2026-01-20 17:05:25.644', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('750994f9-adb9-493f-9707-e76f26cdb238', 'impression', '2026-01-20 17:05:29.611', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('a3471d6f-a844-44ff-9e12-c9d39f4e87ec', 'impression', '2026-01-20 17:05:29.694', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.860628');
INSERT INTO public.analytics_events VALUES ('6b526cc1-a5ba-4d76-b077-c609796fa5b7', 'item_rejected', '2026-01-20 17:05:33.005', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', NULL, 'Cabernet Sauvignon', NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('d7449b98-8608-43c6-b33d-682569bb9fd0', 'item_rejected', '2026-01-20 17:05:33.005', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', NULL, 'Cabernet Sauvignon', NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('28aea139-e74c-4fa2-97ae-4e974ac182b0', 'impression', '2026-01-20 17:05:33.628', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('daa5841a-651f-4438-9a4e-baf6abe894a7', 'impression', '2026-01-20 17:05:37.611', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('b61b5533-79d4-4389-8fd2-b99237d49b05', 'impression', '2026-01-20 17:05:41.61', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('577286c1-4333-4f7b-a08c-3c5bf2b0d86a', 'impression', '2026-01-20 17:05:41.695', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('e173921b-a9f1-4d46-aa44-9d0d9e214770', 'impression', '2026-01-20 17:05:45.661', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('de24f364-1a1e-4642-81ef-ca165b44d95c', 'impression', '2026-01-20 17:05:49.595', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('68ecef33-d6d8-4ba2-9294-6cfefed03851', 'impression', '2026-01-20 17:05:53.612', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('af40f44e-3880-44c7-809c-a30c114dc1dd', 'impression', '2026-01-20 17:05:53.695', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:17.86596');
INSERT INTO public.analytics_events VALUES ('2a2a7920-5c75-4f38-aecd-e3156a87c2b5', 'impression', '2026-01-20 17:06:29.613', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.034712');
INSERT INTO public.analytics_events VALUES ('f168f072-81b8-4e81-a37b-4f9e93f171ac', 'impression', '2026-01-20 17:06:29.712', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.034712');
INSERT INTO public.analytics_events VALUES ('671dcc92-9c18-4c87-8352-a3adab1f3d4c', 'impression', '2026-01-20 17:05:57.612', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('0d054cc2-0e97-496d-99bd-a79b32a41f9e', 'view', '2026-01-20 17:06:00.797', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', NULL, 'Picanha na Chapa', '145.00', NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('6dc70d85-81ec-4af0-a115-3351b2bd47a0', 'click', '2026-01-20 17:06:00.797', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('b04aae1e-4c89-4b03-987b-9b09fa49e9a7', 'impression', '2026-01-20 17:06:01.595', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('4b6bc350-da12-4f2f-a294-521642f0b037', 'impression', '2026-01-20 17:06:05.612', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('4b679357-f239-422b-bd8e-11d17932f8ea', 'impression', '2026-01-20 17:06:05.696', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('039e3346-0cb4-4178-8c4f-c3404da9bf60', 'cart_update', '2026-01-20 17:06:05.82', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 1, 145.00, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('da01fe6a-4341-44e1-9f81-6072b3641c5b', 'impression', '2026-01-20 17:06:09.913', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('649e9540-b710-452b-9ede-2a812c525d35', 'impression', '2026-01-20 17:06:10.912', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('d4381e6c-be4e-436b-9411-baf50efc3260', 'impression', '2026-01-20 17:06:10.912', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.061669');
INSERT INTO public.analytics_events VALUES ('4c149aed-d832-44ef-b473-f55e0d82aca8', 'impression', '2026-01-20 17:06:11.209', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('0837a987-1c96-40fe-8ac6-b89f3091828d', 'impression', '2026-01-20 17:06:11.209', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('04d32efe-886a-4af4-a3ec-e26aac86a226', 'impression', '2026-01-20 17:06:13.611', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('72cf0d72-8958-40c4-b2ca-c2c57caa1b70', 'click', '2026-01-20 17:06:13.708', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('89037d57-9fa0-4884-bbd8-20fba201799d', 'cart_update', '2026-01-20 17:06:13.88', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 2, 173.00, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('ab480381-2869-4b5d-b78a-345dc488e91c', 'impression', '2026-01-20 17:06:15.599', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('f96965e5-9e28-4ae6-aac8-a7f48c1518d1', 'impression', '2026-01-20 17:06:15.599', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', 'upsell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('a600b26c-a9d1-4374-b6cc-1deaec720462', 'impression', '2026-01-20 17:06:17.974', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('1cb06ff7-3303-465c-a3ac-de44e3c6c7c4', 'impression', '2026-01-20 17:06:21.613', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('30800040-a6ca-4144-89ce-88bb7321664b', 'impression', '2026-01-20 17:06:25.596', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:11:18.09283');
INSERT INTO public.analytics_events VALUES ('7aa7c071-ccce-483a-8eca-a69072c5a7ed', 'impression', '2026-01-20 17:12:30.252', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:13:00.839778');
INSERT INTO public.analytics_events VALUES ('452e1dc1-c4d4-4799-b1c2-4247bb5aabec', 'impression', '2026-01-20 17:12:33.758', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 20:13:00.839778');
INSERT INTO public.analytics_events VALUES ('fa232599-6fcc-4d8b-b169-b076ab3af08f', 'view', '2026-01-20 17:12:37.782', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', NULL, 'IPA Artesanal', 'R$ 28,00', NULL, NULL, '2026-01-20 20:13:00.839778');
INSERT INTO public.analytics_events VALUES ('16ae48f7-fcef-46eb-bf9a-acf4b0ed4921', 'cart_update', '2026-01-20 17:15:34', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 1, 28.00, '2026-01-20 20:16:04.643693');
INSERT INTO public.analytics_events VALUES ('584d7516-ef39-4e41-97aa-8db5ecc8acc8', 'view', '2026-01-20 17:15:36.069', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', NULL, 'Cabernet Sauvignon', 'R$ 89,00', NULL, NULL, '2026-01-20 20:16:04.643693');
INSERT INTO public.analytics_events VALUES ('f0406174-2cf1-44bc-89dc-e98380a03c8e', 'cart_update', '2026-01-20 17:15:38.956', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 2, 117.00, '2026-01-20 20:16:04.643693');
INSERT INTO public.analytics_events VALUES ('4fe11763-821a-4013-b888-2e7082e0c823', 'view', '2026-01-20 17:15:41.037', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', NULL, 'Picanha na Chapa', 'R$ 145,00', NULL, NULL, '2026-01-20 20:16:04.643693');
INSERT INTO public.analytics_events VALUES ('e65951f9-92d0-4ef3-8262-4f90f1865bb0', 'cart_update', '2026-01-20 17:15:42.698', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 3, 262.00, '2026-01-20 20:16:04.643693');
INSERT INTO public.analytics_events VALUES ('378d950f-b778-4cd5-ae6d-973a4fd54312', 'impression', '2026-01-20 17:58:15.306', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-20 21:13:16.027315');
INSERT INTO public.analytics_events VALUES ('92d9cb84-1f18-4cd1-823b-7c8db3048b5c', 'view', '2026-01-20 17:58:18.42', '9f989ee0-55ff-4a16-9774-0776a9128ac9', 'cce5411e-7d77-4884-94fc-784c1afe6232', NULL, 'Suco de Laranja', 'R$ 12,00', NULL, NULL, '2026-01-20 21:13:16.027315');
INSERT INTO public.analytics_events VALUES ('3ac76ea4-cddb-4e72-8b21-e943b9e12c4c', 'cart_update', '2026-01-20 17:58:20.385', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 4, 274.00, '2026-01-20 21:13:16.027315');
INSERT INTO public.analytics_events VALUES ('9eb785ee-9a94-4650-b662-f67276485d80', 'impression', '2026-01-20 21:21:59.989', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('d478805f-ab2c-42f2-bfd3-167591e17985', 'impression', '2026-01-20 21:22:00.846', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('982dc6be-8d32-468f-9972-dbe635565c31', 'impression', '2026-01-20 21:22:05.444', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('b2940317-d727-4ed6-a9cd-b57083a52317', 'impression', '2026-01-20 21:22:05.444', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('f345d5f3-6c3d-4f56-a33c-38332699a3df', 'impression', '2026-01-20 21:22:07.068', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('b277504e-5bd9-4dd0-8a19-6c7b1f8afa91', 'impression', '2026-01-20 21:22:07.068', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('1a2c9628-cab2-43d4-9d22-eb0b6faceb0d', 'impression', '2026-01-20 21:22:10.752', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('1802ef5d-0d41-4bd9-894d-07f1ca203e12', 'impression', '2026-01-20 21:22:10.754', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('a26e6835-26a6-4071-be34-a6595c0b2d34', 'impression', '2026-01-20 21:22:10.847', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('bcada955-c444-41fc-912d-2c0e9826dc80', 'impression', '2026-01-20 21:22:10.847', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:11.44606');
INSERT INTO public.analytics_events VALUES ('398dd952-8297-4918-bb9c-33869729d90b', 'impression', '2026-01-20 21:22:14.787', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:46.72797');
INSERT INTO public.analytics_events VALUES ('94a3ce2e-9da6-45e5-8ba3-ba4b63087009', 'impression', '2026-01-20 21:22:14.787', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:46.72797');
INSERT INTO public.analytics_events VALUES ('f556e628-d939-426a-a724-b507e373f393', 'impression', '2026-01-20 21:22:18.73', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:46.72797');
INSERT INTO public.analytics_events VALUES ('8e2f3da2-1370-4af7-ac99-15950e64136c', 'impression', '2026-01-20 21:22:18.73', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 00:22:46.72797');
INSERT INTO public.analytics_events VALUES ('38601ea8-12b7-47c3-851d-110dc6bb6d1e', 'view', '2026-01-20 21:22:23.7', '9f989ee0-55ff-4a16-9774-0776a9128ac9', '25658dd2-21ac-4346-a151-138b80eaeb01', NULL, 'IPA Artesanal', 'R$ 28,00', NULL, NULL, '2026-01-21 00:22:46.72797');
INSERT INTO public.analytics_events VALUES ('b6b74b58-cf9a-4ea5-ae44-b6c63e10bcd9', 'cart_update', '2026-01-20 21:22:26.382', '9f989ee0-55ff-4a16-9774-0776a9128ac9', NULL, NULL, NULL, NULL, 1, 28.00, '2026-01-21 00:22:46.72797');
INSERT INTO public.analytics_events VALUES ('9bf01cfa-bd04-4ade-b159-59b4f83e73b3', 'impression', '2026-01-21 09:34:19.869', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('0f905d2b-4c0f-4495-973e-24fba2284624', 'impression', '2026-01-21 09:34:19.876', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('b76df8b6-7016-442c-a563-f91be71de978', 'impression', '2026-01-21 09:34:19.893', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('9f430046-b406-4e10-835e-4db2ea2e8fd2', 'impression', '2026-01-21 09:34:21.271', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('93a6af01-1b59-49ed-accb-0176f40e5ce9', 'impression', '2026-01-21 09:34:21.271', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('73d94966-7667-4bad-96a6-04d2750e19e2', 'impression', '2026-01-21 09:34:21.271', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('6304da70-a66b-429c-877b-7608be3c022a', 'view', '2026-01-21 09:34:24.439', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', NULL, 'IPA Artesanal', 'R$ 28,00', NULL, NULL, '2026-01-21 12:34:50.287405');
INSERT INTO public.analytics_events VALUES ('717c47e2-5537-45bd-a3bc-4fd3c33ec897', 'view', '2026-01-21 10:23:26.377', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', NULL, 'Cabernet Sauvignon', '89.00', NULL, NULL, '2026-01-21 13:31:59.688472');
INSERT INTO public.analytics_events VALUES ('41f52e85-6c14-4686-9998-612eb5cbb3a9', 'click', '2026-01-21 10:23:26.378', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:31:59.688472');
INSERT INTO public.analytics_events VALUES ('9330ec64-93f2-4214-8b74-9b463d48242a', 'cart_update', '2026-01-21 10:23:29.026', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', NULL, NULL, NULL, NULL, 1, 89.00, '2026-01-21 13:31:59.688472');
INSERT INTO public.analytics_events VALUES ('05f97913-63fe-4597-9399-f85948eec995', 'impression', '2026-01-21 10:37:03.545', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:37:33.66446');
INSERT INTO public.analytics_events VALUES ('9e6c26bf-06c4-49d8-88fd-69cd6a2155ad', 'impression', '2026-01-21 10:43:05.828', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:43:49.800923');
INSERT INTO public.analytics_events VALUES ('e54400d4-b2a3-43ad-bacb-1acdff668df1', 'impression', '2026-01-21 10:43:05.829', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:43:49.800923');
INSERT INTO public.analytics_events VALUES ('b669c90e-c357-4917-a059-48365b44e7d8', 'impression', '2026-01-21 10:43:07.328', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:43:49.800923');
INSERT INTO public.analytics_events VALUES ('5e64309b-5902-496a-97d7-1e9a9694bebb', 'impression', '2026-01-21 10:44:32.711', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:45:21.404691');
INSERT INTO public.analytics_events VALUES ('4c0fb90c-3230-4cbf-80aa-6ae5f91f478f', 'impression', '2026-01-21 10:44:32.857', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:45:21.404691');
INSERT INTO public.analytics_events VALUES ('314ac373-dd1c-4029-a725-cbf401a2b180', 'impression', '2026-01-21 10:44:34.639', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:45:21.404691');
INSERT INTO public.analytics_events VALUES ('c4bbf0d5-216e-448c-824c-38b34245d1b2', 'impression', '2026-01-21 10:44:34.646', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:45:21.404691');
INSERT INTO public.analytics_events VALUES ('b19a9f73-832b-4574-98e2-2c82026ee293', 'impression', '2026-01-21 10:45:21.64', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 13:47:37.817102');
INSERT INTO public.analytics_events VALUES ('567c770e-22e7-4622-b366-f2a831eedcb1', 'view', '2026-01-21 10:45:24.094', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', NULL, 'Cabernet Sauvignon', 'R$ 89,00', NULL, NULL, '2026-01-21 13:47:37.817102');
INSERT INTO public.analytics_events VALUES ('98a24ed1-cdd4-4c40-9704-5a75889146d3', 'view', '2026-01-21 10:47:43.457', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', 'd098cb96-f5ee-4cb2-bdcc-67f85998b3f3', NULL, 'Talharim Bolonhesa', 'R$ 45,00', NULL, NULL, '2026-01-21 13:48:14.243657');
INSERT INTO public.analytics_events VALUES ('cfb18308-e992-4468-9472-01ca3eef0e1d', 'impression', '2026-01-21 11:12:09.675', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 14:12:40.665985');
INSERT INTO public.analytics_events VALUES ('5ec08abd-1009-48cb-9c25-56f917e8ab51', 'impression', '2026-01-21 11:12:09.676', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 14:12:40.665985');
INSERT INTO public.analytics_events VALUES ('22b69be8-546b-4c5b-b464-5395f8fba05b', 'impression', '2026-01-21 11:14:56.944', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 14:18:48.454598');
INSERT INTO public.analytics_events VALUES ('8ba4d947-41db-4a84-ad02-a652ffc5c418', 'impression', '2026-01-21 11:14:56.967', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '39d3602e-7abf-45ff-b51b-0260a76014d0', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 14:18:48.454598');
INSERT INTO public.analytics_events VALUES ('b791a18b-dde0-4194-be05-0eb1f8a08e18', 'impression', '2026-01-21 11:14:57.772', 'ff21a6df-a3fb-4ae0-afb2-688baa449320', '25658dd2-21ac-4346-a151-138b80eaeb01', 'cross-sell-carousel', NULL, NULL, NULL, NULL, '2026-01-21 14:18:48.454598');


--
-- TOC entry 3706 (class 0 OID 16416)
-- Dependencies: 218
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories VALUES ('0edb5cbe-91d5-4797-bbda-340140f4d997', 'Sucos', 3, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:31.286192', '2026-01-15 13:57:31.286192', '245af453-7134-4861-a190-47dafaa9026e', false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('18a0fd0f-a2db-44f2-8c7c-a2d8feedf831', 'Cervejas', 1, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:30.950997', '2026-01-15 13:57:30.950997', '245af453-7134-4861-a190-47dafaa9026e', false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('853bba88-a688-4b00-929c-391c30e1fce4', 'Sobremesas', 3, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:31.183141', '2026-01-15 13:57:31.183141', NULL, false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('907f675e-5d8a-4e0b-9a05-78d2f5e04bb5', 'Pratos Principais', 2, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:31.126114', '2026-01-15 13:57:31.126114', NULL, false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('c5f45b7b-cc4f-454f-be67-89c34b4ecebe', 'Carnes', 1, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:31.143057', '2026-01-15 13:57:31.143057', '907f675e-5d8a-4e0b-9a05-78d2f5e04bb5', false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('df8f31ab-bbac-4f51-b7e2-aed317bbb890', 'Opções de Adicionais', 5, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-26 14:10:37.17098', '2026-01-26 14:10:37.17098', NULL, true, false, 3, false, true, 'SUM', NULL);
INSERT INTO public.categories VALUES ('ffe7bf98-2bd8-443d-9592-27bc29d1f525', 'Pizzas', 3, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-23 15:12:19.717382', '2026-01-23 15:12:19.717382', NULL, false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('82325dfa-fa52-4da7-94f2-57facd60cb18', 'Pizza Customizáveis', 12, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-29 20:53:17.927053', '2026-01-29 21:07:42.21444', NULL, false, true, 1, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('245af453-7134-4861-a190-47dafaa9026e', 'Bebidas', 1, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:30.893924', '2026-01-30 20:29:30.735463', NULL, false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('2041ff95-dec0-477c-9334-56062d547e49', 'Opções de Massas', 1, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-23 19:41:59.168727', '2026-01-26 14:37:24.663221', NULL, true, false, 1, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('08ed16dd-534a-41a8-b62a-2ec270aadf7e', 'Opções de Bordas', 4, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-26 14:19:16.516771', '2026-01-26 14:19:16.516771', NULL, true, false, 1, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('5f9bbe98-5dec-4e57-a0c9-258fe3ed2325', 'Sabores', 2, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-23 17:16:01.845035', '2026-01-23 17:16:01.845035', NULL, true, false, 3, true, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('80088080-532e-4d00-be26-9b02f8756883', 'Tamanhos', 3, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-23 19:43:00.279151', '2026-01-23 19:43:00.279151', NULL, true, false, 1, true, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('eef391a6-919c-4d30-a6bc-032f29cceaad', 'Vinhos', 2, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:31.107498', '2026-01-15 13:57:31.107498', NULL, false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('f7e3d84c-fec8-42e2-976a-0732776c3fc4', 'Massas', 2, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:57:31.162602', '2026-01-15 13:57:31.162602', NULL, false, true, NULL, false, false, 'SUM', NULL);
INSERT INTO public.categories VALUES ('1db6ffb1-c74c-466c-887f-94b8c67ecda6', 'Pizzas Doces', 11, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-27 16:45:11.90079', '2026-01-27 16:45:11.90079', NULL, false, true, NULL, false, false, 'AVERAGE', NULL);


--
-- TOC entry 3722 (class 0 OID 33608)
-- Dependencies: 234
-- Data for Name: category_groups; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.category_groups VALUES ('2c35a3df-26ff-4487-ac90-db8cb7ec3495', '1db6ffb1-c74c-466c-887f-94b8c67ecda6', '2041ff95-dec0-477c-9334-56062d547e49', 0, NULL, NULL, '2026-01-27 16:45:12.342618', '2026-01-27 16:45:12.342618');
INSERT INTO public.category_groups VALUES ('34efa5f6-e37b-4961-a167-8df447707ea9', '1db6ffb1-c74c-466c-887f-94b8c67ecda6', '80088080-532e-4d00-be26-9b02f8756883', 0, NULL, NULL, '2026-01-27 16:45:12.60626', '2026-01-27 16:45:12.60626');
INSERT INTO public.category_groups VALUES ('689bd910-dec0-4e6c-bcd5-8f6836bafac1', '1db6ffb1-c74c-466c-887f-94b8c67ecda6', 'df8f31ab-bbac-4f51-b7e2-aed317bbb890', 0, NULL, NULL, '2026-01-27 16:45:12.689217', '2026-01-27 16:45:12.689217');
INSERT INTO public.category_groups VALUES ('bee67d00-45c0-4719-b49c-d45613479845', '1db6ffb1-c74c-466c-887f-94b8c67ecda6', '08ed16dd-534a-41a8-b62a-2ec270aadf7e', 0, NULL, NULL, '2026-01-27 16:45:12.74342', '2026-01-27 16:45:12.74342');
INSERT INTO public.category_groups VALUES ('208c99bf-ab6a-4142-b8d4-c1d72207da97', '82325dfa-fa52-4da7-94f2-57facd60cb18', '5f9bbe98-5dec-4e57-a0c9-258fe3ed2325', 0, NULL, NULL, '2026-01-29 20:55:49.992434', '2026-01-29 20:55:49.992434');
INSERT INTO public.category_groups VALUES ('a675564d-48b7-494c-8882-55a6df727b39', '82325dfa-fa52-4da7-94f2-57facd60cb18', 'df8f31ab-bbac-4f51-b7e2-aed317bbb890', 0, NULL, NULL, '2026-01-29 20:55:50.136201', '2026-01-29 20:55:50.136201');
INSERT INTO public.category_groups VALUES ('89e18cc8-99c4-4b49-8987-1875ce9186e8', '82325dfa-fa52-4da7-94f2-57facd60cb18', '2041ff95-dec0-477c-9334-56062d547e49', 0, NULL, NULL, '2026-01-29 20:55:50.164223', '2026-01-29 20:55:50.164223');
INSERT INTO public.category_groups VALUES ('6f04f89b-5828-403e-8dd0-c82533580aa5', '82325dfa-fa52-4da7-94f2-57facd60cb18', '08ed16dd-534a-41a8-b62a-2ec270aadf7e', 0, NULL, NULL, '2026-01-29 20:55:50.166376', '2026-01-29 20:55:50.166376');


--
-- TOC entry 3725 (class 0 OID 33696)
-- Dependencies: 237
-- Data for Name: choice_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.choice_items VALUES ('fcfdb20d-2b64-4623-b65b-b53b28b107e1', 0, 0.00, true, '2026-01-29 15:26:25.913232', '2026-01-29 15:26:25.913232', '6ab854fc-4d77-4a2f-a5dc-6db999fec867', '02189b81-d91e-433d-bb54-db8e43f5d717');
INSERT INTO public.choice_items VALUES ('9e3a1490-3294-4537-88cc-c3a46f38bf3d', 0, 9.00, true, '2026-01-29 15:26:25.913232', '2026-01-29 15:26:25.913232', 'fc1d344f-19a2-4049-a4ef-46082ace2490', '02189b81-d91e-433d-bb54-db8e43f5d717');
INSERT INTO public.choice_items VALUES ('27790d55-afeb-432e-a575-3ecbae0f0027', 0, 0.00, true, '2026-01-29 15:26:25.913232', '2026-01-29 15:26:25.913232', 'aa0cf035-4dd5-4a52-bde8-3f881dcaa25e', '02189b81-d91e-433d-bb54-db8e43f5d717');
INSERT INTO public.choice_items VALUES ('d1bfbbab-14c2-49d4-b2d0-a0bd5c9e6168', 0, 0.00, true, '2026-01-29 15:26:25.913232', '2026-01-29 15:26:25.913232', '80f54261-e9ad-4704-859e-fa8aa3b898cb', '02189b81-d91e-433d-bb54-db8e43f5d717');
INSERT INTO public.choice_items VALUES ('9c1a1aee-2211-4364-92cb-5f9519ef4326', 0, 10.00, true, '2026-01-29 15:26:25.913232', '2026-01-29 15:26:25.913232', '2515d609-1031-4428-a377-2079947faf34', '02189b81-d91e-433d-bb54-db8e43f5d717');
INSERT INTO public.choice_items VALUES ('2e25a2f0-5007-4476-b54d-310780753e0d', 0, 6.00, true, '2026-01-29 15:26:25.913232', '2026-01-29 15:26:25.913232', '514a013c-e75f-4007-984e-c26ee9e3a3fb', '02189b81-d91e-433d-bb54-db8e43f5d717');
INSERT INTO public.choice_items VALUES ('52687bab-6f03-466a-9479-0d4a72039f47', 0, 38.00, true, '2026-01-30 19:16:17.767949', '2026-01-30 19:16:17.767949', 'b69934f9-deb1-495e-bb50-4903ffe28e66', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c');
INSERT INTO public.choice_items VALUES ('a569ebb7-fcbc-46ec-be84-7f6b5deaba24', 0, 35.00, true, '2026-01-30 19:16:17.767949', '2026-01-30 19:16:17.767949', 'd76c9f84-56f4-4fa0-8251-1437de899bc3', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c');
INSERT INTO public.choice_items VALUES ('0721d5d4-c69a-4736-b804-756822f9183e', 0, 7.00, true, '2026-01-30 19:16:17.767949', '2026-01-30 19:16:17.767949', '2515d609-1031-4428-a377-2079947faf34', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c');
INSERT INTO public.choice_items VALUES ('3906842a-6d73-40e1-ba79-7244ac51817c', 0, 0.00, true, '2026-01-30 19:16:17.767949', '2026-01-30 19:16:17.767949', '6ab854fc-4d77-4a2f-a5dc-6db999fec867', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c');
INSERT INTO public.choice_items VALUES ('f4e6aeb4-5372-475b-b8ba-250c97e6cb37', 0, 0.00, true, '2026-01-30 19:16:17.767949', '2026-01-30 19:16:17.767949', 'fc1d344f-19a2-4049-a4ef-46082ace2490', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c');
INSERT INTO public.choice_items VALUES ('f929efa7-cf85-4e6c-bb97-14c299715731', 0, 5.50, true, '2026-01-30 19:16:17.767949', '2026-01-30 19:16:17.767949', '514a013c-e75f-4007-984e-c26ee9e3a3fb', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c');
INSERT INTO public.choice_items VALUES ('9519e05d-1bc4-452f-be47-907caf0d1c8b', 0, 43.00, true, '2026-01-30 19:16:44.41436', '2026-01-30 19:16:44.41436', 'd76c9f84-56f4-4fa0-8251-1437de899bc3', 'e7db8b8d-6f74-470d-af4e-127da0194196');
INSERT INTO public.choice_items VALUES ('ca9eeaf3-4980-4b86-9fe4-41b8aa20e110', 0, 45.00, true, '2026-01-30 19:16:44.41436', '2026-01-30 19:16:44.41436', 'b69934f9-deb1-495e-bb50-4903ffe28e66', 'e7db8b8d-6f74-470d-af4e-127da0194196');
INSERT INTO public.choice_items VALUES ('cd4aacf2-93d4-4208-9e36-518961d9fa60', 0, 8.00, true, '2026-01-30 19:16:44.41436', '2026-01-30 19:16:44.41436', '2515d609-1031-4428-a377-2079947faf34', 'e7db8b8d-6f74-470d-af4e-127da0194196');
INSERT INTO public.choice_items VALUES ('8c357633-d13f-40c9-95e5-4dd237fffe7c', 0, 7.00, true, '2026-01-30 19:16:44.41436', '2026-01-30 19:16:44.41436', 'fc1d344f-19a2-4049-a4ef-46082ace2490', 'e7db8b8d-6f74-470d-af4e-127da0194196');
INSERT INTO public.choice_items VALUES ('531f1ab0-e387-4748-9737-b2ecf961f8aa', 0, 0.00, true, '2026-01-30 19:16:44.41436', '2026-01-30 19:16:44.41436', '6ab854fc-4d77-4a2f-a5dc-6db999fec867', 'e7db8b8d-6f74-470d-af4e-127da0194196');
INSERT INTO public.choice_items VALUES ('337c847a-c9a5-4ff1-b5c1-e4e5d434abf7', 0, 7.00, true, '2026-01-30 19:16:44.41436', '2026-01-30 19:16:44.41436', '514a013c-e75f-4007-984e-c26ee9e3a3fb', 'e7db8b8d-6f74-470d-af4e-127da0194196');


--
-- TOC entry 3715 (class 0 OID 16936)
-- Dependencies: 227
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.customers VALUES ('bdc460a3-1069-4c17-b054-0251abcf3c51', 'Ricardo Pamplona', 'ricardo@pamplona.com', '(11) 98765-4321', NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 13:32:07.696576', '2026-01-13 13:32:07.696576', 'registered');
INSERT INTO public.customers VALUES ('ebdeee2a-3e42-4f29-9608-23da76ba8ed0', 'Maria Eduarda', 'maria.eduarda@email.com', '(11) 91234-5678', NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 13:32:07.704209', '2026-01-13 13:32:07.704209', 'registered');
INSERT INTO public.customers VALUES ('6e813ed7-1ec6-4a43-80fb-6997678841e2', 'Cliente Anônimo 1', NULL, NULL, NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 13:32:07.711082', '2026-01-13 13:32:07.711082', 'registered');
INSERT INTO public.customers VALUES ('09eebeff-a659-4338-adb7-50735df96fc5', 'Maria Eduarda de Albuquerque Cavalcanti Neto', 'maria.cavalcanti@email.com', '(11) 94301-3623', NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2025-08-05 00:00:00', '2025-08-05 00:00:00', 'registered');
INSERT INTO public.customers VALUES ('cc8367e7-7e71-4d2b-8338-983bd7886f0e', 'Cliente Anônimo', NULL, NULL, NULL, 'Mesa 12', '93ee632d-e77a-402f-971c-331149e5343c', '2025-12-20 00:00:00', '2025-12-20 00:00:00', 'registered');
INSERT INTO public.customers VALUES ('432abf77-f8ae-413c-9acd-c1d3972a5da5', 'Bruno Silva', 'bruno.silva@email.com', '(11) 98888-8888', NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 12:08:10.328837', '2026-01-13 12:08:10.328837', 'registered');
INSERT INTO public.customers VALUES ('1b3eff73-c259-48e4-a994-84f1570ae109', 'Carla Santos', 'carla.santos@email.com', '(11) 98888-8888', NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 12:08:10.328837', '2026-01-13 12:08:10.328837', 'registered');
INSERT INTO public.customers VALUES ('dd45f925-8647-4288-8f3c-3f80bdfbd1fb', 'Daniel Oliveira', 'daniel.oliveira@email.com', '(11) 98888-8888', NULL, NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 12:08:10.328837', '2026-01-13 12:08:10.328837', 'registered');


--
-- TOC entry 3717 (class 0 OID 17114)
-- Dependencies: 229
-- Data for Name: daily_metrics; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.daily_metrics VALUES ('f819647a-1361-4331-96df-854f1b84b633', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-20', 10, 1170.00, 117.00, 278.3, '2026-01-20 17:18:01.900573', '2026-01-20 20:58:30.687096');
INSERT INTO public.daily_metrics VALUES ('4d23ebdc-0257-47e9-af2e-aaf6f426890e', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-21', 3, 162.00, 54.00, 155.66666666666666, '2026-01-21 00:22:33.58634', '2026-01-21 14:16:39.444212');
INSERT INTO public.daily_metrics VALUES ('67ffad32-d143-4b56-b26b-6659d483aa46', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-22', 0, 0.00, 0.00, 0, '2026-01-22 13:51:13.995006', '2026-01-22 18:41:13.346307');
INSERT INTO public.daily_metrics VALUES ('9839ba71-7ae3-4315-b74b-e2243dd9e062', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-23', 0, 0.00, 0.00, 0, '2026-01-23 15:11:32.58101', '2026-01-23 18:27:38.901989');
INSERT INTO public.daily_metrics VALUES ('86eae1f2-6a6b-4e3e-ad12-4c0c14f6fb0c', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-26', 0, 0.00, 0.00, 0, '2026-01-26 13:16:27.327173', '2026-01-26 18:56:59.594636');
INSERT INTO public.daily_metrics VALUES ('203c68cd-d364-4e0d-aeaf-3be4d7b768f8', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-27', 0, 0.00, 0.00, 0, '2026-01-27 14:30:40.556258', '2026-01-27 16:27:20.017296');
INSERT INTO public.daily_metrics VALUES ('9aeedd70-63a7-4c2d-aab3-2bf31a64b9e7', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-28', 0, 0.00, 0.00, 0, '2026-01-28 12:14:28.028433', '2026-01-28 23:57:49.849297');
INSERT INTO public.daily_metrics VALUES ('0d4dc099-6626-4abf-9648-0dd5f2128af3', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-29', 2, 27.50, 13.75, 356, '2026-01-29 00:02:32.913876', '2026-01-29 20:44:39.144666');
INSERT INTO public.daily_metrics VALUES ('76941254-bc0e-41b6-8238-eb4de270d1ef', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-30', 0, 0.00, 0.00, 0, '2026-01-29 21:11:42.394745', '2026-01-30 20:28:53.950606');


--
-- TOC entry 3724 (class 0 OID 33657)
-- Dependencies: 236
-- Data for Name: menu_item_option_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menu_item_option_items VALUES ('4d4d800a-251e-4a78-aa59-6dd069bc0a5e', 'f79634b3-bbaa-485f-a0b3-1eb740257b92', '514a013c-e75f-4007-984e-c26ee9e3a3fb', 5.50, true, '2026-01-28 18:45:16.27085', '2026-01-28 18:45:16.27085');


--
-- TOC entry 3720 (class 0 OID 17246)
-- Dependencies: 232
-- Data for Name: menu_item_options; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3705 (class 0 OID 16405)
-- Dependencies: 217
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menu_items VALUES ('cce5411e-7d77-4884-94fc-784c1afe6232', 'Suco de Laranja', 'Natural 300ml', 12.00, NULL, 'menu-items/0bda32ce-eb0e-4153-ac6f-fd2328af3db0.png', true, '0edb5cbe-91d5-4797-bbda-340140f4d997', '2026-01-15 13:57:32.663582', '2026-01-30 20:29:11.147568', NULL, NULL, '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, '', '', '', '', '', '', 0.00, NULL);
INSERT INTO public.menu_items VALUES ('22c96ddd-8df3-475a-93e6-62f8b73fdec7', 'Picanha na Chapa', 'Acompanha fritas e arroz', 145.00, NULL, 'menu-items/cfa35582-4ee8-4c52-865c-5b6a6b15fbd7.png', true, 'c5f45b7b-cc4f-454f-be67-89c34b4ecebe', '2026-01-15 13:57:33.410826', '2026-01-30 14:17:19.341152', NULL, NULL, NULL, '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('2515d609-1031-4428-a377-2079947faf34', 'Adiconal de Parmesão', '', 8.00, NULL, '', true, 'df8f31ab-bbac-4f51-b7e2-aed317bbb890', '2026-01-28 12:37:07.046825', '2026-01-28 12:37:07.046825', '91001', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', '{"sort_order":[],"option_groups":[]}', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('d098cb96-f5ee-4cb2-bdcc-67f85998b3f3', 'Talharim Bolonhesa', 'Molho artesanal de tomate', 45.00, NULL, 'menu-items/7c0e225c-3e36-4b2e-97e7-18f5a7300454.png', true, 'f7e3d84c-fec8-42e2-976a-0732776c3fc4', '2026-01-15 13:57:34.007238', '2026-01-30 14:17:19.611607', NULL, NULL, NULL, '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('514a013c-e75f-4007-984e-c26ee9e3a3fb', 'Borda de Catupiry', '', 5.50, NULL, '', true, '08ed16dd-534a-41a8-b62a-2ec270aadf7e', '2026-01-28 12:42:00.828555', '2026-01-28 12:42:00.828555', '81002', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', '{"sort_order":[],"option_groups":[]}', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('6ab854fc-4d77-4a2f-a5dc-6db999fec867', 'Tradicional', NULL, 0.00, NULL, NULL, true, '2041ff95-dec0-477c-9334-56062d547e49', '2026-01-26 19:53:30.83634', '2026-01-26 19:53:30.83634', NULL, NULL, NULL, '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('fc1d344f-19a2-4049-a4ef-46082ace2490', 'Massa Fina', NULL, 7.00, NULL, NULL, true, '2041ff95-dec0-477c-9334-56062d547e49', '2026-01-26 19:58:37.687113', '2026-01-26 19:58:37.687113', NULL, NULL, NULL, '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('aa0cf035-4dd5-4a52-bde8-3f881dcaa25e', 'Pequena', 'Tamanho da Pizza - Pequena', 0.00, NULL, '', true, '80088080-532e-4d00-be26-9b02f8756883', '2026-01-26 20:42:45.441901', '2026-01-26 20:42:45.441901', '01001', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('80f54261-e9ad-4704-859e-fa8aa3b898cb', 'Média', 'Tamanho da Pizza - Médio', 0.00, NULL, '', true, '80088080-532e-4d00-be26-9b02f8756883', '2026-01-26 20:43:36.161207', '2026-01-26 20:43:36.161207', '01002', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('b69934f9-deb1-495e-bb50-4903ffe28e66', 'Frango', '', 0.00, NULL, '', true, '5f9bbe98-5dec-4e57-a0c9-258fe3ed2325', '2026-01-26 21:26:15.591908', '2026-01-26 21:26:15.591908', '02001', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('9e8e7d6b-064b-47fe-9c15-a6b7d617b341', 'Pizza de Chocolate', '', 0.00, NULL, '', true, '1db6ffb1-c74c-466c-887f-94b8c67ecda6', '2026-01-27 18:10:14.124816', '2026-01-27 18:10:14.124816', '1205', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', 'Petit Gâteau', 'Com sorvete de baunilha', 25.00, NULL, 'menu-items/9880d4fe-b774-4c25-944e-3ee8403b450a.png', true, '853bba88-a688-4b00-929c-391c30e1fce4', '2026-01-15 13:57:34.455435', '2026-01-30 14:17:19.859341', NULL, NULL, NULL, '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('39d3602e-7abf-45ff-b51b-0260a76014d0', 'Cabernet Sauvignon', 'Vinho tinto chileno garrafa', 89.00, NULL, 'menu-items/509e22d3-a317-49d0-8dfc-1438cef06814.png', true, 'eef391a6-919c-4d30-a6bc-032f29cceaad', '2026-01-15 13:57:32.037101', '2026-01-30 14:17:20.068796', NULL, NULL, NULL, '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PIZZA', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('25658dd2-21ac-4346-a151-138b80eaeb01', 'IPA Artesanal', 'Cerveja artesanal encorpada 600ml', 28.00, NULL, 'menu-items/1d79d8d4-e988-474b-b164-7b083bfc562e.png', true, '18a0fd0f-a2db-44f2-8c7c-a2d8feedf831', '2026-01-15 13:57:31.3181', '2026-01-30 17:56:53.537971', NULL, NULL, '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', NULL, 1, '', '', '', '', '', '', 0.00, NULL);
INSERT INTO public.menu_items VALUES ('655e04d7-d7d1-4d50-9db8-ba0e1afe647c', 'Monte sua Pizza Peq', '', 0.00, NULL, 'menu-items/19a27412-6a63-4b08-ba72-d19b00cf073b.jpg', true, '82325dfa-fa52-4da7-94f2-57facd60cb18', '2026-01-29 20:59:31.194601', '2026-01-30 19:16:17.767949', '50001', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', '{"sort_order":["208c99bf-ab6a-4142-b8d4-c1d72207da97","a675564d-48b7-494c-8882-55a6df727b39","89e18cc8-99c4-4b49-8987-1875ce9186e8","6f04f89b-5828-403e-8dd0-c82533580aa5"],"option_groups":[{"id":"208c99bf-ab6a-4142-b8d4-c1d72207da97","min_selected":0,"max_selected":1,"options":[{"id":"b69934f9-deb1-495e-bb50-4903ffe28e66","extra_price":38},{"id":"d76c9f84-56f4-4fa0-8251-1437de899bc3","extra_price":35}]},{"id":"a675564d-48b7-494c-8882-55a6df727b39","min_selected":0,"max_selected":1,"options":[{"id":"2515d609-1031-4428-a377-2079947faf34","extra_price":7}]},{"id":"89e18cc8-99c4-4b49-8987-1875ce9186e8","min_selected":0,"max_selected":1,"options":[{"id":"6ab854fc-4d77-4a2f-a5dc-6db999fec867","extra_price":0},{"id":"fc1d344f-19a2-4049-a4ef-46082ace2490","extra_price":0}]},{"id":"6f04f89b-5828-403e-8dd0-c82533580aa5","min_selected":0,"max_selected":1,"options":[{"id":"514a013c-e75f-4007-984e-c26ee9e3a3fb","extra_price":5.5}]}]}', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('02189b81-d91e-433d-bb54-db8e43f5d717', 'Pizza de Cartola', '', 0.00, NULL, '', true, '1db6ffb1-c74c-466c-887f-94b8c67ecda6', '2026-01-27 17:08:05.489777', '2026-01-29 15:26:25.913232', '1202', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', '{"sort_order":["2c35a3df-26ff-4487-ac90-db8cb7ec3495","34efa5f6-e37b-4961-a167-8df447707ea9","689bd910-dec0-4e6c-bcd5-8f6836bafac1","bee67d00-45c0-4719-b49c-d45613479845"],"option_groups":[{"id":"2c35a3df-26ff-4487-ac90-db8cb7ec3495","min_selected":0,"max_selected":1,"options":[{"id":"6ab854fc-4d77-4a2f-a5dc-6db999fec867","extra_price":0},{"id":"fc1d344f-19a2-4049-a4ef-46082ace2490","extra_price":9}]},{"id":"34efa5f6-e37b-4961-a167-8df447707ea9","min_selected":0,"max_selected":1,"options":[{"id":"aa0cf035-4dd5-4a52-bde8-3f881dcaa25e","extra_price":0},{"id":"80f54261-e9ad-4704-859e-fa8aa3b898cb","extra_price":0}]},{"id":"689bd910-dec0-4e6c-bcd5-8f6836bafac1","min_selected":0,"max_selected":1,"options":[{"id":"2515d609-1031-4428-a377-2079947faf34","extra_price":10}]},{"id":"bee67d00-45c0-4719-b49c-d45613479845","min_selected":0,"max_selected":1,"options":[{"id":"514a013c-e75f-4007-984e-c26ee9e3a3fb","extra_price":6}]}]}', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('d76c9f84-56f4-4fa0-8251-1437de899bc3', 'Quatro Queijos', '', 0.00, NULL, '', true, '5f9bbe98-5dec-4e57-a0c9-258fe3ed2325', '2026-01-29 21:01:28.79396', '2026-01-29 21:01:28.79396', '51001', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', '{"sort_order":[],"option_groups":[]}', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.menu_items VALUES ('e7db8b8d-6f74-470d-af4e-127da0194196', 'Monte sua Pizza Méd.', '', 0.00, NULL, 'menu-items/a590f188-5a0f-4a82-90d6-1010ee983599.jpg', true, '82325dfa-fa52-4da7-94f2-57facd60cb18', '2026-01-29 21:03:43.384365', '2026-01-30 19:16:44.41436', '50002', '', '', '64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'PRODUCT', '{"sort_order":["208c99bf-ab6a-4142-b8d4-c1d72207da97","a675564d-48b7-494c-8882-55a6df727b39","89e18cc8-99c4-4b49-8987-1875ce9186e8","6f04f89b-5828-403e-8dd0-c82533580aa5"],"option_groups":[{"id":"208c99bf-ab6a-4142-b8d4-c1d72207da97","min_selected":0,"max_selected":1,"options":[{"id":"d76c9f84-56f4-4fa0-8251-1437de899bc3","extra_price":43},{"id":"b69934f9-deb1-495e-bb50-4903ffe28e66","extra_price":45}]},{"id":"a675564d-48b7-494c-8882-55a6df727b39","min_selected":0,"max_selected":1,"options":[{"id":"2515d609-1031-4428-a377-2079947faf34","extra_price":8}]},{"id":"89e18cc8-99c4-4b49-8987-1875ce9186e8","min_selected":0,"max_selected":1,"options":[{"id":"fc1d344f-19a2-4049-a4ef-46082ace2490","extra_price":7},{"id":"6ab854fc-4d77-4a2f-a5dc-6db999fec867","extra_price":0}]},{"id":"6f04f89b-5828-403e-8dd0-c82533580aa5","min_selected":0,"max_selected":1,"options":[{"id":"514a013c-e75f-4007-984e-c26ee9e3a3fb","extra_price":7}]}]}', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- TOC entry 3723 (class 0 OID 33628)
-- Dependencies: 235
-- Data for Name: menu_items_options; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menu_items_options VALUES ('f79634b3-bbaa-485f-a0b3-1eb740257b92', '02189b81-d91e-433d-bb54-db8e43f5d717', 'bee67d00-45c0-4719-b49c-d45613479845', true, '2026-01-28 18:45:16.27085', '2026-01-28 18:45:16.27085');


--
-- TOC entry 3708 (class 0 OID 16441)
-- Dependencies: 220
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.menus VALUES ('64b7d0a8-6f86-448a-a3eb-821e09afbf4d', 'Menu Principal', NULL, true, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:01:33.343774', '2026-01-15 13:01:33.343774', 'PRODUCT');


--
-- TOC entry 3704 (class 0 OID 16397)
-- Dependencies: 216
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.migrations VALUES (1, 1767891111571, 'InitialMigration1767891111571');
INSERT INTO public.migrations VALUES (2, 1767891178412, 'CreateOrders1767891178412');
INSERT INTO public.migrations VALUES (14, 1767963457876, 'AddUserFields1767963457876');
INSERT INTO public.migrations VALUES (15, 1767964100000, 'AddParentIdToCategories1767964100000');
INSERT INTO public.migrations VALUES (16, 1767964500000, 'AddCodeAndIngredientsToMenuItems1767964500000');
INSERT INTO public.migrations VALUES (17, 1767965300000, 'ChangeImageUrlToTextInMenuItems1767965300000');
INSERT INTO public.migrations VALUES (18, 1736681000000, 'AddBusinessFieldsToRestaurants1736681000000');
INSERT INTO public.migrations VALUES (19, 1736686000000, 'CreateWaitersAndAddWaiterToOrders1736686000000');
INSERT INTO public.migrations VALUES (20, 1768229630685, 'FixWaiterAndPasswordNullable1768229630685');
INSERT INTO public.migrations VALUES (26, 1768235643645, 'CreateTableAndLinkToOrders1768235643645');
INSERT INTO public.migrations VALUES (27, 1768235643646, 'UpdateTableStatusesAndAddPriority1768235643646');
INSERT INTO public.migrations VALUES (28, 1768235643647, 'CreateCustomersAndLinkToOrders1768235643647');
INSERT INTO public.migrations VALUES (29, 1768235643648, 'SeedCustomers1768235643648');
INSERT INTO public.migrations VALUES (30, 1768235643700, 'CreateUpsellRules1768235643700');
INSERT INTO public.migrations VALUES (31, 1768235643750, 'SeedUpsellRules1768235643750');
INSERT INTO public.migrations VALUES (32, 1768236000000, 'AddUpsellTypeToUpsellRules1768236000000');
INSERT INTO public.migrations VALUES (33, 1768240000000, 'LinkMenuItemsToMenu1768240000000');
INSERT INTO public.migrations VALUES (35, 1768241000000, 'EnforceNonNullMenuId1768241000000');
INSERT INTO public.migrations VALUES (36, 1768494558778, 'StandardizeCamelCase1768494558778');
INSERT INTO public.migrations VALUES (37, 1768494558779, 'StandardizeSnakeCase1768494558779');
INSERT INTO public.migrations VALUES (38, 1768494558780, 'AddTransactionIdToOrders1768494558780');
INSERT INTO public.migrations VALUES (39, 1737295000000, 'AddHeaderUrlToRestaurants1737295000000');
INSERT INTO public.migrations VALUES (40, 1737300000000, 'AddTemporaryCustomerIdToOrders1737300000000');
INSERT INTO public.migrations VALUES (41, 1737380000000, 'AddDecisionTimeColumns1737380000000');
INSERT INTO public.migrations VALUES (42, 1737399000000, 'AddSuggestionFieldsToOrderItems1737399000000');
INSERT INTO public.migrations VALUES (43, 1737400000000, 'CreateDailyMetrics1737400000000');
INSERT INTO public.migrations VALUES (44, 1768935437502, 'CreateAnalyticsEvents1768935437502');
INSERT INTO public.migrations VALUES (45, 1769087294912, 'AddCanTransferOrdersToWaiters1769087294912');
INSERT INTO public.migrations VALUES (46, 1769087473180, 'RenameCanTransferOrdersColumn1769087473180');
INSERT INTO public.migrations VALUES (47, 1769090671600, 'AddCanCloseTableToWaiters1769090671600');
INSERT INTO public.migrations VALUES (48, 1769112386003, 'AddTotalToTables1769112386003');
INSERT INTO public.migrations VALUES (49, 1769194040075, 'AddMenuTypeToMenuItems1769194040075');
INSERT INTO public.migrations VALUES (50, 1769198893440, 'AddCompositionFieldsToCategories1769198893440');
INSERT INTO public.migrations VALUES (51, 1769199162603, 'CreateCompositionEntities1769199162603');
INSERT INTO public.migrations VALUES (52, 1769435770677, 'UpdateMenuItemAndCategories1769435770677');
INSERT INTO public.migrations VALUES (53, 1769436188288, 'AddGroupKeyToComposition1769436188288');
INSERT INTO public.migrations VALUES (54, 1769439077228, 'AddIsCompositionIsVisibleToCategory1769439077228');
INSERT INTO public.migrations VALUES (55, 1769440000000, 'AddTypeToMenus1769440000000');
INSERT INTO public.migrations VALUES (56, 1769440100000, 'CreateSystemParameters1769440100000');
INSERT INTO public.migrations VALUES (57, 1769440200000, 'CreateCategoryGroups1769440200000');
INSERT INTO public.migrations VALUES (58, 1769440300000, 'AddMaxChoicesToMenuItems1769440300000');
INSERT INTO public.migrations VALUES (59, 1769440500000, 'CreateMenuItemOptions1769440500000');
INSERT INTO public.migrations VALUES (60, 1769440600000, 'MakeMenuItemIdNullable1769440600000');
INSERT INTO public.migrations VALUES (61, 1769440700000, 'MigrateOptionsConfig1769440700000');
INSERT INTO public.migrations VALUES (62, 1769625695176, 'RefactorMenuItemOptions1769625695176');
INSERT INTO public.migrations VALUES (63, 1769631947505, 'ImplementChoiceItems1769631947505');
INSERT INTO public.migrations VALUES (64, 1769709440592, 'AddIsOptionalAndPriceRuleToCategory1769709440592');
INSERT INTO public.migrations VALUES (65, 1769715993383, 'AddFieldsToOrderItemComposition1769715993383');
INSERT INTO public.migrations VALUES (66, 1769737203534, 'AddWineFieldsToMenuItem1769737203534');
INSERT INTO public.migrations VALUES (69, 1769440800000, 'AddLogicalDeleteAndStatus1769440800000');
INSERT INTO public.migrations VALUES (70, 1769804521809, 'AddDeletedAtColumns1769804521809');


--
-- TOC entry 3719 (class 0 OID 17238)
-- Dependencies: 231
-- Data for Name: order_item_compositions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_item_compositions VALUES ('f44dcdd5-4a67-4abe-9c32-640cb6bdff24', '0baeec59-a652-41b9-9a13-84d8de47dd9d', 'fc1d344f-19a2-4049-a4ef-46082ace2490', 1, 16.00, 'Opções de Massas', 'Massa Fina', 'SUM', 9.00);
INSERT INTO public.order_item_compositions VALUES ('0c8a80bd-619c-4276-ab1f-4f9caaf03a13', '0baeec59-a652-41b9-9a13-84d8de47dd9d', 'aa0cf035-4dd5-4a52-bde8-3f881dcaa25e', 1, 0.00, 'Tamanhos', 'Pequena', 'SUM', 0.00);
INSERT INTO public.order_item_compositions VALUES ('8b8b3296-b363-4f12-bfbd-ba3ef4a519d4', '0baeec59-a652-41b9-9a13-84d8de47dd9d', '514a013c-e75f-4007-984e-c26ee9e3a3fb', 1, 11.50, 'Opções de Bordas', 'Borda de Catupiry', 'SUM', 6.00);
INSERT INTO public.order_item_compositions VALUES ('848bf78e-cc29-4d67-be01-35966f0a5ff9', '01f9fdde-934b-4bb3-8495-6476be92eb3e', '6ab854fc-4d77-4a2f-a5dc-6db999fec867', 1, 0.00, 'Opções de Massas', 'Tradicional', 'SUM', 0.00);
INSERT INTO public.order_item_compositions VALUES ('665a1754-a3ba-4960-b5f9-8efe0284242f', '01f9fdde-934b-4bb3-8495-6476be92eb3e', 'b69934f9-deb1-495e-bb50-4903ffe28e66', 1, 38.00, 'Sabores', 'Frango', 'SUM', 38.00);
INSERT INTO public.order_item_compositions VALUES ('44ac407f-7d6b-4d29-a1f3-b0c607bccd63', '01f9fdde-934b-4bb3-8495-6476be92eb3e', '514a013c-e75f-4007-984e-c26ee9e3a3fb', 1, 11.00, 'Opções de Bordas', 'Borda de Catupiry', 'SUM', 5.50);


--
-- TOC entry 3712 (class 0 OID 16518)
-- Dependencies: 224
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_items VALUES ('0240826e-0830-433d-ae09-5cb7c4e1292e', 1, 28.00, '', '6f18aca0-7401-45ee-b1ff-eb64163d9428', '25658dd2-21ac-4346-a151-138b80eaeb01', 175, false, NULL);
INSERT INTO public.order_items VALUES ('0243c765-af45-44f1-9ffc-716306a4f08b', 1, 89.00, '', '6f18aca0-7401-45ee-b1ff-eb64163d9428', '39d3602e-7abf-45ff-b51b-0260a76014d0', 2, false, NULL);
INSERT INTO public.order_items VALUES ('c1625e1e-565d-48b6-836e-0a4854fc3e1e', 1, 145.00, '', '6f18aca0-7401-45ee-b1ff-eb64163d9428', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 1, false, NULL);
INSERT INTO public.order_items VALUES ('81b267af-8471-4688-9839-ef7e8347db24', 1, 12.00, '', '6f18aca0-7401-45ee-b1ff-eb64163d9428', 'cce5411e-7d77-4884-94fc-784c1afe6232', 1, false, NULL);
INSERT INTO public.order_items VALUES ('eb6f9fb4-fa7e-407e-864e-02ca37aa3d0c', 1, 28.00, '', 'edf5c3e1-ea96-40fa-b52d-8c9c34daebe0', '25658dd2-21ac-4346-a151-138b80eaeb01', 2, false, NULL);
INSERT INTO public.order_items VALUES ('1900db14-f5fa-4c7a-8132-e74019bef192', 1, 28.00, '', 'fb138993-34ef-4ecc-aaa1-4a235845abc7', '25658dd2-21ac-4346-a151-138b80eaeb01', 11, false, NULL);
INSERT INTO public.order_items VALUES ('edbf44ae-dc0a-46c5-8c8e-1347bf30735d', 1, 89.00, '', 'e880401a-6584-4be6-9e01-7d16dc127a81', '39d3602e-7abf-45ff-b51b-0260a76014d0', 4, false, NULL);
INSERT INTO public.order_items VALUES ('759f43f3-0812-436a-9220-2738b91ed15c', 1, 28.00, '', 'b68a5e26-f144-4d90-b559-eacecef894e5', '25658dd2-21ac-4346-a151-138b80eaeb01', 3, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('e2bd89db-f5d9-4027-bf6f-2ad2a9f90795', 1, 145.00, '', 'dfefdd22-3445-4a3b-b778-8fa54f5657e2', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 1, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('14fe0162-7473-44a9-880f-6e29205d3f51', 1, 25.00, '', 'dfefdd22-3445-4a3b-b778-8fa54f5657e2', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', NULL, true, 'upsell');
INSERT INTO public.order_items VALUES ('205aa67b-5ea0-414c-a32c-dad55314ebc8', 1, 28.00, '', '1afd5433-fa40-4d63-8c8e-6137ed935e77', '25658dd2-21ac-4346-a151-138b80eaeb01', 1, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('b55c23f9-18b0-4b8a-86c2-87ee62472e36', 1, 145.00, '', '1afd5433-fa40-4d63-8c8e-6137ed935e77', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 1, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('80ff17b2-919a-4cea-b0e3-2367407f3f00', 1, 25.00, '', '1afd5433-fa40-4d63-8c8e-6137ed935e77', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', NULL, true, 'upsell');
INSERT INTO public.order_items VALUES ('d71e2ca6-c35d-4dab-afe4-380ebfe1043e', 1, 145.00, '', '9abd0e52-67c0-43dd-8a91-a0a56d87ed07', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 2, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('b42d1547-275a-4ecc-9b64-58aadd4d89e3', 1, 25.00, '', '9abd0e52-67c0-43dd-8a91-a0a56d87ed07', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', 6, true, 'upsell');
INSERT INTO public.order_items VALUES ('dc1c4180-9d51-4d88-a018-9bda8394185f', 1, 145.00, 'Ao ponto', '5af85d69-70d7-4963-8922-836da6096257', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 4, false, NULL);
INSERT INTO public.order_items VALUES ('8e15ae66-9e7d-4e34-a1fc-04773b49b42b', 2, 12.00, 'Sem açúcar', '5af85d69-70d7-4963-8922-836da6096257', 'cce5411e-7d77-4884-94fc-784c1afe6232', 3, false, NULL);
INSERT INTO public.order_items VALUES ('e2294aa9-f62c-45e5-8127-e8977e4f3dbd', 1, 12.00, '', 'df940a6f-317e-4bbc-818d-5654bcea7b8a', 'cce5411e-7d77-4884-94fc-784c1afe6232', 5, false, NULL);
INSERT INTO public.order_items VALUES ('68794b44-4585-4390-90a0-cc3815e7943d', 2, 28.00, '', 'fd717db9-b63a-4d10-b8b0-54e8b60ffc1f', '25658dd2-21ac-4346-a151-138b80eaeb01', 2, false, NULL);
INSERT INTO public.order_items VALUES ('04dba481-2ef9-48a0-845f-98517d3581b6', 3, 45.00, '', '246598c9-b093-4cec-a6b6-c592de575c92', 'd098cb96-f5ee-4cb2-bdcc-67f85998b3f3', 1, false, NULL);
INSERT INTO public.order_items VALUES ('441280f0-56f4-4be2-b7ba-d42337cb46a8', 1, 89.00, '', '246598c9-b093-4cec-a6b6-c592de575c92', '39d3602e-7abf-45ff-b51b-0260a76014d0', 2, false, NULL);
INSERT INTO public.order_items VALUES ('b7704611-bc83-4121-984c-59b04b09cc54', 1, 145.00, '', 'ae3e4f17-a179-4df2-a7e2-e07fd5a44734', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 3, false, NULL);
INSERT INTO public.order_items VALUES ('4b9461a3-b924-43ae-b76e-cf7af97e2619', 1, 28.00, '', 'c52f98cd-869c-4990-abdc-5dfe02e7e10a', '25658dd2-21ac-4346-a151-138b80eaeb01', 5, false, NULL);
INSERT INTO public.order_items VALUES ('2526bb28-0d24-41da-9305-c2be426213c3', 1, 28.00, '', '04920f14-3695-44bc-be43-3d5e57ae17c0', '25658dd2-21ac-4346-a151-138b80eaeb01', 4, false, NULL);
INSERT INTO public.order_items VALUES ('c137b90d-8b0a-4371-aa44-ca4daa14c688', 1, 145.00, '', '39ebd0c5-fbf5-4fd2-b751-6d73bade63aa', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 3, false, NULL);
INSERT INTO public.order_items VALUES ('97e642c3-2c89-4b2d-bfbe-a22123367192', 1, 28.00, '', '39ebd0c5-fbf5-4fd2-b751-6d73bade63aa', '25658dd2-21ac-4346-a151-138b80eaeb01', 3, false, NULL);
INSERT INTO public.order_items VALUES ('04b5867a-1681-4a6a-82b4-7ae07b4f765b', 1, 145.00, '', '1f8b96ad-3427-44fb-900f-8a89f035cf8e', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 2, false, NULL);
INSERT INTO public.order_items VALUES ('8ecd7f21-6503-48ec-a207-10c4fe0c8ca3', 1, 28.00, '', 'c5369d56-378d-41a9-b48d-cc602c209571', '25658dd2-21ac-4346-a151-138b80eaeb01', 7, false, NULL);
INSERT INTO public.order_items VALUES ('53530651-cb51-4163-be63-aa23c3d35c4a', 1, 28.00, '', 'ba8af4a1-34c6-4949-87a1-4a5340bd9df5', '25658dd2-21ac-4346-a151-138b80eaeb01', 7, false, NULL);
INSERT INTO public.order_items VALUES ('65489d9e-4072-4621-bd4d-ab428ebdd5b5', 1, 28.00, '', '70debfaa-ee1e-4c6f-8df1-2b290f525c4b', '25658dd2-21ac-4346-a151-138b80eaeb01', 9, false, NULL);
INSERT INTO public.order_items VALUES ('99c6d93f-6b95-45ff-8bdd-5a17e95ef97b', 2, 28.00, '', '06690687-4ab3-4b9e-a467-dae126ce6ca0', '25658dd2-21ac-4346-a151-138b80eaeb01', 11, false, NULL);
INSERT INTO public.order_items VALUES ('9c575f76-5325-46fe-9f2e-589eaaefd336', 1, 28.00, '', 'fa0631f4-80f9-4aba-bfee-f307a4dfb5ef', '25658dd2-21ac-4346-a151-138b80eaeb01', 2, false, NULL);
INSERT INTO public.order_items VALUES ('3f871482-7f7f-410c-902b-808982dffbfa', 1, 89.00, '', '607f4c4d-4e38-4570-8a91-b0581ee34889', '39d3602e-7abf-45ff-b51b-0260a76014d0', 3, false, NULL);
INSERT INTO public.order_items VALUES ('61068a61-c44c-44e4-a93f-aecdfa9e2e4f', 1, 28.00, '', '660c096c-9ba7-45f5-8b4b-2c34a09b8163', '25658dd2-21ac-4346-a151-138b80eaeb01', 5, false, NULL);
INSERT INTO public.order_items VALUES ('1c652ce8-ed2c-4721-8d24-d23fe3ef836e', 1, 89.00, '', 'd31df432-1a8a-4d15-a161-3dd90661b5cc', '39d3602e-7abf-45ff-b51b-0260a76014d0', 7, false, NULL);
INSERT INTO public.order_items VALUES ('27794eda-1ee8-4388-8b92-0a67b0c85d48', 1, 45.00, '', 'd31df432-1a8a-4d15-a161-3dd90661b5cc', 'd098cb96-f5ee-4cb2-bdcc-67f85998b3f3', 9, false, NULL);
INSERT INTO public.order_items VALUES ('3a325a5c-13dd-4920-a3dd-de396d50bb68', 1, 28.00, '', 'd31df432-1a8a-4d15-a161-3dd90661b5cc', '25658dd2-21ac-4346-a151-138b80eaeb01', 9, false, NULL);
INSERT INTO public.order_items VALUES ('47ed6896-c308-4d04-9639-8979c89d10b3', 1, 89.00, '', '8139c23d-64ac-4c62-8b40-14c79e2c5565', '39d3602e-7abf-45ff-b51b-0260a76014d0', 10, false, NULL);
INSERT INTO public.order_items VALUES ('139d2d8a-3416-4983-a109-cad8176475c3', 1, 145.00, '', '8139c23d-64ac-4c62-8b40-14c79e2c5565', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 2, false, NULL);
INSERT INTO public.order_items VALUES ('bb9e16a4-20b1-4497-8714-097f8a2e7812', 1, 28.00, '', '8139c23d-64ac-4c62-8b40-14c79e2c5565', '25658dd2-21ac-4346-a151-138b80eaeb01', 2, false, NULL);
INSERT INTO public.order_items VALUES ('7cfa4259-dca1-4439-89e7-b8d72d6971cb', 1, 145.00, '', 'b6c90081-a10b-43ac-8222-bd807ab064d8', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 4, false, NULL);
INSERT INTO public.order_items VALUES ('8c223676-d7e2-48c2-b97f-3202c974f88d', 1, 28.00, '', 'b6c90081-a10b-43ac-8222-bd807ab064d8', '25658dd2-21ac-4346-a151-138b80eaeb01', 5, false, NULL);
INSERT INTO public.order_items VALUES ('93f7f0ac-edef-4c49-84bc-a6c3e816d691', 1, 89.00, '', 'b6c90081-a10b-43ac-8222-bd807ab064d8', '39d3602e-7abf-45ff-b51b-0260a76014d0', 6, false, NULL);
INSERT INTO public.order_items VALUES ('83697f69-56ec-4a6f-a0e8-8aef5365c89f', 1, 12.00, '', '7f6f9fea-1309-407f-98a8-d374b29034a9', 'cce5411e-7d77-4884-94fc-784c1afe6232', 7, false, NULL);
INSERT INTO public.order_items VALUES ('1a6df76c-85a7-49ba-b3b3-4d2e917c7c64', 1, 145.00, '', '822c7c0b-f9d9-44b2-9501-b1be393ad32e', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', 4, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('0e0eb5a8-b513-4bbd-88f4-af844dd8489c', 1, 28.00, '', '822c7c0b-f9d9-44b2-9501-b1be393ad32e', '25658dd2-21ac-4346-a151-138b80eaeb01', 5, true, 'upsell');
INSERT INTO public.order_items VALUES ('a68b9e9e-1fcb-46d6-97aa-712af3265c00', 1, 28.00, '', '8c73d7f1-9be9-4e1b-9046-e4719ef8c3ef', '25658dd2-21ac-4346-a151-138b80eaeb01', 2, false, NULL);
INSERT INTO public.order_items VALUES ('35ae0288-88c0-4f77-8bfa-17c4038cd97c', 1, 89.00, '', '2391c58c-818e-4b13-a473-96cd4fe16802', '39d3602e-7abf-45ff-b51b-0260a76014d0', 2, true, 'cross-sell');
INSERT INTO public.order_items VALUES ('aa377674-5c00-491f-b5d0-b7a98b125f20', 1, 45.00, '', '4cb430e9-9803-46ae-afd2-d2170e5f0f35', 'd098cb96-f5ee-4cb2-bdcc-67f85998b3f3', 78, false, NULL);
INSERT INTO public.order_items VALUES ('20c4979f-98ae-4096-8f5b-0b06a43f259a', 1, 0.00, 'Opções de Massas: Massa Fina
Tamanhos: Pequena
Opções de Bordas: Borda de Catupiry
Opções de Adicionais: Adiconal de Parmesão', '36e333dc-3c9e-4023-8c1c-ac2d3c0a6360', '02189b81-d91e-433d-bb54-db8e43f5d717', NULL, false, NULL);
INSERT INTO public.order_items VALUES ('01a3c774-e039-4835-b5cb-82a3f1d77a61', 1, 0.00, 'Opções de Massas: Massa Fina
Tamanhos: Média
Opções de Bordas: Borda de Catupiry', '36e333dc-3c9e-4023-8c1c-ac2d3c0a6360', '02189b81-d91e-433d-bb54-db8e43f5d717', NULL, false, NULL);
INSERT INTO public.order_items VALUES ('0baeec59-a652-41b9-9a13-84d8de47dd9d', 1, 27.50, 'Opções de Massas: Massa Fina
Tamanhos: Pequena
Opções de Bordas: Borda de Catupiry', '2e111f16-273b-4fdc-9e2c-f7fe45a21112', '02189b81-d91e-433d-bb54-db8e43f5d717', NULL, false, NULL);
INSERT INTO public.order_items VALUES ('01f9fdde-934b-4bb3-8495-6476be92eb3e', 1, 49.00, 'Opções de Massas: Tradicional
Sabores: Frango
Opções de Bordas: Borda de Catupiry', 'f7ca1dda-491e-4b15-aa42-c48dfdcb1eba', '655e04d7-d7d1-4d50-9db8-ba0e1afe647c', NULL, false, NULL);


--
-- TOC entry 3711 (class 0 OID 16507)
-- Dependencies: 223
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders VALUES ('2391c58c-818e-4b13-a473-96cd4fe16802', '31', 'WAITING', 89.00, NULL, '2026-01-21 13:23:34.792668', '2026-01-21 13:23:34.792668', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '8532356d-af05-4038-b2eb-fbf33573d717', 'cc6a8924-37b9-42d7-9783-a10daa1170bd', 51);
INSERT INTO public.orders VALUES ('4cb430e9-9803-46ae-afd2-d2170e5f0f35', '32', 'WAITING', 45.00, NULL, '2026-01-21 13:49:07.405875', '2026-01-21 13:49:07.405875', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'a66d083a-33f6-4d79-b78c-26d933a75db4', 'cc6a8924-37b9-42d7-9783-a10daa1170bd', 385);
INSERT INTO public.orders VALUES ('e880401a-6584-4be6-9e01-7d16dc127a81', '22', 'FINISHED', 89.00, '9', '2026-01-20 13:58:37.422897', '2026-01-23 11:47:11.471557', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '583f67e8-0b6c-45ea-ba41-b69c4d29b02f', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 46);
INSERT INTO public.orders VALUES ('5af85d69-70d7-4963-8922-836da6096257', 'ORD-001', 'WAITING', 169.00, '1', '2026-01-15 13:57:35.247893', '2026-01-23 13:30:12.37871', '93ee632d-e77a-402f-971c-331149e5343c', '383f09ba-a75c-4665-95de-d7945dd8423d', '5a167c25-c235-4b78-8b85-0f524812166d', '09eebeff-a659-4338-adb7-50735df96fc5', NULL, NULL, 24);
INSERT INTO public.orders VALUES ('7f6f9fea-1309-407f-98a8-d374b29034a9', '27', 'PREPARING', 12.00, NULL, '2026-01-20 17:35:40.357901', '2026-01-22 19:58:58.174091', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'a52f5739-1126-4d49-b873-4820d29924d8', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 49);
INSERT INTO public.orders VALUES ('d31df432-1a8a-4d15-a161-3dd90661b5cc', '17', 'PREPARING', 162.00, '17', '2026-01-19 21:21:29.482538', '2026-01-28 21:37:54.535394', '93ee632d-e77a-402f-971c-331149e5343c', 'cb1d9df6-597b-4053-8edc-cfc5bed21732', 'eefff269-cc52-4b4d-a20c-50309cf8b84f', NULL, 'e6a46224-a9c4-449c-82b5-60e6c11ba3d1', '76edc2fa-1a70-43bd-8843-04e0854ae806', 149);
INSERT INTO public.orders VALUES ('8c73d7f1-9be9-4e1b-9046-e4719ef8c3ef', '30', 'PREPARING', 28.00, NULL, '2026-01-21 00:22:33.420785', '2026-01-22 20:21:34.160366', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'f7617d66-009b-492e-933d-cfb2eab4ab10', '65c5a71a-7681-4449-8fd4-90be2ef8615f', 31);
INSERT INTO public.orders VALUES ('36e333dc-3c9e-4023-8c1c-ac2d3c0a6360', '1', 'WAITING', 0.00, NULL, '2026-01-29 20:04:30.981301', '2026-01-29 20:04:30.981301', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'c9cf9d40-8b09-4ac4-8a5c-b78bca81ba23', '6dd2dc79-9f60-4313-997b-1bde5cf80a88', 573);
INSERT INTO public.orders VALUES ('2e111f16-273b-4fdc-9e2c-f7fe45a21112', '4', 'WAITING', 27.50, NULL, '2026-01-29 20:44:38.751582', '2026-01-29 20:44:38.751582', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'f52dfdd5-b0cc-43e8-975e-e1ef364f1718', '6dd2dc79-9f60-4313-997b-1bde5cf80a88', 139);
INSERT INTO public.orders VALUES ('f7ca1dda-491e-4b15-aa42-c48dfdcb1eba', '5', 'WAITING', 49.00, NULL, '2026-01-29 21:11:42.308227', '2026-01-29 21:11:42.308227', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '71352765-1fe3-4120-ab36-9a5f5f58caa6', '6dd2dc79-9f60-4313-997b-1bde5cf80a88', 256);
INSERT INTO public.orders VALUES ('70debfaa-ee1e-4c6f-8df1-2b290f525c4b', '11', 'PREPARING', 28.00, '10', '2026-01-19 20:05:37.92489', '2026-01-23 01:14:36.191607', '93ee632d-e77a-402f-971c-331149e5343c', 'cb1d9df6-597b-4053-8edc-cfc5bed21732', 'e4bde7b1-eac8-44b2-ab31-726384a8a700', NULL, '8ef3b5fd-6fbc-4848-b241-90526741d56d', NULL, 233);
INSERT INTO public.orders VALUES ('6f18aca0-7401-45ee-b1ff-eb64163d9428', '29', 'FINISHED', 274.00, '8', '2026-01-20 20:58:30.372788', '2026-01-23 02:23:53.590892', '93ee632d-e77a-402f-971c-331149e5343c', NULL, '0820d44a-e271-4b74-a7ad-c82cd26c6c8a', NULL, 'ed59844f-1d62-4289-b7f2-b23435043791', '65c5a71a-7681-4449-8fd4-90be2ef8615f', 73);
INSERT INTO public.orders VALUES ('dfefdd22-3445-4a3b-b778-8fa54f5657e2', '24', 'FINISHED', 170.00, '4', '2026-01-20 14:44:24.540579', '2026-01-23 11:46:23.655924', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'f2e689a8-e80d-49e8-881e-0b306b2d833f', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 57);
INSERT INTO public.orders VALUES ('822c7c0b-f9d9-44b2-9501-b1be393ad32e', '28', 'FINISHED', 173.00, '6', '2026-01-20 20:06:18.669997', '2026-01-23 11:46:30.961186', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'b8dafd40-186a-4679-bd55-2944e2aaaac5', '65c5a71a-7681-4449-8fd4-90be2ef8615f', 115);
INSERT INTO public.orders VALUES ('edf5c3e1-ea96-40fa-b52d-8c9c34daebe0', '20', 'FINISHED', 28.00, '5', '2026-01-20 13:54:36.632864', '2026-01-23 11:46:38.996416', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'd927fb29-b79f-417b-92bb-0c1fa2daf337', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 2150);
INSERT INTO public.orders VALUES ('fb138993-34ef-4ecc-aaa1-4a235845abc7', '21', 'WAITING', 28.00, NULL, '2026-01-20 13:56:00.948602', '2026-01-20 13:56:00.948602', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '3cff4059-5656-47f0-a62a-e251d6d3febd', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 83);
INSERT INTO public.orders VALUES ('b68a5e26-f144-4d90-b559-eacecef894e5', '23', 'WAITING', 28.00, NULL, '2026-01-20 14:43:26.280825', '2026-01-20 14:43:26.280825', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '97352cea-0a68-4894-966a-b5faf2a9c68d', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 73);
INSERT INTO public.orders VALUES ('1afd5433-fa40-4d63-8c8e-6137ed935e77', '25', 'WAITING', 198.00, NULL, '2026-01-20 14:53:27.01545', '2026-01-20 14:53:27.01545', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '927444fb-b0a6-460f-8577-50f30da02052', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 81);
INSERT INTO public.orders VALUES ('9abd0e52-67c0-43dd-8a91-a0a56d87ed07', '26', 'WAITING', 170.00, NULL, '2026-01-20 14:55:44.905378', '2026-01-20 14:55:44.905378', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'b2e39ce1-7346-4e29-ae1d-d9adbacbc475', 'cff022ae-ec97-4111-82aa-cdcafc9862b9', 56);
INSERT INTO public.orders VALUES ('df940a6f-317e-4bbc-818d-5654bcea7b8a', '2961', 'WAITING', 12.00, NULL, '2026-01-16 14:26:19.552389', '2026-01-16 14:26:19.552389', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '689d9b42-0166-4ca3-abcc-bae9200c7e4f', NULL, 9);
INSERT INTO public.orders VALUES ('fd717db9-b63a-4d10-b8b0-54e8b60ffc1f', '2', 'WAITING', 56.00, NULL, '2026-01-16 16:55:04.34767', '2026-01-16 16:55:04.34767', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'c04aa09c-50f9-445e-af83-2f2de7e4cd6b', NULL, 12);
INSERT INTO public.orders VALUES ('246598c9-b093-4cec-a6b6-c592de575c92', '3', 'WAITING', 224.00, NULL, '2026-01-16 17:46:27.525249', '2026-01-16 17:46:27.525249', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '0694852f-6972-49cb-a704-02cb30d199d8', NULL, 6);
INSERT INTO public.orders VALUES ('ae3e4f17-a179-4df2-a7e2-e07fd5a44734', '4', 'WAITING', 145.00, NULL, '2026-01-16 20:24:26.355528', '2026-01-16 20:24:26.355528', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'e1cf6c21-9ded-4f7d-916f-a490f4b2ca97', NULL, 3);
INSERT INTO public.orders VALUES ('c52f98cd-869c-4990-abdc-5dfe02e7e10a', '5', 'WAITING', 28.00, NULL, '2026-01-16 20:25:29.502306', '2026-01-16 20:25:29.502306', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '8af1c33d-0afd-4e52-bdd5-5eca334db5af', NULL, 9);
INSERT INTO public.orders VALUES ('04920f14-3695-44bc-be43-3d5e57ae17c0', '6', 'WAITING', 28.00, NULL, '2026-01-16 20:26:46.675985', '2026-01-16 20:26:46.675985', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'a37bab02-4d06-4a1d-9742-62a188886b0d', NULL, 67);
INSERT INTO public.orders VALUES ('39ebd0c5-fbf5-4fd2-b751-6d73bade63aa', '7', 'WAITING', 173.00, NULL, '2026-01-19 19:26:28.342256', '2026-01-19 19:26:28.342256', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '25540d56-46a5-4cf1-9ec4-0d3592109e43', NULL, 97);
INSERT INTO public.orders VALUES ('1f8b96ad-3427-44fb-900f-8a89f035cf8e', '8', 'WAITING', 145.00, NULL, '2026-01-19 19:54:39.362142', '2026-01-19 19:54:39.362142', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '263fb401-b680-4a4a-b103-33ab4d0d5527', NULL, 103);
INSERT INTO public.orders VALUES ('c5369d56-378d-41a9-b48d-cc602c209571', '9', 'WAITING', 28.00, NULL, '2026-01-19 20:01:42.144347', '2026-01-19 20:01:42.144347', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'c449b3f2-c930-494c-a0f4-73c8aaf8e566', NULL, 111);
INSERT INTO public.orders VALUES ('ba8af4a1-34c6-4949-87a1-4a5340bd9df5', '10', 'WAITING', 28.00, NULL, '2026-01-19 20:04:29.812534', '2026-01-19 20:04:29.812534', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '3fd10cf1-75fe-4ccf-a072-4505eda5662b', NULL, 121);
INSERT INTO public.orders VALUES ('06690687-4ab3-4b9e-a467-dae126ce6ca0', '12', 'WAITING', 56.00, NULL, '2026-01-19 20:08:49.330326', '2026-01-19 20:08:49.330326', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'a4ca1ac9-0267-4721-adb8-b7c346352a78', NULL, 341);
INSERT INTO public.orders VALUES ('fa0631f4-80f9-4aba-bfee-f307a4dfb5ef', '13', 'WAITING', 28.00, NULL, '2026-01-19 20:10:23.185736', '2026-01-19 20:10:23.185736', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'faaa79c7-c659-44ea-b8e9-3ba426013703', NULL, 440);
INSERT INTO public.orders VALUES ('607f4c4d-4e38-4570-8a91-b0581ee34889', '15', 'WAITING', 89.00, NULL, '2026-01-19 20:52:39.057205', '2026-01-19 20:52:39.057205', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '5673c8c9-fd02-4399-b3a2-6e9b18c4690d', '76edc2fa-1a70-43bd-8843-04e0854ae806', 70);
INSERT INTO public.orders VALUES ('660c096c-9ba7-45f5-8b4b-2c34a09b8163', '16', 'WAITING', 28.00, NULL, '2026-01-19 21:02:20.220609', '2026-01-19 21:02:20.220609', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'faa75e52-0bac-4375-8b7a-0aa214f74a70', '76edc2fa-1a70-43bd-8843-04e0854ae806', 120);
INSERT INTO public.orders VALUES ('8139c23d-64ac-4c62-8b40-14c79e2c5565', '18', 'WAITING', 262.00, NULL, '2026-01-19 21:23:51.535502', '2026-01-19 21:23:51.535502', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, '11e2893c-04bf-4697-b176-64b31ea45ba7', '76edc2fa-1a70-43bd-8843-04e0854ae806', 88);
INSERT INTO public.orders VALUES ('b6c90081-a10b-43ac-8222-bd807ab064d8', '19', 'WAITING', 262.00, NULL, '2026-01-19 21:26:22.10397', '2026-01-19 21:26:22.10397', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, NULL, 'b895b9c6-aeaf-4607-a068-7406112ecd62', '76edc2fa-1a70-43bd-8843-04e0854ae806', 92);


--
-- TOC entry 3707 (class 0 OID 16428)
-- Dependencies: 219
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.restaurants VALUES ('62d25292-b9c7-4ecf-9fe4-c02e3748108b', 'Restaurante do Pamploni 2', 'restaurante-do-pamploni-2', true, '2026-01-08 17:45:34.692991', '2026-01-30 14:17:20.67445', '', '', '', 'restaurants/logos/88e244a5-7da8-4f1b-9107-a98136b0a745.png', '', '', '', '', '', '', '', '', '', NULL);
INSERT INTO public.restaurants VALUES ('93ee632d-e77a-402f-971c-331149e5343c', 'Menux Default Restaurant', 'menux-default', true, '2026-01-12 14:47:21.175921', '2026-01-30 14:17:24.940891', '', '', '', 'restaurants/logos/579f571e-7519-4b53-b693-a30d4f318bc7.png', 'Especialistas em Alta Gastronomia, padrão Ouro Mundial. Top Top!!', '', '', '', '', '', '', '', '', 'restaurants/headers/42e7dc6f-14e6-4500-94a6-e4b551722fce.png');


--
-- TOC entry 3709 (class 0 OID 16452)
-- Dependencies: 221
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3721 (class 0 OID 25428)
-- Dependencies: 233
-- Data for Name: system_parameters; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.system_parameters VALUES ('4e903e3f-e9e3-4b05-97f0-b03573dfb4ca', '93ee632d-e77a-402f-971c-331149e5343c', 'ffe7bf98-2bd8-443d-9592-27bc29d1f525', 'eef391a6-919c-4d30-a6bc-032f29cceaad', '2026-01-26 19:15:47.854701', '2026-01-30 19:04:25.741228');


--
-- TOC entry 3714 (class 0 OID 16865)
-- Dependencies: 226
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tables VALUES ('3e631d67-8731-4d8f-9324-1cb16838cf85', 11, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.65009', '2026-01-13 13:32:07.65009', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('6e8da69b-048c-4977-9d2c-93e9c5280bc9', 12, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.654785', '2026-01-13 13:32:07.654785', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('26f7b6d5-8a26-4727-83ca-2893ef48d76b', 13, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.659882', '2026-01-13 13:32:07.659882', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('881f940e-c2a4-4ce4-a8ae-ec7615803761', 14, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.664337', '2026-01-13 13:32:07.664337', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('b1b9677d-1811-47b1-b53a-af15de74de84', 16, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.673344', '2026-01-13 13:32:07.673344', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('e0e27e0d-2d0e-46a5-9427-08593e767bab', 18, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.682812', '2026-01-13 13:32:07.682812', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('78c7abaf-152e-4d6e-ad10-95ef72bef590', 19, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.687235', '2026-01-13 13:32:07.687235', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('b6a3fdfa-a643-4de3-87c4-1629d8840143', 20, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.692324', '2026-01-13 13:32:07.692324', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('be0fafd7-9d5a-4547-abf4-4533b4ae549c', 1, 'CLOSED', 0, 0, NULL, NULL, '2026-01-15 13:53:57.706743', '2026-01-15 13:53:57.706743', '62d25292-b9c7-4ecf-9fe4-c02e3748108b', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('d1ab9928-3b44-439c-a57f-1fb5d0be7c75', 15, 'OCCUPIED', 4, 0, NULL, NULL, '2026-01-13 13:32:07.669194', '2026-01-22 20:21:34.199966', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('e4bde7b1-eac8-44b2-ab31-726384a8a700', 10, 'OCCUPIED', 4, 0, NULL, NULL, '2026-01-13 13:32:07.646105', '2026-01-23 01:14:36.300132', '93ee632d-e77a-402f-971c-331149e5343c', 'cb1d9df6-597b-4053-8edc-cfc5bed21732', NULL, 28.00);
INSERT INTO public.tables VALUES ('0820d44a-e271-4b74-a7ad-c82cd26c6c8a', 8, 'FREE', 4, 0, NULL, '2026-01-22 23:23:53.592', '2026-01-13 13:32:07.636395', '2026-01-23 02:23:53.622478', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('ef6a7050-8988-48ff-8dbe-983d2debd0ab', 3, 'FREE', 4, 0, NULL, '2026-01-23 08:46:00.174', '2026-01-13 13:32:07.609132', '2026-01-23 11:46:00.229638', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('614dc0a5-1e94-4eef-8a53-9868d9594b1f', 4, 'FREE', 4, 0, NULL, '2026-01-23 08:46:23.656', '2026-01-13 13:32:07.613414', '2026-01-23 11:46:23.68123', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('b1666890-99e0-4da7-894b-2119e468f136', 6, 'FREE', 4, 0, NULL, '2026-01-23 08:46:31.031', '2026-01-13 13:32:07.624765', '2026-01-23 11:46:31.07677', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('1a8d90f3-67ce-4e3c-8b14-954a8188dd1a', 5, 'FREE', 4, 0, NULL, '2026-01-23 08:46:38.997', '2026-01-13 13:32:07.619829', '2026-01-23 11:46:39.863583', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('d5abc37b-bc9a-4e31-884a-f15f4d9b1b51', 7, 'FREE', 4, 0, NULL, '2026-01-23 08:46:59.607', '2026-01-13 13:32:07.631532', '2026-01-23 11:46:59.683348', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('c910b270-53fc-459f-b67b-c66b859c9733', 9, 'FREE', 4, 0, NULL, '2026-01-23 08:47:11.474', '2026-01-13 13:32:07.642403', '2026-01-23 11:47:11.510242', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('69b361e5-5315-410c-94d6-9a28bc594034', 1, 'FREE', 4, 0, NULL, NULL, '2026-01-13 13:32:07.592741', '2026-01-23 13:30:12.488931', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('5a167c25-c235-4b78-8b85-0f524812166d', 2, 'OCCUPIED', 4, 0, NULL, '2026-01-23 08:46:12.517', '2026-01-13 13:32:07.60298', '2026-01-23 13:30:12.500013', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 0.00);
INSERT INTO public.tables VALUES ('eefff269-cc52-4b4d-a20c-50309cf8b84f', 17, 'OCCUPIED', 4, 0, NULL, NULL, '2026-01-13 13:32:07.678677', '2026-01-28 21:37:54.628132', '93ee632d-e77a-402f-971c-331149e5343c', 'cb1d9df6-597b-4053-8edc-cfc5bed21732', NULL, 162.00);


--
-- TOC entry 3716 (class 0 OID 16958)
-- Dependencies: 228
-- Data for Name: upsell_rules; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.upsell_rules VALUES ('df4aa239-d779-4b6e-96f4-8d66274074ed', 'Upgrade para Picanha', 'd098cb96-f5ee-4cb2-bdcc-67f85998b3f3', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', true, '2026-01-15 17:50:24.09595', '2026-01-15 17:50:24.09595', 'upsell', '93ee632d-e77a-402f-971c-331149e5343c');
INSERT INTO public.upsell_rules VALUES ('e3322fad-5087-41a3-99a5-7f38d6b4fa4e', 'Cerveja com Picanha', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', '25658dd2-21ac-4346-a151-138b80eaeb01', true, '2026-01-15 17:50:24.296518', '2026-01-15 17:50:24.296518', 'cross-sell', '93ee632d-e77a-402f-971c-331149e5343c');
INSERT INTO public.upsell_rules VALUES ('c3f1f051-c737-4957-9790-17f16a3184d5', 'Sobremesa após Jantar', '22c96ddd-8df3-475a-93e6-62f8b73fdec7', '6ec0fd66-c40e-4a0e-8f08-8eb554b133f3', true, '2026-01-15 17:50:24.333658', '2026-01-15 17:50:24.333658', 'cross-sell', '93ee632d-e77a-402f-971c-331149e5343c');
INSERT INTO public.upsell_rules VALUES ('91803aaa-79ac-4949-b920-ce46114615cb', 'Vinho com Massa', 'd098cb96-f5ee-4cb2-bdcc-67f85998b3f3', '39d3602e-7abf-45ff-b51b-0260a76014d0', true, '2026-01-15 17:50:24.363509', '2026-01-15 17:50:24.363509', 'cross-sell', '93ee632d-e77a-402f-971c-331149e5343c');


--
-- TOC entry 3710 (class 0 OID 16462)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('18a468e2-87c9-433f-b442-3df707bd6930', 'Admin', 'admin@admin.com', '$2a$08$1nha7jnxnFahwGeUZL8dgeccCzTA6bbC5SNJPgiTXg/k0cHNTfAOu', 'admin', '2026-01-08 17:45:34.798122', '2026-01-30 14:17:25.204471', '93ee632d-e77a-402f-971c-331149e5343c', NULL, NULL, 'users/5454734e-e647-4c2d-99e2-690d7976dd0b.png', NULL, true);


--
-- TOC entry 3713 (class 0 OID 16584)
-- Dependencies: 225
-- Data for Name: waiters; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.waiters VALUES ('6b07779e-a267-4ca0-ae88-c64d8d811d4a', 'João Silva', 'João', NULL, '1234', '1234', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-13 13:32:07.570571', '2026-01-13 13:32:07.570571', true, false, NULL, true);
INSERT INTO public.waiters VALUES ('383f09ba-a75c-4665-95de-d7945dd8423d', 'Garçom Default', NULL, NULL, '1234', NULL, '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-15 13:55:02.588765', '2026-01-15 13:55:02.588765', true, false, NULL, true);
INSERT INTO public.waiters VALUES ('cb1d9df6-597b-4053-8edc-cfc5bed21732', 'João Garçom', 'João', NULL, '2222', '$2a$08$03vXn03Dfab5n1pP7iiOguUS3ybhejixxrByGValw1aRpYazMq61K', '93ee632d-e77a-402f-971c-331149e5343c', '2026-01-12 14:57:39.714084', '2026-01-22 18:27:04.669294', true, false, NULL, true);


--
-- TOC entry 3733 (class 0 OID 0)
-- Dependencies: 215
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 70, true);


--
-- TOC entry 3496 (class 2606 OID 16525)
-- Name: order_items PK_005269d8574e6fac0493715c308; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY (id);


--
-- TOC entry 3502 (class 2606 OID 16946)
-- Name: customers PK_133ec679a801fab5e070f73d3ea; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY (id);


--
-- TOC entry 3478 (class 2606 OID 16427)
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- TOC entry 3486 (class 2606 OID 16461)
-- Name: sessions PK_3238ef96f18b355b671619111bc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY (id);


--
-- TOC entry 3484 (class 2606 OID 16451)
-- Name: menus PK_3fec3d93327f4538e0cbd4349c4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);


--
-- TOC entry 3504 (class 2606 OID 16968)
-- Name: upsell_rules PK_51fef917003688a0bd72811ac90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_rules
    ADD CONSTRAINT "PK_51fef917003688a0bd72811ac90" PRIMARY KEY (id);


--
-- TOC entry 3476 (class 2606 OID 16415)
-- Name: menu_items PK_57e6188f929e5dc6919168620c8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY (id);


--
-- TOC entry 3509 (class 2606 OID 17140)
-- Name: analytics_events PK_5d643d67a09b55653e98616f421; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT "PK_5d643d67a09b55653e98616f421" PRIMARY KEY (id);


--
-- TOC entry 3513 (class 2606 OID 17251)
-- Name: menu_item_options PK_5f9cc4a2480757f075354302fdb; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_options
    ADD CONSTRAINT "PK_5f9cc4a2480757f075354302fdb" PRIMARY KEY (id);


--
-- TOC entry 3519 (class 2606 OID 33616)
-- Name: category_groups PK_6968e9765dfc548603eea60877e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_groups
    ADD CONSTRAINT "PK_6968e9765dfc548603eea60877e" PRIMARY KEY (id);


--
-- TOC entry 3492 (class 2606 OID 16517)
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- TOC entry 3500 (class 2606 OID 16877)
-- Name: tables PK_7cf2aca7af9550742f855d4eb69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY (id);


--
-- TOC entry 3474 (class 2606 OID 16404)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 3488 (class 2606 OID 16472)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3511 (class 2606 OID 17245)
-- Name: order_item_compositions PK_b2aa7efb79a95547e0d56811693; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_compositions
    ADD CONSTRAINT "PK_b2aa7efb79a95547e0d56811693" PRIMARY KEY (id);


--
-- TOC entry 3525 (class 2606 OID 33706)
-- Name: choice_items PK_bffbbb5b6dce82a7246514834aa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choice_items
    ADD CONSTRAINT "PK_bffbbb5b6dce82a7246514834aa" PRIMARY KEY (id);


--
-- TOC entry 3507 (class 2606 OID 17125)
-- Name: daily_metrics PK_daily_metrics_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_metrics
    ADD CONSTRAINT "PK_daily_metrics_id" PRIMARY KEY (id);


--
-- TOC entry 3521 (class 2606 OID 33636)
-- Name: menu_items_options PK_db19d90316fee42294f0dfbd268; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items_options
    ADD CONSTRAINT "PK_db19d90316fee42294f0dfbd268" PRIMARY KEY (id);


--
-- TOC entry 3480 (class 2606 OID 16438)
-- Name: restaurants PK_e2133a72eb1cc8f588f7b503e68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY (id);


--
-- TOC entry 3523 (class 2606 OID 33665)
-- Name: menu_item_option_items PK_fcf7b2fa3130a06e0609a650342; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_option_items
    ADD CONSTRAINT "PK_fcf7b2fa3130a06e0609a650342" PRIMARY KEY (id);


--
-- TOC entry 3515 (class 2606 OID 25435)
-- Name: system_parameters PK_system_parameters_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT "PK_system_parameters_id" PRIMARY KEY (id);


--
-- TOC entry 3498 (class 2606 OID 16593)
-- Name: waiters PK_waiters_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiters
    ADD CONSTRAINT "PK_waiters_id" PRIMARY KEY (id);


--
-- TOC entry 3494 (class 2606 OID 17106)
-- Name: orders UQ_4547f22852bd9778b54dafe30e5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "UQ_4547f22852bd9778b54dafe30e5" UNIQUE (transaction_id);


--
-- TOC entry 3490 (class 2606 OID 16474)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 3482 (class 2606 OID 16440)
-- Name: restaurants UQ_afb6330c019768b4c3f9a65303c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT "UQ_afb6330c019768b4c3f9a65303c" UNIQUE (slug);


--
-- TOC entry 3517 (class 2606 OID 25437)
-- Name: system_parameters UQ_system_parameters_restaurantId; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT "UQ_system_parameters_restaurantId" UNIQUE ("restaurantId");


--
-- TOC entry 3505 (class 1259 OID 17148)
-- Name: IDX_ecc56da9e838fd13abb3253a27; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_ecc56da9e838fd13abb3253a27" ON public.daily_metrics USING btree (restaurant_id, date);


--
-- TOC entry 3536 (class 2606 OID 17174)
-- Name: order_items FK_145532db85752b29c57d2b7b1f1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3532 (class 2606 OID 17204)
-- Name: orders FK_1aeeb86b9610f47f8a28e2be1db; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_1aeeb86b9610f47f8a28e2be1db" FOREIGN KEY (waiter_id) REFERENCES public.waiters(id);


--
-- TOC entry 3559 (class 2606 OID 33728)
-- Name: choice_items FK_1e2d42353d223f8895818d2881e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choice_items
    ADD CONSTRAINT "FK_1e2d42353d223f8895818d2881e" FOREIGN KEY ("choosenMenuItemId") REFERENCES public.menu_items(id);


--
-- TOC entry 3550 (class 2606 OID 33681)
-- Name: system_parameters FK_1fca572e8b86d2001edd4e33bd9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT "FK_1fca572e8b86d2001edd4e33bd9" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- TOC entry 3551 (class 2606 OID 33691)
-- Name: system_parameters FK_204e4d53486f729aba064930277; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT "FK_204e4d53486f729aba064930277" FOREIGN KEY ("wineCategoryId") REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 3533 (class 2606 OID 17194)
-- Name: orders FK_3d36410e89a795172fa6e0dd968; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_3d36410e89a795172fa6e0dd968" FOREIGN KEY (table_id) REFERENCES public.tables(id);


--
-- TOC entry 3542 (class 2606 OID 17149)
-- Name: upsell_rules FK_3d4ec36469ff3f97b558c55fba3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_rules
    ADD CONSTRAINT "FK_3d4ec36469ff3f97b558c55fba3" FOREIGN KEY (trigger_product_id) REFERENCES public.menu_items(id);


--
-- TOC entry 3555 (class 2606 OID 33652)
-- Name: menu_items_options FK_3d5407bcb4d965348d052331c7e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items_options
    ADD CONSTRAINT "FK_3d5407bcb4d965348d052331c7e" FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 3546 (class 2606 OID 17257)
-- Name: order_item_compositions FK_4be00eed19197e0d1dc047a1939; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_compositions
    ADD CONSTRAINT "FK_4be00eed19197e0d1dc047a1939" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id);


--
-- TOC entry 3553 (class 2606 OID 33622)
-- Name: category_groups FK_5b04e16bc06df6f7eb383f00099; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_groups
    ADD CONSTRAINT "FK_5b04e16bc06df6f7eb383f00099" FOREIGN KEY ("compositionCategoryId") REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3530 (class 2606 OID 16485)
-- Name: menus FK_62f6422b138b02c889426a1bf47; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "FK_62f6422b138b02c889426a1bf47" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);


--
-- TOC entry 3528 (class 2606 OID 16617)
-- Name: categories FK_64dfd0fe466eff96a09ff4b10ac; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_64dfd0fe466eff96a09ff4b10ac" FOREIGN KEY (pai) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 3545 (class 2606 OID 17219)
-- Name: daily_metrics FK_7556e12f586d9594a78be09234a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_metrics
    ADD CONSTRAINT "FK_7556e12f586d9594a78be09234a" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- TOC entry 3541 (class 2606 OID 17184)
-- Name: customers FK_76038a7f0cc133ac7d2c387a7cf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_76038a7f0cc133ac7d2c387a7cf" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- TOC entry 3548 (class 2606 OID 17262)
-- Name: menu_item_options FK_7615f34e2b9554c8d9fe0062a79; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_options
    ADD CONSTRAINT "FK_7615f34e2b9554c8d9fe0062a79" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 3534 (class 2606 OID 17189)
-- Name: orders FK_772d0ce0473ac2ccfa26060dbe9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_772d0ce0473ac2ccfa26060dbe9" FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- TOC entry 3538 (class 2606 OID 17164)
-- Name: waiters FK_775bbd2a9d923cda519732eb788; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiters
    ADD CONSTRAINT "FK_775bbd2a9d923cda519732eb788" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- TOC entry 3539 (class 2606 OID 17209)
-- Name: tables FK_77e362d578933cf4518770d11ae; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT "FK_77e362d578933cf4518770d11ae" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- TOC entry 3554 (class 2606 OID 33617)
-- Name: category_groups FK_826b072d7be92537e8d93777d76; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_groups
    ADD CONSTRAINT "FK_826b072d7be92537e8d93777d76" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- TOC entry 3543 (class 2606 OID 17154)
-- Name: upsell_rules FK_831387c5b7fdade8d09ba8821a7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_rules
    ADD CONSTRAINT "FK_831387c5b7fdade8d09ba8821a7" FOREIGN KEY (upgrade_product_id) REFERENCES public.menu_items(id);


--
-- TOC entry 3535 (class 2606 OID 17199)
-- Name: orders FK_85fdda5fcce2f397ef8f117a2c6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_85fdda5fcce2f397ef8f117a2c6" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- TOC entry 3557 (class 2606 OID 33666)
-- Name: menu_item_option_items FK_9daff9a86ff1262408e253800a3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_option_items
    ADD CONSTRAINT "FK_9daff9a86ff1262408e253800a3" FOREIGN KEY (menu_item_option_id) REFERENCES public.menu_items_options(id) ON DELETE CASCADE;


--
-- TOC entry 3531 (class 2606 OID 17169)
-- Name: users FK_a2db2210c81ee6fb1c11843e18c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_a2db2210c81ee6fb1c11843e18c" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- TOC entry 3526 (class 2606 OID 17024)
-- Name: menu_items FK_a6b42bf45dbdef19cbf05a4cacf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf" FOREIGN KEY ("menuId") REFERENCES public.menus(id) ON DELETE CASCADE;


--
-- TOC entry 3558 (class 2606 OID 33671)
-- Name: menu_item_option_items FK_a774d2f5a0fb08eca1f51620430; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_option_items
    ADD CONSTRAINT "FK_a774d2f5a0fb08eca1f51620430" FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id);


--
-- TOC entry 3540 (class 2606 OID 17214)
-- Name: tables FK_b520ec91c6e8486f51551d54129; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT "FK_b520ec91c6e8486f51551d54129" FOREIGN KEY (waiter_id) REFERENCES public.waiters(id);


--
-- TOC entry 3552 (class 2606 OID 33686)
-- Name: system_parameters FK_be6efa036f53f0270bd8662e436; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT "FK_be6efa036f53f0270bd8662e436" FOREIGN KEY ("pizzaCategoryId") REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- TOC entry 3560 (class 2606 OID 33712)
-- Name: choice_items FK_c40c78f980b9d9cabac81ad4bd8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choice_items
    ADD CONSTRAINT "FK_c40c78f980b9d9cabac81ad4bd8" FOREIGN KEY ("parentMenuItemId") REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 3527 (class 2606 OID 16475)
-- Name: menu_items FK_d56e5ccc298e8bf721f75a7eb96; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- TOC entry 3556 (class 2606 OID 33676)
-- Name: menu_items_options FK_d857f0175e0368d1bbbca6cda3c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items_options
    ADD CONSTRAINT "FK_d857f0175e0368d1bbbca6cda3c" FOREIGN KEY (category_group_id) REFERENCES public.category_groups(id);


--
-- TOC entry 3549 (class 2606 OID 17267)
-- Name: menu_item_options FK_dd4debe72dad6c110c4989d2ed3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_options
    ADD CONSTRAINT "FK_dd4debe72dad6c110c4989d2ed3" FOREIGN KEY ("optionItemId") REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 3547 (class 2606 OID 17252)
-- Name: order_item_compositions FK_e319ddfee17e026ec2a02f56289; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_compositions
    ADD CONSTRAINT "FK_e319ddfee17e026ec2a02f56289" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- TOC entry 3537 (class 2606 OID 17179)
-- Name: order_items FK_e462517174f561ece2916701c0a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_e462517174f561ece2916701c0a" FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id);


--
-- TOC entry 3544 (class 2606 OID 17159)
-- Name: upsell_rules FK_faf461c44a7b90e89bb4bdf4925; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_rules
    ADD CONSTRAINT "FK_faf461c44a7b90e89bb4bdf4925" FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- TOC entry 3529 (class 2606 OID 16480)
-- Name: categories FK_fe8e7d37475de7eb2f8f83a6da0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "FK_fe8e7d37475de7eb2f8f83a6da0" FOREIGN KEY ("restaurantId") REFERENCES public.restaurants(id);


-- Completed on 2026-01-30 17:34:20 -03

--
-- PostgreSQL database dump complete
--

