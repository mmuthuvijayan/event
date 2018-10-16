-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2018 at 03:05 PM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `event_commentmeta`
--

CREATE TABLE `event_commentmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL,
  `comment_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_comments`
--

CREATE TABLE `event_comments` (
  `comment_ID` bigint(20) UNSIGNED NOT NULL,
  `comment_post_ID` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `comment_author` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_author_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `comment_author_url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `comment_author_IP` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `comment_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment_date_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `comment_content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment_karma` int(11) NOT NULL DEFAULT '0',
  `comment_approved` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `comment_agent` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `comment_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `comment_parent` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_comments`
--

INSERT INTO `event_comments` (`comment_ID`, `comment_post_ID`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_IP`, `comment_date`, `comment_date_gmt`, `comment_content`, `comment_karma`, `comment_approved`, `comment_agent`, `comment_type`, `comment_parent`, `user_id`) VALUES
(1, 1, 'A WordPress Commenter', 'wapuu@wordpress.example', 'https://wordpress.org/', '', '2018-10-08 10:25:34', '2018-10-08 10:25:34', 'Hi, this is a comment.\nTo get started with moderating, editing, and deleting comments, please visit the Comments screen in the dashboard.\nCommenter avatars come from <a href=\"https://gravatar.com\">Gravatar</a>.', 0, '1', '', '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_links`
--

CREATE TABLE `event_links` (
  `link_id` bigint(20) UNSIGNED NOT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_target` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_visible` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Y',
  `link_owner` bigint(20) UNSIGNED NOT NULL DEFAULT '1',
  `link_rating` int(11) NOT NULL DEFAULT '0',
  `link_updated` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `link_rel` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_notes` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_rss` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_options`
--

CREATE TABLE `event_options` (
  `option_id` bigint(20) UNSIGNED NOT NULL,
  `option_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `option_value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `autoload` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_options`
--

INSERT INTO `event_options` (`option_id`, `option_name`, `option_value`, `autoload`) VALUES
(1, 'siteurl', 'http://10.0.1.84/event', 'yes'),
(2, 'home', 'http://10.0.1.84/event', 'yes'),
(3, 'blogname', 'Event Page', 'yes'),
(4, 'blogdescription', 'Just another WordPress site', 'yes'),
(5, 'users_can_register', '0', 'yes'),
(6, 'admin_email', 'muthuvijayan.m@gofrugal.com', 'yes'),
(7, 'start_of_week', '1', 'yes'),
(8, 'use_balanceTags', '0', 'yes'),
(9, 'use_smilies', '1', 'yes'),
(10, 'require_name_email', '1', 'yes'),
(11, 'comments_notify', '1', 'yes'),
(12, 'posts_per_rss', '10', 'yes'),
(13, 'rss_use_excerpt', '0', 'yes'),
(14, 'mailserver_url', 'mail.example.com', 'yes'),
(15, 'mailserver_login', 'login@example.com', 'yes'),
(16, 'mailserver_pass', 'password', 'yes'),
(17, 'mailserver_port', '110', 'yes'),
(18, 'default_category', '1', 'yes'),
(19, 'default_comment_status', 'open', 'yes'),
(20, 'default_ping_status', 'open', 'yes'),
(21, 'default_pingback_flag', '1', 'yes'),
(22, 'posts_per_page', '10', 'yes'),
(23, 'date_format', 'F j, Y', 'yes'),
(24, 'time_format', 'g:i a', 'yes'),
(25, 'links_updated_date_format', 'F j, Y g:i a', 'yes'),
(26, 'comment_moderation', '0', 'yes'),
(27, 'moderation_notify', '1', 'yes'),
(28, 'permalink_structure', '/%year%/%monthnum%/%day%/%postname%/', 'yes'),
(29, 'rewrite_rules', 'a:90:{s:11:\"^wp-json/?$\";s:22:\"index.php?rest_route=/\";s:14:\"^wp-json/(.*)?\";s:33:\"index.php?rest_route=/$matches[1]\";s:21:\"^index.php/wp-json/?$\";s:22:\"index.php?rest_route=/\";s:24:\"^index.php/wp-json/(.*)?\";s:33:\"index.php?rest_route=/$matches[1]\";s:47:\"category/(.+?)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:52:\"index.php?category_name=$matches[1]&feed=$matches[2]\";s:42:\"category/(.+?)/(feed|rdf|rss|rss2|atom)/?$\";s:52:\"index.php?category_name=$matches[1]&feed=$matches[2]\";s:23:\"category/(.+?)/embed/?$\";s:46:\"index.php?category_name=$matches[1]&embed=true\";s:35:\"category/(.+?)/page/?([0-9]{1,})/?$\";s:53:\"index.php?category_name=$matches[1]&paged=$matches[2]\";s:17:\"category/(.+?)/?$\";s:35:\"index.php?category_name=$matches[1]\";s:44:\"tag/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:42:\"index.php?tag=$matches[1]&feed=$matches[2]\";s:39:\"tag/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:42:\"index.php?tag=$matches[1]&feed=$matches[2]\";s:20:\"tag/([^/]+)/embed/?$\";s:36:\"index.php?tag=$matches[1]&embed=true\";s:32:\"tag/([^/]+)/page/?([0-9]{1,})/?$\";s:43:\"index.php?tag=$matches[1]&paged=$matches[2]\";s:14:\"tag/([^/]+)/?$\";s:25:\"index.php?tag=$matches[1]\";s:45:\"type/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:50:\"index.php?post_format=$matches[1]&feed=$matches[2]\";s:40:\"type/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:50:\"index.php?post_format=$matches[1]&feed=$matches[2]\";s:21:\"type/([^/]+)/embed/?$\";s:44:\"index.php?post_format=$matches[1]&embed=true\";s:33:\"type/([^/]+)/page/?([0-9]{1,})/?$\";s:51:\"index.php?post_format=$matches[1]&paged=$matches[2]\";s:15:\"type/([^/]+)/?$\";s:33:\"index.php?post_format=$matches[1]\";s:48:\".*wp-(atom|rdf|rss|rss2|feed|commentsrss2)\\.php$\";s:18:\"index.php?feed=old\";s:20:\".*wp-app\\.php(/.*)?$\";s:19:\"index.php?error=403\";s:18:\".*wp-register.php$\";s:23:\"index.php?register=true\";s:32:\"feed/(feed|rdf|rss|rss2|atom)/?$\";s:27:\"index.php?&feed=$matches[1]\";s:27:\"(feed|rdf|rss|rss2|atom)/?$\";s:27:\"index.php?&feed=$matches[1]\";s:8:\"embed/?$\";s:21:\"index.php?&embed=true\";s:20:\"page/?([0-9]{1,})/?$\";s:28:\"index.php?&paged=$matches[1]\";s:27:\"comment-page-([0-9]{1,})/?$\";s:39:\"index.php?&page_id=26&cpage=$matches[1]\";s:41:\"comments/feed/(feed|rdf|rss|rss2|atom)/?$\";s:42:\"index.php?&feed=$matches[1]&withcomments=1\";s:36:\"comments/(feed|rdf|rss|rss2|atom)/?$\";s:42:\"index.php?&feed=$matches[1]&withcomments=1\";s:17:\"comments/embed/?$\";s:21:\"index.php?&embed=true\";s:44:\"search/(.+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:40:\"index.php?s=$matches[1]&feed=$matches[2]\";s:39:\"search/(.+)/(feed|rdf|rss|rss2|atom)/?$\";s:40:\"index.php?s=$matches[1]&feed=$matches[2]\";s:20:\"search/(.+)/embed/?$\";s:34:\"index.php?s=$matches[1]&embed=true\";s:32:\"search/(.+)/page/?([0-9]{1,})/?$\";s:41:\"index.php?s=$matches[1]&paged=$matches[2]\";s:14:\"search/(.+)/?$\";s:23:\"index.php?s=$matches[1]\";s:47:\"author/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:50:\"index.php?author_name=$matches[1]&feed=$matches[2]\";s:42:\"author/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:50:\"index.php?author_name=$matches[1]&feed=$matches[2]\";s:23:\"author/([^/]+)/embed/?$\";s:44:\"index.php?author_name=$matches[1]&embed=true\";s:35:\"author/([^/]+)/page/?([0-9]{1,})/?$\";s:51:\"index.php?author_name=$matches[1]&paged=$matches[2]\";s:17:\"author/([^/]+)/?$\";s:33:\"index.php?author_name=$matches[1]\";s:69:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$\";s:80:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]\";s:64:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$\";s:80:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]\";s:45:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/embed/?$\";s:74:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&embed=true\";s:57:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/page/?([0-9]{1,})/?$\";s:81:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&paged=$matches[4]\";s:39:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/?$\";s:63:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]\";s:56:\"([0-9]{4})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$\";s:64:\"index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]\";s:51:\"([0-9]{4})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$\";s:64:\"index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]\";s:32:\"([0-9]{4})/([0-9]{1,2})/embed/?$\";s:58:\"index.php?year=$matches[1]&monthnum=$matches[2]&embed=true\";s:44:\"([0-9]{4})/([0-9]{1,2})/page/?([0-9]{1,})/?$\";s:65:\"index.php?year=$matches[1]&monthnum=$matches[2]&paged=$matches[3]\";s:26:\"([0-9]{4})/([0-9]{1,2})/?$\";s:47:\"index.php?year=$matches[1]&monthnum=$matches[2]\";s:43:\"([0-9]{4})/feed/(feed|rdf|rss|rss2|atom)/?$\";s:43:\"index.php?year=$matches[1]&feed=$matches[2]\";s:38:\"([0-9]{4})/(feed|rdf|rss|rss2|atom)/?$\";s:43:\"index.php?year=$matches[1]&feed=$matches[2]\";s:19:\"([0-9]{4})/embed/?$\";s:37:\"index.php?year=$matches[1]&embed=true\";s:31:\"([0-9]{4})/page/?([0-9]{1,})/?$\";s:44:\"index.php?year=$matches[1]&paged=$matches[2]\";s:13:\"([0-9]{4})/?$\";s:26:\"index.php?year=$matches[1]\";s:58:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/?$\";s:32:\"index.php?attachment=$matches[1]\";s:68:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/trackback/?$\";s:37:\"index.php?attachment=$matches[1]&tb=1\";s:88:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:49:\"index.php?attachment=$matches[1]&feed=$matches[2]\";s:83:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:49:\"index.php?attachment=$matches[1]&feed=$matches[2]\";s:83:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$\";s:50:\"index.php?attachment=$matches[1]&cpage=$matches[2]\";s:64:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/attachment/([^/]+)/embed/?$\";s:43:\"index.php?attachment=$matches[1]&embed=true\";s:53:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/embed/?$\";s:91:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&embed=true\";s:57:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/trackback/?$\";s:85:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&tb=1\";s:77:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:97:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&feed=$matches[5]\";s:72:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:97:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&feed=$matches[5]\";s:65:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/page/?([0-9]{1,})/?$\";s:98:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&paged=$matches[5]\";s:72:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)/comment-page-([0-9]{1,})/?$\";s:98:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&cpage=$matches[5]\";s:61:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/?$\";s:97:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&page=$matches[5]\";s:47:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/?$\";s:32:\"index.php?attachment=$matches[1]\";s:57:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/trackback/?$\";s:37:\"index.php?attachment=$matches[1]&tb=1\";s:77:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:49:\"index.php?attachment=$matches[1]&feed=$matches[2]\";s:72:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:49:\"index.php?attachment=$matches[1]&feed=$matches[2]\";s:72:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$\";s:50:\"index.php?attachment=$matches[1]&cpage=$matches[2]\";s:53:\"[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/embed/?$\";s:43:\"index.php?attachment=$matches[1]&embed=true\";s:64:\"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/comment-page-([0-9]{1,})/?$\";s:81:\"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&cpage=$matches[4]\";s:51:\"([0-9]{4})/([0-9]{1,2})/comment-page-([0-9]{1,})/?$\";s:65:\"index.php?year=$matches[1]&monthnum=$matches[2]&cpage=$matches[3]\";s:38:\"([0-9]{4})/comment-page-([0-9]{1,})/?$\";s:44:\"index.php?year=$matches[1]&cpage=$matches[2]\";s:27:\".?.+?/attachment/([^/]+)/?$\";s:32:\"index.php?attachment=$matches[1]\";s:37:\".?.+?/attachment/([^/]+)/trackback/?$\";s:37:\"index.php?attachment=$matches[1]&tb=1\";s:57:\".?.+?/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:49:\"index.php?attachment=$matches[1]&feed=$matches[2]\";s:52:\".?.+?/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$\";s:49:\"index.php?attachment=$matches[1]&feed=$matches[2]\";s:52:\".?.+?/attachment/([^/]+)/comment-page-([0-9]{1,})/?$\";s:50:\"index.php?attachment=$matches[1]&cpage=$matches[2]\";s:33:\".?.+?/attachment/([^/]+)/embed/?$\";s:43:\"index.php?attachment=$matches[1]&embed=true\";s:16:\"(.?.+?)/embed/?$\";s:41:\"index.php?pagename=$matches[1]&embed=true\";s:20:\"(.?.+?)/trackback/?$\";s:35:\"index.php?pagename=$matches[1]&tb=1\";s:40:\"(.?.+?)/feed/(feed|rdf|rss|rss2|atom)/?$\";s:47:\"index.php?pagename=$matches[1]&feed=$matches[2]\";s:35:\"(.?.+?)/(feed|rdf|rss|rss2|atom)/?$\";s:47:\"index.php?pagename=$matches[1]&feed=$matches[2]\";s:28:\"(.?.+?)/page/?([0-9]{1,})/?$\";s:48:\"index.php?pagename=$matches[1]&paged=$matches[2]\";s:35:\"(.?.+?)/comment-page-([0-9]{1,})/?$\";s:48:\"index.php?pagename=$matches[1]&cpage=$matches[2]\";s:24:\"(.?.+?)(?:/([0-9]+))?/?$\";s:47:\"index.php?pagename=$matches[1]&page=$matches[2]\";}', 'yes'),
(30, 'hack_file', '0', 'yes'),
(31, 'blog_charset', 'UTF-8', 'yes'),
(32, 'moderation_keys', '', 'no'),
(33, 'active_plugins', 'a:1:{i:0;s:50:\"multiple-post-thumbnails/multi-post-thumbnails.php\";}', 'yes'),
(34, 'category_base', '', 'yes'),
(35, 'ping_sites', 'http://rpc.pingomatic.com/', 'yes'),
(36, 'comment_max_links', '2', 'yes'),
(37, 'gmt_offset', '0', 'yes'),
(38, 'default_email_category', '1', 'yes'),
(39, 'recently_edited', 'a:5:{i:0;s:60:\"D:\\xampp\\htdocs\\event/wp-content/themes/sparkling/header.php\";i:1;s:83:\"D:\\xampp\\htdocs\\event/wp-content/themes/sparkling/template-parts/content-single.php\";i:2;s:81:\"D:\\xampp\\htdocs\\event/wp-content/themes/sparkling/template-parts/content-page.php\";i:3;s:81:\"D:\\xampp\\htdocs\\event/wp-content/themes/sparkling/template-parts/content-none.php\";i:4;s:60:\"D:\\xampp\\htdocs\\event/wp-content/themes/sparkling/single.php\";}', 'no'),
(40, 'template', 'sparkling', 'yes'),
(41, 'stylesheet', 'sparkling', 'yes'),
(42, 'comment_whitelist', '1', 'yes'),
(43, 'blacklist_keys', '', 'no'),
(44, 'comment_registration', '0', 'yes'),
(45, 'html_type', 'text/html', 'yes'),
(46, 'use_trackback', '0', 'yes'),
(47, 'default_role', 'subscriber', 'yes'),
(48, 'db_version', '38590', 'yes'),
(49, 'uploads_use_yearmonth_folders', '1', 'yes'),
(50, 'upload_path', '', 'yes'),
(51, 'blog_public', '1', 'yes'),
(52, 'default_link_category', '2', 'yes'),
(53, 'show_on_front', 'page', 'yes'),
(54, 'tag_base', '', 'yes'),
(55, 'show_avatars', '1', 'yes'),
(56, 'avatar_rating', 'G', 'yes'),
(57, 'upload_url_path', '', 'yes'),
(58, 'thumbnail_size_w', '150', 'yes'),
(59, 'thumbnail_size_h', '150', 'yes'),
(60, 'thumbnail_crop', '1', 'yes'),
(61, 'medium_size_w', '300', 'yes'),
(62, 'medium_size_h', '300', 'yes'),
(63, 'avatar_default', 'mystery', 'yes'),
(64, 'large_size_w', '1024', 'yes'),
(65, 'large_size_h', '1024', 'yes'),
(66, 'image_default_link_type', 'none', 'yes'),
(67, 'image_default_size', '', 'yes'),
(68, 'image_default_align', '', 'yes'),
(69, 'close_comments_for_old_posts', '0', 'yes'),
(70, 'close_comments_days_old', '14', 'yes'),
(71, 'thread_comments', '1', 'yes'),
(72, 'thread_comments_depth', '5', 'yes'),
(73, 'page_comments', '0', 'yes'),
(74, 'comments_per_page', '50', 'yes'),
(75, 'default_comments_page', 'newest', 'yes'),
(76, 'comment_order', 'asc', 'yes'),
(77, 'sticky_posts', 'a:0:{}', 'yes'),
(78, 'widget_categories', 'a:2:{i:2;a:4:{s:5:\"title\";s:0:\"\";s:5:\"count\";i:0;s:12:\"hierarchical\";i:0;s:8:\"dropdown\";i:0;}s:12:\"_multiwidget\";i:1;}', 'yes'),
(79, 'widget_text', 'a:2:{i:1;a:0:{}s:12:\"_multiwidget\";i:1;}', 'yes'),
(80, 'widget_rss', 'a:2:{i:1;a:0:{}s:12:\"_multiwidget\";i:1;}', 'yes'),
(81, 'uninstall_plugins', 'a:0:{}', 'no'),
(82, 'timezone_string', '', 'yes'),
(84, 'page_on_front', '26', 'yes'),
(85, 'default_post_format', '0', 'yes'),
(86, 'link_manager_enabled', '0', 'yes'),
(87, 'finished_splitting_shared_terms', '1', 'yes'),
(88, 'site_icon', '0', 'yes'),
(89, 'medium_large_size_w', '768', 'yes'),
(90, 'medium_large_size_h', '0', 'yes'),
(91, 'wp_page_for_privacy_policy', '3', 'yes'),
(92, 'show_comments_cookies_opt_in', '0', 'yes'),
(93, 'initial_db_version', '38590', 'yes'),
(94, 'event_user_roles', 'a:5:{s:13:\"administrator\";a:2:{s:4:\"name\";s:13:\"Administrator\";s:12:\"capabilities\";a:61:{s:13:\"switch_themes\";b:1;s:11:\"edit_themes\";b:1;s:16:\"activate_plugins\";b:1;s:12:\"edit_plugins\";b:1;s:10:\"edit_users\";b:1;s:10:\"edit_files\";b:1;s:14:\"manage_options\";b:1;s:17:\"moderate_comments\";b:1;s:17:\"manage_categories\";b:1;s:12:\"manage_links\";b:1;s:12:\"upload_files\";b:1;s:6:\"import\";b:1;s:15:\"unfiltered_html\";b:1;s:10:\"edit_posts\";b:1;s:17:\"edit_others_posts\";b:1;s:20:\"edit_published_posts\";b:1;s:13:\"publish_posts\";b:1;s:10:\"edit_pages\";b:1;s:4:\"read\";b:1;s:8:\"level_10\";b:1;s:7:\"level_9\";b:1;s:7:\"level_8\";b:1;s:7:\"level_7\";b:1;s:7:\"level_6\";b:1;s:7:\"level_5\";b:1;s:7:\"level_4\";b:1;s:7:\"level_3\";b:1;s:7:\"level_2\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:17:\"edit_others_pages\";b:1;s:20:\"edit_published_pages\";b:1;s:13:\"publish_pages\";b:1;s:12:\"delete_pages\";b:1;s:19:\"delete_others_pages\";b:1;s:22:\"delete_published_pages\";b:1;s:12:\"delete_posts\";b:1;s:19:\"delete_others_posts\";b:1;s:22:\"delete_published_posts\";b:1;s:20:\"delete_private_posts\";b:1;s:18:\"edit_private_posts\";b:1;s:18:\"read_private_posts\";b:1;s:20:\"delete_private_pages\";b:1;s:18:\"edit_private_pages\";b:1;s:18:\"read_private_pages\";b:1;s:12:\"delete_users\";b:1;s:12:\"create_users\";b:1;s:17:\"unfiltered_upload\";b:1;s:14:\"edit_dashboard\";b:1;s:14:\"update_plugins\";b:1;s:14:\"delete_plugins\";b:1;s:15:\"install_plugins\";b:1;s:13:\"update_themes\";b:1;s:14:\"install_themes\";b:1;s:11:\"update_core\";b:1;s:10:\"list_users\";b:1;s:12:\"remove_users\";b:1;s:13:\"promote_users\";b:1;s:18:\"edit_theme_options\";b:1;s:13:\"delete_themes\";b:1;s:6:\"export\";b:1;}}s:6:\"editor\";a:2:{s:4:\"name\";s:6:\"Editor\";s:12:\"capabilities\";a:34:{s:17:\"moderate_comments\";b:1;s:17:\"manage_categories\";b:1;s:12:\"manage_links\";b:1;s:12:\"upload_files\";b:1;s:15:\"unfiltered_html\";b:1;s:10:\"edit_posts\";b:1;s:17:\"edit_others_posts\";b:1;s:20:\"edit_published_posts\";b:1;s:13:\"publish_posts\";b:1;s:10:\"edit_pages\";b:1;s:4:\"read\";b:1;s:7:\"level_7\";b:1;s:7:\"level_6\";b:1;s:7:\"level_5\";b:1;s:7:\"level_4\";b:1;s:7:\"level_3\";b:1;s:7:\"level_2\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:17:\"edit_others_pages\";b:1;s:20:\"edit_published_pages\";b:1;s:13:\"publish_pages\";b:1;s:12:\"delete_pages\";b:1;s:19:\"delete_others_pages\";b:1;s:22:\"delete_published_pages\";b:1;s:12:\"delete_posts\";b:1;s:19:\"delete_others_posts\";b:1;s:22:\"delete_published_posts\";b:1;s:20:\"delete_private_posts\";b:1;s:18:\"edit_private_posts\";b:1;s:18:\"read_private_posts\";b:1;s:20:\"delete_private_pages\";b:1;s:18:\"edit_private_pages\";b:1;s:18:\"read_private_pages\";b:1;}}s:6:\"author\";a:2:{s:4:\"name\";s:6:\"Author\";s:12:\"capabilities\";a:10:{s:12:\"upload_files\";b:1;s:10:\"edit_posts\";b:1;s:20:\"edit_published_posts\";b:1;s:13:\"publish_posts\";b:1;s:4:\"read\";b:1;s:7:\"level_2\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:12:\"delete_posts\";b:1;s:22:\"delete_published_posts\";b:1;}}s:11:\"contributor\";a:2:{s:4:\"name\";s:11:\"Contributor\";s:12:\"capabilities\";a:5:{s:10:\"edit_posts\";b:1;s:4:\"read\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:12:\"delete_posts\";b:1;}}s:10:\"subscriber\";a:2:{s:4:\"name\";s:10:\"Subscriber\";s:12:\"capabilities\";a:2:{s:4:\"read\";b:1;s:7:\"level_0\";b:1;}}}', 'yes'),
(95, 'fresh_site', '0', 'yes'),
(96, 'widget_search', 'a:2:{i:2;a:1:{s:5:\"title\";s:0:\"\";}s:12:\"_multiwidget\";i:1;}', 'yes'),
(97, 'widget_recent-posts', 'a:2:{i:2;a:2:{s:5:\"title\";s:0:\"\";s:6:\"number\";i:5;}s:12:\"_multiwidget\";i:1;}', 'yes'),
(98, 'widget_recent-comments', 'a:2:{i:2;a:2:{s:5:\"title\";s:0:\"\";s:6:\"number\";i:5;}s:12:\"_multiwidget\";i:1;}', 'yes'),
(99, 'widget_archives', 'a:2:{i:2;a:3:{s:5:\"title\";s:0:\"\";s:5:\"count\";i:0;s:8:\"dropdown\";i:0;}s:12:\"_multiwidget\";i:1;}', 'yes'),
(100, 'widget_meta', 'a:2:{i:2;a:1:{s:5:\"title\";s:0:\"\";}s:12:\"_multiwidget\";i:1;}', 'yes'),
(101, 'sidebars_widgets', 'a:9:{s:19:\"wp_inactive_widgets\";a:1:{i:0;s:16:\"sparkling-cats-3\";}s:9:\"sidebar-1\";a:6:{i:0;s:8:\"search-2\";i:1;s:14:\"recent-posts-2\";i:2;s:17:\"recent-comments-2\";i:3;s:10:\"archives-2\";i:4;s:12:\"categories-2\";i:5;s:6:\"meta-2\";}s:13:\"home-widget-1\";a:0:{}s:13:\"home-widget-2\";a:0:{}s:13:\"home-widget-3\";a:0:{}s:15:\"footer-widget-1\";a:0:{}s:15:\"footer-widget-2\";a:0:{}s:15:\"footer-widget-3\";a:0:{}s:13:\"array_version\";i:3;}', 'yes'),
(102, 'widget_pages', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(103, 'widget_calendar', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(104, 'widget_media_audio', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(105, 'widget_media_image', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(106, 'widget_media_gallery', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(107, 'widget_media_video', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(108, 'widget_tag_cloud', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(109, 'widget_nav_menu', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(110, 'widget_custom_html', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(111, 'cron', 'a:5:{i:1539689136;a:1:{s:34:\"wp_privacy_delete_old_export_files\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:6:\"hourly\";s:4:\"args\";a:0:{}s:8:\"interval\";i:3600;}}}i:1539691331;a:1:{s:30:\"wp_scheduled_auto_draft_delete\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:5:\"daily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:86400;}}}i:1539728736;a:3:{s:16:\"wp_version_check\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:10:\"twicedaily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:43200;}}s:17:\"wp_update_plugins\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:10:\"twicedaily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:43200;}}s:16:\"wp_update_themes\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:10:\"twicedaily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:43200;}}}i:1539771978;a:2:{s:19:\"wp_scheduled_delete\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:5:\"daily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:86400;}}s:25:\"delete_expired_transients\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:5:\"daily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:86400;}}}s:7:\"version\";i:2;}', 'yes'),
(112, 'theme_mods_twentyseventeen', 'a:2:{s:18:\"custom_css_post_id\";i:-1;s:16:\"sidebars_widgets\";a:2:{s:4:\"time\";i:1538994692;s:4:\"data\";a:4:{s:19:\"wp_inactive_widgets\";a:0:{}s:9:\"sidebar-1\";a:6:{i:0;s:8:\"search-2\";i:1;s:14:\"recent-posts-2\";i:2;s:17:\"recent-comments-2\";i:3;s:10:\"archives-2\";i:4;s:12:\"categories-2\";i:5;s:6:\"meta-2\";}s:9:\"sidebar-2\";a:0:{}s:9:\"sidebar-3\";a:0:{}}}}', 'yes'),
(116, '_site_transient_update_core', 'O:8:\"stdClass\":4:{s:7:\"updates\";a:1:{i:0;O:8:\"stdClass\":10:{s:8:\"response\";s:6:\"latest\";s:8:\"download\";s:59:\"https://downloads.wordpress.org/release/wordpress-4.9.8.zip\";s:6:\"locale\";s:5:\"en_US\";s:8:\"packages\";O:8:\"stdClass\":5:{s:4:\"full\";s:59:\"https://downloads.wordpress.org/release/wordpress-4.9.8.zip\";s:10:\"no_content\";s:70:\"https://downloads.wordpress.org/release/wordpress-4.9.8-no-content.zip\";s:11:\"new_bundled\";s:71:\"https://downloads.wordpress.org/release/wordpress-4.9.8-new-bundled.zip\";s:7:\"partial\";b:0;s:8:\"rollback\";b:0;}s:7:\"current\";s:5:\"4.9.8\";s:7:\"version\";s:5:\"4.9.8\";s:11:\"php_version\";s:5:\"5.2.4\";s:13:\"mysql_version\";s:3:\"5.0\";s:11:\"new_bundled\";s:3:\"4.7\";s:15:\"partial_version\";s:0:\"\";}}s:12:\"last_checked\";i:1539686271;s:15:\"version_checked\";s:5:\"4.9.8\";s:12:\"translations\";a:0:{}}', 'no'),
(124, 'can_compress_scripts', '1', 'no'),
(139, 'widget_sparkling-social', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(140, 'widget_sparkling_popular_posts', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(141, 'widget_sparkling-cats', 'a:2:{s:12:\"_multiwidget\";i:1;i:3;a:0:{}}', 'yes'),
(148, 'theme_mods_sparkling', 'a:6:{s:18:\"custom_css_post_id\";i:-1;s:12:\"header_image\";s:64:\"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png\";s:16:\"header_textcolor\";s:6:\"dadada\";s:16:\"background_color\";s:6:\"ffffff\";s:18:\"nav_menu_locations\";a:3:{s:7:\"primary\";i:3;s:12:\"footer-links\";i:0;s:11:\"social-menu\";i:0;}s:17:\"header_image_data\";O:8:\"stdClass\":5:{s:13:\"attachment_id\";i:67;s:3:\"url\";s:64:\"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png\";s:13:\"thumbnail_url\";s:64:\"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png\";s:6:\"height\";i:89;s:5:\"width\";i:89;}}', 'yes'),
(150, 'current_theme', 'Sparkling', 'yes'),
(151, 'theme_switched', '', 'yes'),
(152, 'theme_switched_via_customizer', '', 'yes'),
(153, 'customize_stashed_theme_mods', 'a:0:{}', 'no'),
(154, '_site_transient_update_themes', 'O:8:\"stdClass\":4:{s:12:\"last_checked\";i:1539686274;s:7:\"checked\";a:4:{s:9:\"sparkling\";s:5:\"2.4.4\";s:13:\"twentyfifteen\";s:3:\"2.0\";s:15:\"twentyseventeen\";s:3:\"1.7\";s:13:\"twentysixteen\";s:3:\"1.5\";}s:8:\"response\";a:0:{}s:12:\"translations\";a:0:{}}', 'no'),
(162, 'sparkling', 'a:12:{s:19:\"element_color_hover\";s:7:\"#3d5164\";s:13:\"element_color\";s:7:\"#3978f3\";s:25:\"sparkling_slider_checkbox\";i:1;s:26:\"sparkling_slide_categories\";s:1:\"7\";s:30:\"sparkling_slider_link_checkbox\";s:0:\"\";s:11:\"site_layout\";s:14:\"side-pull-left\";s:13:\"sticky_header\";i:1;s:12:\"nav_bg_color\";s:7:\"#3d5164\";s:14:\"nav_link_color\";s:7:\"#ffffff\";s:20:\"nav_item_hover_color\";s:7:\"#ffffff\";s:15:\"nav_dropdown_bg\";s:7:\"#3d5164\";s:10:\"link_color\";s:7:\"#3978f3\";}', 'yes'),
(218, 'nav_menu_options', 'a:2:{i:0;b:0;s:8:\"auto_add\";a:1:{i:0;i:3;}}', 'yes'),
(240, 'sparkling_show_recommended_plugins', 'a:2:{s:25:\"colorlib-login-customizer\";b:0;s:24:\"simple-custom-post-order\";b:0;}', 'yes'),
(250, 'recently_activated', 'a:1:{s:39:\"siteorigin-panels/siteorigin-panels.php\";i:1539064527;}', 'yes'),
(274, 'siteorigin_panels_settings', 'a:0:{}', 'yes'),
(275, 'siteorigin_panels_initial_version', '2.8.2', 'no'),
(276, 'siteorigin_panels_active_version', '2.8.2', 'yes'),
(277, 'widget_siteorigin-panels-post-content', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(278, 'widget_siteorigin-panels-postloop', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(279, 'widget_siteorigin-panels-builder', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
(434, 'category_children', 'a:1:{i:5;a:5:{i:0;i:7;i:1;i:9;i:2;i:10;i:3;i:11;i:4;i:12;}}', 'yes'),
(482, '_site_transient_update_plugins', 'O:8:\"stdClass\":5:{s:12:\"last_checked\";i:1539686275;s:7:\"checked\";a:3:{s:19:\"akismet/akismet.php\";s:5:\"4.0.8\";s:9:\"hello.php\";s:3:\"1.7\";s:50:\"multiple-post-thumbnails/multi-post-thumbnails.php\";s:3:\"1.7\";}s:8:\"response\";a:0:{}s:12:\"translations\";a:0:{}s:9:\"no_update\";a:3:{s:19:\"akismet/akismet.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:21:\"w.org/plugins/akismet\";s:4:\"slug\";s:7:\"akismet\";s:6:\"plugin\";s:19:\"akismet/akismet.php\";s:11:\"new_version\";s:5:\"4.0.8\";s:3:\"url\";s:38:\"https://wordpress.org/plugins/akismet/\";s:7:\"package\";s:56:\"https://downloads.wordpress.org/plugin/akismet.4.0.8.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:59:\"https://ps.w.org/akismet/assets/icon-256x256.png?rev=969272\";s:2:\"1x\";s:59:\"https://ps.w.org/akismet/assets/icon-128x128.png?rev=969272\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:61:\"https://ps.w.org/akismet/assets/banner-772x250.jpg?rev=479904\";}s:11:\"banners_rtl\";a:0:{}}s:9:\"hello.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:25:\"w.org/plugins/hello-dolly\";s:4:\"slug\";s:11:\"hello-dolly\";s:6:\"plugin\";s:9:\"hello.php\";s:11:\"new_version\";s:3:\"1.6\";s:3:\"url\";s:42:\"https://wordpress.org/plugins/hello-dolly/\";s:7:\"package\";s:58:\"https://downloads.wordpress.org/plugin/hello-dolly.1.6.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:63:\"https://ps.w.org/hello-dolly/assets/icon-256x256.jpg?rev=969907\";s:2:\"1x\";s:63:\"https://ps.w.org/hello-dolly/assets/icon-128x128.jpg?rev=969907\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:65:\"https://ps.w.org/hello-dolly/assets/banner-772x250.png?rev=478342\";}s:11:\"banners_rtl\";a:0:{}}s:50:\"multiple-post-thumbnails/multi-post-thumbnails.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:38:\"w.org/plugins/multiple-post-thumbnails\";s:4:\"slug\";s:24:\"multiple-post-thumbnails\";s:6:\"plugin\";s:50:\"multiple-post-thumbnails/multi-post-thumbnails.php\";s:11:\"new_version\";s:3:\"1.7\";s:3:\"url\";s:55:\"https://wordpress.org/plugins/multiple-post-thumbnails/\";s:7:\"package\";s:71:\"https://downloads.wordpress.org/plugin/multiple-post-thumbnails.1.7.zip\";s:5:\"icons\";a:1:{s:7:\"default\";s:75:\"https://s.w.org/plugins/geopattern-icon/multiple-post-thumbnails_d94965.svg\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:78:\"https://ps.w.org/multiple-post-thumbnails/assets/banner-772x250.png?rev=652603\";}s:11:\"banners_rtl\";a:0:{}}}}', 'no'),
(531, '_transient_is_multi_author', '0', 'yes'),
(533, '_transient_sparkling_categories', '2', 'yes'),
(542, '_site_transient_timeout_browser_c91c259fd5f3fa8303f885fec872baad', '1540209028', 'no'),
(543, '_site_transient_browser_c91c259fd5f3fa8303f885fec872baad', 'a:10:{s:4:\"name\";s:6:\"Chrome\";s:7:\"version\";s:13:\"69.0.3497.100\";s:8:\"platform\";s:7:\"Windows\";s:10:\"update_url\";s:29:\"https://www.google.com/chrome\";s:7:\"img_src\";s:43:\"http://s.w.org/images/browsers/chrome.png?1\";s:11:\"img_src_ssl\";s:44:\"https://s.w.org/images/browsers/chrome.png?1\";s:15:\"current_version\";s:2:\"18\";s:7:\"upgrade\";b:0;s:8:\"insecure\";b:0;s:6:\"mobile\";b:0;}', 'no'),
(552, '_site_transient_timeout_theme_roots', '1539688073', 'no'),
(553, '_site_transient_theme_roots', 'a:4:{s:9:\"sparkling\";s:7:\"/themes\";s:13:\"twentyfifteen\";s:7:\"/themes\";s:15:\"twentyseventeen\";s:7:\"/themes\";s:13:\"twentysixteen\";s:7:\"/themes\";}', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `event_postmeta`
--

CREATE TABLE `event_postmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_postmeta`
--

INSERT INTO `event_postmeta` (`meta_id`, `post_id`, `meta_key`, `meta_value`) VALUES
(1, 2, '_wp_page_template', 'page-fullwidth.php'),
(2, 3, '_wp_page_template', 'default'),
(3, 5, '_wp_trash_meta_status', 'publish'),
(4, 5, '_wp_trash_meta_time', '1538994693'),
(5, 2, '_edit_lock', '1538997169:1'),
(6, 6, '_wp_attached_file', '2018/10/header1.jpg'),
(7, 6, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1583;s:6:\"height\";i:492;s:4:\"file\";s:19:\"2018/10/header1.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:19:\"header1-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:18:\"header1-300x93.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:93;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:19:\"header1-768x239.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:239;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:20:\"header1-1024x318.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:318;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:19:\"header1-750x410.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:410;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:20:\"header1-1140x492.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:492;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:17:\"header1-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:5:\"admin\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:10:\"1539015012\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(8, 6, '_wp_attachment_image_alt', 'Header 1 alt text'),
(9, 7, '_wp_attached_file', '2018/10/cropped-header1.jpg'),
(10, 7, '_wp_attachment_context', 'custom-header'),
(11, 7, '_wp_attachment_metadata', 'a:6:{s:5:\"width\";i:1500;s:6:\"height\";i:466;s:4:\"file\";s:27:\"2018/10/cropped-header1.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:27:\"cropped-header1-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:26:\"cropped-header1-300x93.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:93;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:27:\"cropped-header1-768x239.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:239;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:28:\"cropped-header1-1024x318.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:318;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:27:\"cropped-header1-750x410.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:410;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:28:\"cropped-header1-1140x466.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:466;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:25:\"cropped-header1-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}s:17:\"attachment_parent\";i:6;}'),
(14, 8, '_wp_attached_file', '2018/10/header2.jpg'),
(15, 8, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1583;s:6:\"height\";i:492;s:4:\"file\";s:19:\"2018/10/header2.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:19:\"header2-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:18:\"header2-300x93.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:93;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:19:\"header2-768x239.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:239;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:20:\"header2-1024x318.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:318;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:19:\"header2-750x410.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:410;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:20:\"header2-1140x492.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:492;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:17:\"header2-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:5:\"admin\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:10:\"1539015012\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(16, 8, '_wp_attachment_image_alt', 'header2 alt'),
(17, 9, '_wp_attached_file', '2018/10/cropped-header2.jpg'),
(18, 9, '_wp_attachment_context', 'custom-header'),
(19, 9, '_wp_attachment_metadata', 'a:6:{s:5:\"width\";i:1500;s:6:\"height\";i:466;s:4:\"file\";s:27:\"2018/10/cropped-header2.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:27:\"cropped-header2-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:26:\"cropped-header2-300x93.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:93;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:27:\"cropped-header2-768x239.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:239;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:28:\"cropped-header2-1024x318.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:318;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:27:\"cropped-header2-750x410.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:410;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:28:\"cropped-header2-1140x466.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:466;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:25:\"cropped-header2-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}s:17:\"attachment_parent\";i:8;}'),
(22, 10, '_wp_trash_meta_status', 'publish'),
(23, 10, '_wp_trash_meta_time', '1538995377'),
(24, 11, '_edit_lock', '1538995478:1'),
(25, 11, '_wp_trash_meta_status', 'publish'),
(26, 11, '_wp_trash_meta_time', '1538995490'),
(27, 12, '_wp_trash_meta_status', 'publish'),
(28, 12, '_wp_trash_meta_time', '1538995624'),
(29, 13, '_edit_lock', '1538995771:1'),
(30, 13, '_wp_trash_meta_status', 'publish'),
(31, 13, '_wp_trash_meta_time', '1538995777'),
(32, 14, '_wp_trash_meta_status', 'publish'),
(33, 14, '_wp_trash_meta_time', '1538995811'),
(34, 15, '_edit_lock', '1538995916:1'),
(35, 15, '_wp_trash_meta_status', 'publish'),
(36, 15, '_wp_trash_meta_time', '1538995953'),
(37, 2, '_edit_last', '1'),
(39, 17, '_edit_lock', '1538996371:1'),
(40, 17, '_wp_trash_meta_status', 'publish'),
(41, 17, '_wp_trash_meta_time', '1538996387'),
(42, 18, '_wp_attached_file', '2018/10/1-1.png'),
(43, 18, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1488;s:6:\"height\";i:304;s:4:\"file\";s:15:\"2018/10/1-1.png\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:15:\"1-1-150x150.png\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:9:\"image/png\";}s:6:\"medium\";a:4:{s:4:\"file\";s:14:\"1-1-300x61.png\";s:5:\"width\";i:300;s:6:\"height\";i:61;s:9:\"mime-type\";s:9:\"image/png\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:15:\"1-1-768x157.png\";s:5:\"width\";i:768;s:6:\"height\";i:157;s:9:\"mime-type\";s:9:\"image/png\";}s:5:\"large\";a:4:{s:4:\"file\";s:16:\"1-1-1024x209.png\";s:5:\"width\";i:1024;s:6:\"height\";i:209;s:9:\"mime-type\";s:9:\"image/png\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:15:\"1-1-750x304.png\";s:5:\"width\";i:750;s:6:\"height\";i:304;s:9:\"mime-type\";s:9:\"image/png\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:16:\"1-1-1140x304.png\";s:5:\"width\";i:1140;s:6:\"height\";i:304;s:9:\"mime-type\";s:9:\"image/png\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:13:\"1-1-60x60.png\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:9:\"image/png\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(44, 19, '_wp_attached_file', '2018/10/1-5.png'),
(45, 19, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1488;s:6:\"height\";i:304;s:4:\"file\";s:15:\"2018/10/1-5.png\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:15:\"1-5-150x150.png\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:9:\"image/png\";}s:6:\"medium\";a:4:{s:4:\"file\";s:14:\"1-5-300x61.png\";s:5:\"width\";i:300;s:6:\"height\";i:61;s:9:\"mime-type\";s:9:\"image/png\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:15:\"1-5-768x157.png\";s:5:\"width\";i:768;s:6:\"height\";i:157;s:9:\"mime-type\";s:9:\"image/png\";}s:5:\"large\";a:4:{s:4:\"file\";s:16:\"1-5-1024x209.png\";s:5:\"width\";i:1024;s:6:\"height\";i:209;s:9:\"mime-type\";s:9:\"image/png\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:15:\"1-5-750x304.png\";s:5:\"width\";i:750;s:6:\"height\";i:304;s:9:\"mime-type\";s:9:\"image/png\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:16:\"1-5-1140x304.png\";s:5:\"width\";i:1140;s:6:\"height\";i:304;s:9:\"mime-type\";s:9:\"image/png\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:13:\"1-5-60x60.png\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:9:\"image/png\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(46, 20, '_wp_attached_file', '2018/10/1-6.jpg'),
(47, 20, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:728;s:6:\"height\";i:221;s:4:\"file\";s:15:\"2018/10/1-6.jpg\";s:5:\"sizes\";a:3:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:15:\"1-6-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:14:\"1-6-300x91.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:91;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:13:\"1-6-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(50, 22, '_customize_changeset_uuid', 'c56345d5-c7a2-4a4d-824a-da4600f8039f'),
(52, 23, '_customize_changeset_uuid', 'c56345d5-c7a2-4a4d-824a-da4600f8039f'),
(54, 24, '_customize_changeset_uuid', 'c56345d5-c7a2-4a4d-824a-da4600f8039f'),
(55, 25, '_edit_lock', '1538997267:1'),
(57, 26, '_customize_changeset_uuid', 'c56345d5-c7a2-4a4d-824a-da4600f8039f'),
(58, 25, '_wp_trash_meta_status', 'publish'),
(59, 25, '_wp_trash_meta_time', '1538997300'),
(60, 23, '_wp_trash_meta_status', 'publish'),
(61, 23, '_wp_trash_meta_time', '1538997335'),
(62, 23, '_wp_desired_post_slug', 's'),
(63, 2, '_wp_trash_meta_status', 'publish'),
(64, 2, '_wp_trash_meta_time', '1538997335'),
(65, 2, '_wp_desired_post_slug', 'sample-page'),
(66, 24, '_wp_trash_meta_status', 'publish'),
(67, 24, '_wp_trash_meta_time', '1538997335'),
(68, 24, '_wp_desired_post_slug', 'sample-page-2'),
(69, 22, '_edit_lock', '1538997242:1'),
(70, 22, '_edit_last', '1'),
(71, 22, '_wp_page_template', 'default'),
(72, 22, '_wp_trash_meta_status', 'publish'),
(73, 22, '_wp_trash_meta_time', '1538997503'),
(74, 22, '_wp_desired_post_slug', 'carousel-html'),
(75, 32, '_edit_last', '1'),
(76, 32, '_edit_lock', '1539000410:1'),
(77, 32, '_wp_page_template', 'default'),
(78, 26, '_edit_lock', '1539261969:1'),
(80, 34, '_wp_trash_meta_status', 'publish'),
(81, 34, '_wp_trash_meta_time', '1539000354'),
(82, 26, '_edit_last', '1'),
(83, 26, '_wp_page_template', 'custom-home.php'),
(84, 32, '_wp_trash_meta_status', 'publish'),
(85, 32, '_wp_trash_meta_time', '1539000573'),
(86, 32, '_wp_desired_post_slug', 'post-page'),
(87, 35, '_edit_last', '1'),
(88, 35, '_edit_lock', '1539000444:1'),
(89, 35, '_wp_page_template', 'default'),
(90, 38, '_menu_item_type', 'post_type'),
(91, 38, '_menu_item_menu_item_parent', '0'),
(92, 38, '_menu_item_object_id', '26'),
(93, 38, '_menu_item_object', 'page'),
(94, 38, '_menu_item_target', ''),
(95, 38, '_menu_item_classes', 'a:1:{i:0;s:0:\"\";}'),
(96, 38, '_menu_item_xfn', ''),
(97, 38, '_menu_item_url', ''),
(115, 39, '_wp_trash_meta_status', 'publish'),
(116, 39, '_wp_trash_meta_time', '1539001102'),
(141, 42, '_wp_trash_meta_status', 'publish'),
(142, 42, '_wp_trash_meta_time', '1539001139'),
(143, 46, '_wp_trash_meta_status', 'publish'),
(144, 46, '_wp_trash_meta_time', '1539001173'),
(146, 47, '_customize_changeset_uuid', '1a94d6ed-5a02-4c42-9c1d-bfd29d85d7fe'),
(147, 48, '_edit_lock', '1539001269:1'),
(149, 49, '_customize_changeset_uuid', '1a94d6ed-5a02-4c42-9c1d-bfd29d85d7fe'),
(151, 50, '_customize_changeset_uuid', '1a94d6ed-5a02-4c42-9c1d-bfd29d85d7fe'),
(160, 53, '_menu_item_type', 'post_type'),
(161, 53, '_menu_item_menu_item_parent', '0'),
(162, 53, '_menu_item_object_id', '49'),
(163, 53, '_menu_item_object', 'page'),
(164, 53, '_menu_item_target', ''),
(165, 53, '_menu_item_classes', 'a:1:{i:0;s:0:\"\";}'),
(166, 53, '_menu_item_xfn', ''),
(167, 53, '_menu_item_url', ''),
(168, 55, '_menu_item_type', 'post_type'),
(169, 55, '_menu_item_menu_item_parent', '0'),
(170, 55, '_menu_item_object_id', '50'),
(171, 55, '_menu_item_object', 'page'),
(172, 55, '_menu_item_target', ''),
(173, 55, '_menu_item_classes', 'a:1:{i:0;s:0:\"\";}'),
(174, 55, '_menu_item_xfn', ''),
(175, 55, '_menu_item_url', ''),
(176, 57, '_menu_item_type', 'post_type'),
(177, 57, '_menu_item_menu_item_parent', '0'),
(178, 57, '_menu_item_object_id', '47'),
(179, 57, '_menu_item_object', 'page'),
(180, 57, '_menu_item_target', ''),
(181, 57, '_menu_item_classes', 'a:1:{i:0;s:0:\"\";}'),
(182, 57, '_menu_item_xfn', ''),
(183, 57, '_menu_item_url', ''),
(200, 48, '_wp_trash_meta_status', 'publish'),
(201, 48, '_wp_trash_meta_time', '1539001283'),
(202, 60, '_edit_lock', '1539001333:1'),
(203, 60, '_wp_trash_meta_status', 'publish'),
(204, 60, '_wp_trash_meta_time', '1539001342'),
(205, 61, '_wp_trash_meta_status', 'publish'),
(206, 61, '_wp_trash_meta_time', '1539001359'),
(207, 62, '_wp_trash_meta_status', 'publish'),
(208, 62, '_wp_trash_meta_time', '1539003476'),
(209, 63, '_edit_lock', '1539003580:1'),
(210, 63, '_wp_trash_meta_status', 'publish'),
(211, 63, '_wp_trash_meta_time', '1539003610'),
(212, 64, '_wp_trash_meta_status', 'publish'),
(213, 64, '_wp_trash_meta_time', '1539003658'),
(214, 65, '_wp_trash_meta_status', 'publish'),
(215, 65, '_wp_trash_meta_time', '1539003699'),
(216, 66, '_wp_attached_file', '2018/10/g1.png'),
(217, 66, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:99;s:6:\"height\";i:99;s:4:\"file\";s:14:\"2018/10/g1.png\";s:5:\"sizes\";a:1:{s:9:\"tab-small\";a:4:{s:4:\"file\";s:12:\"g1-60x60.png\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:9:\"image/png\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(218, 67, '_wp_attached_file', '2018/10/cropped-g1.png'),
(219, 67, '_wp_attachment_context', 'custom-header'),
(220, 67, '_wp_attachment_metadata', 'a:6:{s:5:\"width\";i:89;s:6:\"height\";i:89;s:4:\"file\";s:22:\"2018/10/cropped-g1.png\";s:5:\"sizes\";a:1:{s:9:\"tab-small\";a:4:{s:4:\"file\";s:20:\"cropped-g1-60x60.png\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:9:\"image/png\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}s:17:\"attachment_parent\";i:66;}'),
(221, 67, '_wp_attachment_custom_header_last_used_sparkling', '1539005139'),
(222, 67, '_wp_attachment_is_custom_header', 'sparkling'),
(223, 68, '_wp_trash_meta_status', 'publish'),
(224, 68, '_wp_trash_meta_time', '1539005139'),
(225, 76, 'panels_data', 'a:3:{s:7:\"widgets\";a:0:{}s:5:\"grids\";a:2:{i:0;a:5:{s:5:\"cells\";i:1;s:5:\"style\";a:4:{s:10:\"background\";s:4:\"#ccc\";s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:14:\"cell_alignment\";s:10:\"flex-start\";}s:5:\"ratio\";i:1;s:15:\"ratio_direction\";s:5:\"right\";s:11:\"color_label\";i:3;}i:1;a:2:{s:5:\"cells\";i:2;s:5:\"style\";a:3:{s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:14:\"cell_alignment\";s:10:\"flex-start\";}}}s:10:\"grid_cells\";a:3:{i:0;a:4:{s:4:\"grid\";i:0;s:5:\"index\";i:0;s:6:\"weight\";i:1;s:5:\"style\";a:3:{s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:18:\"vertical_alignment\";s:4:\"auto\";}}i:1;a:4:{s:4:\"grid\";i:1;s:5:\"index\";i:0;s:6:\"weight\";d:0.5;s:5:\"style\";a:0:{}}i:2;a:4:{s:4:\"grid\";i:1;s:5:\"index\";i:1;s:6:\"weight\";d:0.5;s:5:\"style\";a:3:{s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:18:\"vertical_alignment\";s:4:\"auto\";}}}}'),
(226, 26, 'panels_data', 'a:3:{s:7:\"widgets\";a:0:{}s:5:\"grids\";a:2:{i:0;a:5:{s:5:\"cells\";i:1;s:5:\"style\";a:4:{s:10:\"background\";s:4:\"#ccc\";s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:14:\"cell_alignment\";s:10:\"flex-start\";}s:5:\"ratio\";i:1;s:15:\"ratio_direction\";s:5:\"right\";s:11:\"color_label\";i:3;}i:1;a:2:{s:5:\"cells\";i:2;s:5:\"style\";a:3:{s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:14:\"cell_alignment\";s:10:\"flex-start\";}}}s:10:\"grid_cells\";a:3:{i:0;a:4:{s:4:\"grid\";i:0;s:5:\"index\";i:0;s:6:\"weight\";i:1;s:5:\"style\";a:3:{s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:18:\"vertical_alignment\";s:4:\"auto\";}}i:1;a:4:{s:4:\"grid\";i:1;s:5:\"index\";i:0;s:6:\"weight\";d:0.5;s:5:\"style\";a:0:{}}i:2;a:4:{s:4:\"grid\";i:1;s:5:\"index\";i:1;s:6:\"weight\";d:0.5;s:5:\"style\";a:3:{s:27:\"background_image_attachment\";b:0;s:18:\"background_display\";s:4:\"tile\";s:18:\"vertical_alignment\";s:4:\"auto\";}}}}'),
(227, 78, '_wp_trash_meta_status', 'publish'),
(228, 78, '_wp_trash_meta_time', '1539078043'),
(229, 47, '_edit_lock', '1539149806:1'),
(230, 80, '_edit_last', '1'),
(231, 80, '_edit_lock', '1539149943:1'),
(232, 80, '_wp_page_template', 'default'),
(234, 85, '_wp_attached_file', '2018/10/1.jpg'),
(235, 85, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1581;s:6:\"height\";i:398;s:4:\"file\";s:13:\"2018/10/1.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:13:\"1-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:12:\"1-300x76.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:76;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:13:\"1-768x193.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:193;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:14:\"1-1024x258.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:258;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:13:\"1-750x398.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:398;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:14:\"1-1140x398.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:398;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:11:\"1-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(236, 86, '_edit_last', '1'),
(237, 86, '_edit_lock', '1539153090:1'),
(238, 87, '_edit_last', '1'),
(239, 87, '_edit_lock', '1539584391:1'),
(240, 87, '_thumbnail_id', '114'),
(243, 83, '_customize_restore_dismissed', '1'),
(244, 89, '_wp_trash_meta_status', 'publish'),
(245, 89, '_wp_trash_meta_time', '1539153379'),
(246, 90, '_edit_last', '1'),
(247, 90, '_edit_lock', '1539584413:1'),
(248, 91, '_wp_attached_file', '2018/10/2.jpg'),
(249, 91, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1581;s:6:\"height\";i:397;s:4:\"file\";s:13:\"2018/10/2.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:13:\"2-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:12:\"2-300x75.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:75;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:13:\"2-768x193.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:193;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:14:\"2-1024x257.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:257;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:13:\"2-750x397.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:397;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:14:\"2-1140x397.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:397;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:11:\"2-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(250, 90, '_thumbnail_id', '114'),
(257, 95, '_edit_last', '1'),
(258, 95, '_thumbnail_id', '114'),
(261, 95, '_edit_lock', '1539584483:1'),
(262, 1, '_edit_lock', '1539262135:1'),
(263, 26, 'site_layout', 'full-width'),
(264, 98, '_edit_last', '1'),
(265, 98, '_edit_lock', '1539320097:1'),
(266, 99, '_wp_attached_file', '2018/10/1-1-3.jpg'),
(267, 99, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:350;s:6:\"height\";i:213;s:4:\"file\";s:17:\"2018/10/1-1-3.jpg\";s:5:\"sizes\";a:3:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:17:\"1-1-3-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:17:\"1-1-3-300x183.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:183;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:15:\"1-1-3-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(268, 99, '_wp_attachment_image_alt', 'exibition event 1 ifeat image alt txt'),
(269, 98, '_thumbnail_id', '99'),
(272, 101, '_edit_last', '1'),
(273, 101, '_edit_lock', '1539320118:1'),
(274, 102, '_wp_attached_file', '2018/10/2ndimage1.jpg'),
(275, 102, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:728;s:6:\"height\";i:440;s:4:\"file\";s:21:\"2018/10/2ndimage1.jpg\";s:5:\"sizes\";a:4:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:21:\"2ndimage1-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:21:\"2ndimage1-300x181.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:181;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:21:\"2ndimage1-728x410.jpg\";s:5:\"width\";i:728;s:6:\"height\";i:410;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:19:\"2ndimage1-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}'),
(276, 102, '_wp_attachment_image_alt', 'exibition2 event alt text'),
(277, 101, '_thumbnail_id', '102'),
(280, 107, '_edit_last', '1'),
(281, 107, '_edit_lock', '1539433083:1'),
(284, 109, '_edit_last', '1'),
(285, 109, '_edit_lock', '1539433014:1'),
(288, 111, '_edit_last', '1'),
(289, 111, '_edit_lock', '1539432555:1'),
(290, 111, 'post_secondary-image_thumbnail_id', '19'),
(293, 109, 'post_secondary-image_thumbnail_id', '18'),
(294, 107, 'post_secondary-image_thumbnail_id', '20'),
(295, 114, '_wp_attached_file', '2018/10/exhibition-banner.jpg'),
(296, 114, '_wp_attachment_metadata', 'a:5:{s:5:\"width\";i:1581;s:6:\"height\";i:496;s:4:\"file\";s:29:\"2018/10/exhibition-banner.jpg\";s:5:\"sizes\";a:7:{s:9:\"thumbnail\";a:4:{s:4:\"file\";s:29:\"exhibition-banner-150x150.jpg\";s:5:\"width\";i:150;s:6:\"height\";i:150;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:6:\"medium\";a:4:{s:4:\"file\";s:28:\"exhibition-banner-300x94.jpg\";s:5:\"width\";i:300;s:6:\"height\";i:94;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:12:\"medium_large\";a:4:{s:4:\"file\";s:29:\"exhibition-banner-768x241.jpg\";s:5:\"width\";i:768;s:6:\"height\";i:241;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:5:\"large\";a:4:{s:4:\"file\";s:30:\"exhibition-banner-1024x321.jpg\";s:5:\"width\";i:1024;s:6:\"height\";i:321;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:18:\"sparkling-featured\";a:4:{s:4:\"file\";s:29:\"exhibition-banner-750x410.jpg\";s:5:\"width\";i:750;s:6:\"height\";i:410;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:28:\"sparkling-featured-fullwidth\";a:4:{s:4:\"file\";s:30:\"exhibition-banner-1140x496.jpg\";s:5:\"width\";i:1140;s:6:\"height\";i:496;s:9:\"mime-type\";s:10:\"image/jpeg\";}s:9:\"tab-small\";a:4:{s:4:\"file\";s:27:\"exhibition-banner-60x60.jpg\";s:5:\"width\";i:60;s:6:\"height\";i:60;s:9:\"mime-type\";s:10:\"image/jpeg\";}}s:10:\"image_meta\";a:12:{s:8:\"aperture\";s:1:\"0\";s:6:\"credit\";s:0:\"\";s:6:\"camera\";s:0:\"\";s:7:\"caption\";s:0:\"\";s:17:\"created_timestamp\";s:1:\"0\";s:9:\"copyright\";s:0:\"\";s:12:\"focal_length\";s:1:\"0\";s:3:\"iso\";s:1:\"0\";s:13:\"shutter_speed\";s:1:\"0\";s:5:\"title\";s:0:\"\";s:11:\"orientation\";s:1:\"0\";s:8:\"keywords\";a:0:{}}}');

-- --------------------------------------------------------

--
-- Table structure for table `event_posts`
--

CREATE TABLE `event_posts` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `post_author` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `post_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_date_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'publish',
  `comment_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `ping_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `post_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `post_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `to_ping` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pinged` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_modified_gmt` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_content_filtered` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_parent` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `guid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `menu_order` int(11) NOT NULL DEFAULT '0',
  `post_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'post',
  `post_mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `comment_count` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_posts`
--

INSERT INTO `event_posts` (`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`) VALUES
(1, 1, '2018-10-08 10:25:34', '2018-10-08 10:25:34', 'Welcome to WordPress. This is your first post. Edit or delete it, then start writing!', 'Hello world!', '', 'publish', 'open', 'open', '', 'hello-world', '', '', '2018-10-08 10:25:34', '2018-10-08 10:25:34', '', 0, 'http://10.0.1.84/event/?p=1', 0, 'post', '', 1),
(2, 1, '2018-10-08 10:25:34', '2018-10-08 10:25:34', 'This is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\n&nbsp;\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!', 'Sample Page', '', 'trash', 'closed', 'open', '', 'sample-page__trashed', '', '', '2018-10-08 11:15:35', '2018-10-08 11:15:35', '', 0, 'http://10.0.1.84/event/?page_id=2', 0, 'page', '', 0),
(3, 1, '2018-10-08 10:25:34', '2018-10-08 10:25:34', '<h2>Who we are</h2><p>Our website address is: http://10.0.1.84/event.</p><h2>What personal data we collect and why we collect it</h2><h3>Comments</h3><p>When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor&#8217;s IP address and browser user agent string to help spam detection.</p><p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p><h3>Media</h3><p>If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p><h3>Contact forms</h3><h3>Cookies</h3><p>If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p><p>If you have an account and you log in to this site, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</p><p>When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select &quot;Remember Me&quot;, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</p><p>If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.</p><h3>Embedded content from other websites</h3><p>Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p><p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p><h3>Analytics</h3><h2>Who we share your data with</h2><h2>How long we retain your data</h2><p>If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.</p><p>For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.</p><h2>What rights you have over your data</h2><p>If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p><h2>Where we send your data</h2><p>Visitor comments may be checked through an automated spam detection service.</p><h2>Your contact information</h2><h2>Additional information</h2><h3>How we protect your data</h3><h3>What data breach procedures we have in place</h3><h3>What third parties we receive data from</h3><h3>What automated decision making and/or profiling we do with user data</h3><h3>Industry regulatory disclosure requirements</h3>', 'Privacy Policy', '', 'draft', 'closed', 'open', '', 'privacy-policy', '', '', '2018-10-08 10:25:34', '2018-10-08 10:25:34', '', 0, 'http://10.0.1.84/event/?page_id=3', 0, 'page', '', 0),
(5, 1, '2018-10-08 10:31:32', '2018-10-08 10:31:32', '{\n    \"old_sidebars_widgets_data\": {\n        \"value\": {\n            \"wp_inactive_widgets\": [],\n            \"sidebar-1\": [\n                \"search-2\",\n                \"recent-posts-2\",\n                \"recent-comments-2\",\n                \"archives-2\",\n                \"categories-2\",\n                \"meta-2\"\n            ],\n            \"sidebar-2\": [],\n            \"sidebar-3\": []\n        },\n        \"type\": \"global_variable\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:31:32\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '985f37ba-2ab5-44e1-8e84-880b6ff459ee', '', '', '2018-10-08 10:31:32', '2018-10-08 10:31:32', '', 0, 'http://10.0.1.84/event/2018/10/08/985f37ba-2ab5-44e1-8e84-880b6ff459ee/', 0, 'customize_changeset', '', 0),
(6, 1, '2018-10-08 10:41:15', '2018-10-08 10:41:15', 'Header1 description', 'Header1', 'Header1 caption', 'inherit', 'open', 'closed', '', 'header1', '', '', '2018-10-08 10:41:52', '2018-10-08 10:41:52', '', 0, 'http://10.0.1.84/event/wp-content/uploads/2018/10/header1.jpg', 0, 'attachment', 'image/jpeg', 0),
(7, 1, '2018-10-08 10:41:58', '2018-10-08 10:41:58', '', 'cropped-header1.jpg', '', 'inherit', 'open', 'closed', '', 'cropped-header1-jpg', '', '', '2018-10-08 10:41:58', '2018-10-08 10:41:58', '', 0, 'http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header1.jpg', 0, 'attachment', 'image/jpeg', 0),
(8, 1, '2018-10-08 10:42:32', '2018-10-08 10:42:32', 'header2 description', 'header2', 'header2 caption', 'inherit', 'open', 'closed', '', 'header2', '', '', '2018-10-08 10:42:48', '2018-10-08 10:42:48', '', 0, 'http://10.0.1.84/event/wp-content/uploads/2018/10/header2.jpg', 0, 'attachment', 'image/jpeg', 0),
(9, 1, '2018-10-08 10:42:53', '2018-10-08 10:42:53', '', 'cropped-header2.jpg', '', 'inherit', 'open', 'closed', '', 'cropped-header2-jpg', '', '', '2018-10-08 10:42:53', '2018-10-08 10:42:53', '', 0, 'http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header2.jpg', 0, 'attachment', 'image/jpeg', 0),
(10, 1, '2018-10-08 10:42:57', '2018-10-08 10:42:57', '{\n    \"sparkling::header_image\": {\n        \"value\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header2.jpg\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:42:57\"\n    },\n    \"sparkling::header_image_data\": {\n        \"value\": {\n            \"url\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header2.jpg\",\n            \"thumbnail_url\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header2.jpg\",\n            \"timestamp\": 1538995374353,\n            \"attachment_id\": 9,\n            \"width\": 1500,\n            \"height\": 466\n        },\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:42:57\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'ba85ccc7-23d5-48db-af30-5a1b011f2c96', '', '', '2018-10-08 10:42:57', '2018-10-08 10:42:57', '', 0, 'http://10.0.1.84/event/2018/10/08/ba85ccc7-23d5-48db-af30-5a1b011f2c96/', 0, 'customize_changeset', '', 0),
(11, 1, '2018-10-08 10:44:50', '2018-10-08 10:44:50', '{\n    \"sparkling::header_image\": {\n        \"value\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header1.jpg\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:44:03\"\n    },\n    \"sparkling::header_image_data\": {\n        \"value\": {\n            \"url\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header1.jpg\",\n            \"thumbnail_url\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-header1.jpg\",\n            \"timestamp\": 1538995319334,\n            \"attachment_id\": 7,\n            \"width\": 1500,\n            \"height\": 466\n        },\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:44:03\"\n    },\n    \"show_on_front\": {\n        \"value\": \"page\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:44:50\"\n    },\n    \"page_on_front\": {\n        \"value\": \"2\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:44:50\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '8f8dbba3-eb68-44e4-9244-cdb10b289d92', '', '', '2018-10-08 10:44:50', '2018-10-08 10:44:50', '', 0, 'http://10.0.1.84/event/?p=11', 0, 'customize_changeset', '', 0),
(12, 1, '2018-10-08 10:47:04', '2018-10-08 10:47:04', '{\n    \"sparkling::header_image\": {\n        \"value\": \"remove-header\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:47:04\"\n    },\n    \"sparkling::header_image_data\": {\n        \"value\": \"remove-header\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:47:04\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'ccd9e3aa-d0b6-4b7b-8f5c-10c633b144b6', '', '', '2018-10-08 10:47:04', '2018-10-08 10:47:04', '', 0, 'http://10.0.1.84/event/2018/10/08/ccd9e3aa-d0b6-4b7b-8f5c-10c633b144b6/', 0, 'customize_changeset', '', 0),
(13, 1, '2018-10-08 10:49:36', '2018-10-08 10:49:36', '{\n    \"sparkling[element_color_hover]\": {\n        \"value\": \"#3d5164\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:49:30\"\n    },\n    \"sparkling[element_color]\": {\n        \"value\": \"#3978f3\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:49:30\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '01762e7d-6a89-4cb5-bf5b-6abe2acf6b40', '', '', '2018-10-08 10:49:36', '2018-10-08 10:49:36', '', 0, 'http://10.0.1.84/event/?p=13', 0, 'customize_changeset', '', 0),
(14, 1, '2018-10-08 10:50:11', '2018-10-08 10:50:11', '{\n    \"sparkling[sparkling_slider_checkbox]\": {\n        \"value\": true,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:50:11\"\n    },\n    \"sparkling[sparkling_slide_categories]\": {\n        \"value\": \"1\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:50:11\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '9101919c-a370-40d0-8e69-8bf5fa7c79bb', '', '', '2018-10-08 10:50:11', '2018-10-08 10:50:11', '', 0, 'http://10.0.1.84/event/2018/10/08/9101919c-a370-40d0-8e69-8bf5fa7c79bb/', 0, 'customize_changeset', '', 0),
(15, 1, '2018-10-08 10:52:33', '2018-10-08 10:52:33', '{\n    \"sparkling::header_textcolor\": {\n        \"value\": \"#dadada\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:51:38\"\n    },\n    \"sparkling::background_color\": {\n        \"value\": \"#f2f2f2\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:51:38\"\n    },\n    \"sparkling[sparkling_slider_link_checkbox]\": {\n        \"value\": true,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:52:33\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'e8beac28-0d41-4593-aa24-64110cfb28cb', '', '', '2018-10-08 10:52:33', '2018-10-08 10:52:33', '', 0, 'http://10.0.1.84/event/?p=15', 0, 'customize_changeset', '', 0),
(16, 1, '2018-10-08 10:53:08', '2018-10-08 10:53:08', 'This is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!', 'Sample Page', '', 'inherit', 'closed', 'closed', '', '2-revision-v1', '', '', '2018-10-08 10:53:08', '2018-10-08 10:53:08', '', 2, 'http://10.0.1.84/event/2018/10/08/2-revision-v1/', 0, 'revision', '', 0),
(17, 1, '2018-10-08 10:59:46', '2018-10-08 10:59:46', '{\n    \"sidebars_widgets[home-widget-1]\": {\n        \"value\": [],\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:57:15\"\n    },\n    \"widget_sparkling-cats[3]\": {\n        \"value\": [],\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 10:57:15\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'd141441a-513d-4d23-8cf6-ad3b60f6570b', '', '', '2018-10-08 10:59:46', '2018-10-08 10:59:46', '', 0, 'http://10.0.1.84/event/?p=17', 0, 'customize_changeset', '', 0),
(18, 1, '2018-10-08 11:01:27', '2018-10-08 11:01:27', '', '1-1', 'Header 3', 'inherit', 'open', 'closed', '', '1-1', '', '', '2018-10-10 07:37:21', '2018-10-10 07:37:21', '', 2, 'http://10.0.1.84/event/wp-content/uploads/2018/10/1-1.png', 0, 'attachment', 'image/png', 0),
(19, 1, '2018-10-08 11:01:28', '2018-10-08 11:01:28', '', '1-5', '', 'inherit', 'open', 'closed', '', '1-5', '', '', '2018-10-08 11:01:28', '2018-10-08 11:01:28', '', 2, 'http://10.0.1.84/event/wp-content/uploads/2018/10/1-5.png', 0, 'attachment', 'image/png', 0),
(20, 1, '2018-10-08 11:01:29', '2018-10-08 11:01:29', '', '1-6', '', 'inherit', 'open', 'closed', '', '1-6', '', '', '2018-10-08 11:01:29', '2018-10-08 11:01:29', '', 2, 'http://10.0.1.84/event/wp-content/uploads/2018/10/1-6.jpg', 0, 'attachment', 'image/jpeg', 0),
(21, 1, '2018-10-08 11:12:05', '2018-10-08 11:12:05', 'This is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\n&nbsp;\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!\r\n\r\nThis is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:\r\n<blockquote>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like piña coladas. (And gettin\' caught in the rain.)</blockquote>\r\n...or something like this:\r\n<blockquote>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</blockquote>\r\nAs a new WordPress user, you should go to <a href=\"http://10.0.1.84/event/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!', 'Sample Page', '', 'inherit', 'closed', 'closed', '', '2-revision-v1', '', '', '2018-10-08 11:12:05', '2018-10-08 11:12:05', '', 2, 'http://10.0.1.84/event/2018/10/08/2-revision-v1/', 0, 'revision', '', 0),
(22, 1, '2018-10-08 11:14:59', '2018-10-08 11:14:59', '<div id=\"primary\" class=\"content-area\">\r\n<div class=\"container-fluid\">\r\n<h2>Carousel Example</h2>\r\n<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\"><!-- Indicators -->\r\n<ol class=\"carousel-indicators\">\r\n 	<li class=\"active\" data-target=\"#myCarousel\" data-slide-to=\"0\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n</ol>\r\n<!-- Wrapper for slides -->\r\n<div class=\"carousel-inner\">\r\n<div class=\"item active\"><img style=\"width: 100%;\" src=\"1.jpg\" alt=\"Los Angeles\" /></div>\r\n<div class=\"item\"><img style=\"width: 100%;\" src=\"2.jpg\" alt=\"Chicago\" /></div>\r\n<div class=\"item\"><img style=\"width: 100%;\" src=\"3.jpg\" alt=\"New york\" /></div>\r\n</div>\r\n<!-- Left and right controls -->\r\n<a class=\"left carousel-control\" href=\"#myCarousel\" data-slide=\"prev\">\r\n\r\n<span class=\"sr-only\">Previous</span>\r\n</a>\r\n<a class=\"right carousel-control\" href=\"#myCarousel\" data-slide=\"next\">\r\n\r\n<span class=\"sr-only\">Next</span>\r\n</a>\r\n\r\n</div>\r\n</div>\r\n</div>', 'carousel.html', '', 'trash', 'closed', 'closed', '', 'carousel-html__trashed', '', '', '2018-10-08 11:18:23', '2018-10-08 11:18:23', '', 0, 'http://10.0.1.84/event/?page_id=22', 0, 'page', '', 0),
(23, 1, '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 's', '', 'trash', 'closed', 'closed', '', 's__trashed', '', '', '2018-10-08 11:15:35', '2018-10-08 11:15:35', '', 0, 'http://10.0.1.84/event/?page_id=23', 0, 'page', '', 0),
(24, 1, '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 'Sample Page', '', 'trash', 'closed', 'closed', '', 'sample-page-2__trashed', '', '', '2018-10-08 11:15:35', '2018-10-08 11:15:35', '', 0, 'http://10.0.1.84/event/?page_id=24', 0, 'page', '', 0),
(25, 1, '2018-10-08 11:14:59', '2018-10-08 11:14:59', '{\n    \"page_on_front\": {\n        \"value\": \"26\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 11:14:59\"\n    },\n    \"nav_menus_created_posts\": {\n        \"value\": [\n            22,\n            23,\n            24,\n            26\n        ],\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 11:14:59\"\n    },\n    \"sparkling[sparkling_slider_checkbox]\": {\n        \"value\": false,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 11:14:59\"\n    },\n    \"sparkling[sparkling_slider_link_checkbox]\": {\n        \"value\": false,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 11:14:59\"\n    },\n    \"sparkling[site_layout]\": {\n        \"value\": \"full-width\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 11:14:59\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'c56345d5-c7a2-4a4d-824a-da4600f8039f', '', '', '2018-10-08 11:14:59', '2018-10-08 11:14:59', '', 0, 'http://10.0.1.84/event/?p=25', 0, 'customize_changeset', '', 0),
(26, 1, '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 'Home', '', 'publish', 'closed', 'closed', '', 'sample-page-3', '', '', '2018-10-11 11:31:19', '2018-10-11 11:31:19', '', 0, 'http://10.0.1.84/event/?page_id=26', 0, 'page', '', 0),
(27, 1, '2018-10-08 11:14:59', '2018-10-08 11:14:59', '', 'carousel.html', '', 'inherit', 'closed', 'closed', '', '22-revision-v1', '', '', '2018-10-08 11:14:59', '2018-10-08 11:14:59', '', 22, 'http://10.0.1.84/event/2018/10/08/22-revision-v1/', 0, 'revision', '', 0),
(28, 1, '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 's', '', 'inherit', 'closed', 'closed', '', '23-revision-v1', '', '', '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 23, 'http://10.0.1.84/event/2018/10/08/23-revision-v1/', 0, 'revision', '', 0),
(29, 1, '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 'Sample Page', '', 'inherit', 'closed', 'closed', '', '24-revision-v1', '', '', '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 24, 'http://10.0.1.84/event/2018/10/08/24-revision-v1/', 0, 'revision', '', 0),
(30, 1, '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 'Sample Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-08 11:15:00', '2018-10-08 11:15:00', '', 26, 'http://10.0.1.84/event/2018/10/08/26-revision-v1/', 0, 'revision', '', 0),
(31, 1, '2018-10-08 11:16:18', '2018-10-08 11:16:18', '<div id=\"primary\" class=\"content-area\">\r\n<div class=\"container-fluid\">\r\n<h2>Carousel Example</h2>\r\n<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\"><!-- Indicators -->\r\n<ol class=\"carousel-indicators\">\r\n 	<li class=\"active\" data-target=\"#myCarousel\" data-slide-to=\"0\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n</ol>\r\n<!-- Wrapper for slides -->\r\n<div class=\"carousel-inner\">\r\n<div class=\"item active\"><img style=\"width: 100%;\" src=\"1.jpg\" alt=\"Los Angeles\" /></div>\r\n<div class=\"item\"><img style=\"width: 100%;\" src=\"2.jpg\" alt=\"Chicago\" /></div>\r\n<div class=\"item\"><img style=\"width: 100%;\" src=\"3.jpg\" alt=\"New york\" /></div>\r\n</div>\r\n<!-- Left and right controls -->\r\n<a class=\"left carousel-control\" href=\"#myCarousel\" data-slide=\"prev\">\r\n\r\n<span class=\"sr-only\">Previous</span>\r\n</a>\r\n<a class=\"right carousel-control\" href=\"#myCarousel\" data-slide=\"next\">\r\n\r\n<span class=\"sr-only\">Next</span>\r\n</a>\r\n\r\n</div>\r\n</div>\r\n</div>', 'carousel.html', '', 'inherit', 'closed', 'closed', '', '22-revision-v1', '', '', '2018-10-08 11:16:18', '2018-10-08 11:16:18', '', 22, 'http://10.0.1.84/event/2018/10/08/22-revision-v1/', 0, 'revision', '', 0),
(32, 1, '2018-10-08 12:02:32', '2018-10-08 12:02:32', '', 'Post Page', '', 'trash', 'closed', 'closed', '', 'post-page__trashed', '', '', '2018-10-08 12:09:33', '2018-10-08 12:09:33', '', 26, 'http://10.0.1.84/event/?page_id=32', 0, 'page', '', 0),
(33, 1, '2018-10-08 12:02:32', '2018-10-08 12:02:32', '', 'Post Page', '', 'inherit', 'closed', 'closed', '', '32-revision-v1', '', '', '2018-10-08 12:02:32', '2018-10-08 12:02:32', '', 32, 'http://10.0.1.84/event/2018/10/08/32-revision-v1/', 0, 'revision', '', 0),
(34, 1, '2018-10-08 12:05:53', '2018-10-08 12:05:53', '{\n    \"sparkling[site_layout]\": {\n        \"value\": \"side-pull-left\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:05:53\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '66406d50-3f3f-4ee8-bd03-425adf477064', '', '', '2018-10-08 12:05:53', '2018-10-08 12:05:53', '', 0, 'http://10.0.1.84/event/2018/10/08/66406d50-3f3f-4ee8-bd03-425adf477064/', 0, 'customize_changeset', '', 0),
(35, 1, '2018-10-08 12:09:46', '2018-10-08 12:09:46', '', 'Post Page', '', 'publish', 'closed', 'closed', '', 'post-page', '', '', '2018-10-08 12:09:46', '2018-10-08 12:09:46', '', 26, 'http://10.0.1.84/event/?page_id=35', 0, 'page', '', 0),
(36, 1, '2018-10-08 12:09:46', '2018-10-08 12:09:46', '', 'Post Page', '', 'inherit', 'closed', 'closed', '', '35-revision-v1', '', '', '2018-10-08 12:09:46', '2018-10-08 12:09:46', '', 35, 'http://10.0.1.84/event/2018/10/08/35-revision-v1/', 0, 'revision', '', 0),
(37, 1, '2018-10-08 12:12:20', '2018-10-08 12:12:20', '', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-08 12:12:20', '2018-10-08 12:12:20', '', 26, 'http://10.0.1.84/event/2018/10/08/26-revision-v1/', 0, 'revision', '', 0),
(38, 1, '2018-10-08 12:15:44', '2018-10-08 12:15:44', '', 'Events', '', 'publish', 'closed', 'closed', '', '38', '', '', '2018-10-08 12:21:23', '2018-10-08 12:21:23', '', 0, 'http://10.0.1.84/event/?p=38', 2, 'nav_menu_item', '', 0),
(39, 1, '2018-10-08 12:18:21', '2018-10-08 12:18:21', '{\n    \"nav_menu[-1607180563]\": {\n        \"value\": {\n            \"name\": \"About us\",\n            \"description\": \"\",\n            \"parent\": 0,\n            \"auto_add\": false\n        },\n        \"type\": \"nav_menu\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:18:21\"\n    },\n    \"nav_menu_item[-1264205206]\": {\n        \"value\": {\n            \"object_id\": 0,\n            \"object\": \"\",\n            \"menu_item_parent\": 0,\n            \"position\": 1,\n            \"type\": \"custom\",\n            \"title\": \"Home\",\n            \"url\": \"http://10.0.1.84/event\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"Home\",\n            \"nav_menu_term_id\": -1607180563,\n            \"_invalid\": false,\n            \"type_label\": \"Custom Link\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:18:21\"\n    },\n    \"nav_menu_item[-1668044019]\": {\n        \"value\": {\n            \"object_id\": 35,\n            \"object\": \"page\",\n            \"menu_item_parent\": 0,\n            \"position\": 2,\n            \"type\": \"post_type\",\n            \"title\": \"Post Page\",\n            \"url\": \"http://10.0.1.84/event/sample-page-3/post-page/\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"Post Page\",\n            \"nav_menu_term_id\": -1607180563,\n            \"_invalid\": false,\n            \"type_label\": \"Page\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:18:21\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '4f3e001b-a14d-46d9-8f63-4ecb9193b2d8', '', '', '2018-10-08 12:18:21', '2018-10-08 12:18:21', '', 0, 'http://10.0.1.84/event/2018/10/08/4f3e001b-a14d-46d9-8f63-4ecb9193b2d8/', 0, 'customize_changeset', '', 0),
(42, 1, '2018-10-08 12:18:58', '2018-10-08 12:18:58', '{\n    \"nav_menu_item[-2072017835]\": {\n        \"value\": {\n            \"object_id\": 0,\n            \"object\": \"\",\n            \"menu_item_parent\": 0,\n            \"position\": 1,\n            \"type\": \"custom\",\n            \"title\": \"Home\",\n            \"url\": \"http://10.0.1.84/event\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"Home\",\n            \"nav_menu_term_id\": 2,\n            \"_invalid\": false,\n            \"type_label\": \"Custom Link\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:18:58\"\n    },\n    \"nav_menu_item[-1120161450]\": {\n        \"value\": {\n            \"object_id\": 35,\n            \"object\": \"page\",\n            \"menu_item_parent\": 0,\n            \"position\": 2,\n            \"type\": \"post_type\",\n            \"title\": \"Post Page\",\n            \"url\": \"http://10.0.1.84/event/sample-page-3/post-page/\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"Post Page\",\n            \"nav_menu_term_id\": 2,\n            \"_invalid\": false,\n            \"type_label\": \"Page\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:18:58\"\n    },\n    \"nav_menu_item[-282074888]\": {\n        \"value\": {\n            \"object_id\": 26,\n            \"object\": \"page\",\n            \"menu_item_parent\": 0,\n            \"position\": 3,\n            \"type\": \"post_type\",\n            \"title\": \"Home Page\",\n            \"url\": \"http://10.0.1.84/event/\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"Home Page\",\n            \"nav_menu_term_id\": 2,\n            \"_invalid\": false,\n            \"type_label\": \"Page\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:18:58\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '41c6b9e1-595e-49a8-a153-78850a985581', '', '', '2018-10-08 12:18:58', '2018-10-08 12:18:58', '', 0, 'http://10.0.1.84/event/2018/10/08/41c6b9e1-595e-49a8-a153-78850a985581/', 0, 'customize_changeset', '', 0),
(46, 1, '2018-10-08 12:19:30', '2018-10-08 12:19:30', '{\n    \"nav_menu[2]\": {\n        \"value\": false,\n        \"type\": \"nav_menu\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:19:30\"\n    },\n    \"nav_menu[4]\": {\n        \"value\": false,\n        \"type\": \"nav_menu\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:19:30\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '2db4ed16-f405-4c47-89e2-a71d78cc262d', '', '', '2018-10-08 12:19:30', '2018-10-08 12:19:30', '', 0, 'http://10.0.1.84/event/2018/10/08/2db4ed16-f405-4c47-89e2-a71d78cc262d/', 0, 'customize_changeset', '', 0),
(47, 1, '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 'News & media', '', 'publish', 'closed', 'closed', '', 'news-media', '', '', '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 0, 'http://10.0.1.84/event/?page_id=47', 0, 'page', '', 0),
(48, 1, '2018-10-08 12:21:21', '2018-10-08 12:21:21', '{\n    \"nav_menus_created_posts\": {\n        \"value\": [\n            47,\n            49,\n            50\n        ],\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:21:21\"\n    },\n    \"nav_menu_item[-1803081581]\": {\n        \"value\": {\n            \"object_id\": 47,\n            \"object\": \"page\",\n            \"menu_item_parent\": 0,\n            \"position\": 1,\n            \"type\": \"post_type\",\n            \"title\": \"News & media\",\n            \"url\": \"http://10.0.1.84/event/?page_id=47\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"News & media\",\n            \"nav_menu_term_id\": 3,\n            \"_invalid\": false,\n            \"type_label\": \"Page\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:20:54\"\n    },\n    \"nav_menu_item[38]\": {\n        \"value\": {\n            \"menu_item_parent\": 0,\n            \"object_id\": 26,\n            \"object\": \"page\",\n            \"type\": \"post_type\",\n            \"type_label\": \"Page\",\n            \"url\": \"http://10.0.1.84/event/\",\n            \"title\": \"Events\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"nav_menu_term_id\": 3,\n            \"position\": 2,\n            \"status\": \"publish\",\n            \"original_title\": \"Home Page\",\n            \"_invalid\": false\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:20:54\"\n    },\n    \"nav_menu_item[-1487469942]\": {\n        \"value\": {\n            \"object_id\": 49,\n            \"object\": \"page\",\n            \"menu_item_parent\": 0,\n            \"position\": 3,\n            \"type\": \"post_type\",\n            \"title\": \"About us\",\n            \"url\": \"http://10.0.1.84/event/?page_id=49\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"About us\",\n            \"nav_menu_term_id\": 3,\n            \"_invalid\": false,\n            \"type_label\": \"Page\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:21:06\"\n    },\n    \"nav_menu_item[-1801537678]\": {\n        \"value\": {\n            \"object_id\": 50,\n            \"object\": \"page\",\n            \"menu_item_parent\": 0,\n            \"position\": 4,\n            \"type\": \"post_type\",\n            \"title\": \"Careers\",\n            \"url\": \"http://10.0.1.84/event/?page_id=50\",\n            \"target\": \"\",\n            \"attr_title\": \"\",\n            \"description\": \"\",\n            \"classes\": \"\",\n            \"xfn\": \"\",\n            \"status\": \"publish\",\n            \"original_title\": \"Careers\",\n            \"nav_menu_term_id\": 3,\n            \"_invalid\": false,\n            \"type_label\": \"Page\"\n        },\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:21:21\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '1a94d6ed-5a02-4c42-9c1d-bfd29d85d7fe', '', '', '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 0, 'http://10.0.1.84/event/?p=48', 0, 'customize_changeset', '', 0),
(49, 1, '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 'About us', '', 'publish', 'closed', 'closed', '', 'about-us', '', '', '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 0, 'http://10.0.1.84/event/?page_id=49', 0, 'page', '', 0),
(50, 1, '2018-10-08 12:21:22', '2018-10-08 12:21:22', '', 'Careers', '', 'publish', 'closed', 'closed', '', 'careers', '', '', '2018-10-08 12:21:22', '2018-10-08 12:21:22', '', 0, 'http://10.0.1.84/event/?page_id=50', 0, 'page', '', 0),
(52, 1, '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 'News & media', '', 'inherit', 'closed', 'closed', '', '47-revision-v1', '', '', '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 47, 'http://10.0.1.84/event/2018/10/08/47-revision-v1/', 0, 'revision', '', 0),
(53, 1, '2018-10-08 12:21:21', '2018-10-08 12:21:21', ' ', '', '', 'publish', 'closed', 'closed', '', '53', '', '', '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 0, 'http://10.0.1.84/event/2018/10/08/53/', 3, 'nav_menu_item', '', 0),
(54, 1, '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 'About us', '', 'inherit', 'closed', 'closed', '', '49-revision-v1', '', '', '2018-10-08 12:21:21', '2018-10-08 12:21:21', '', 49, 'http://10.0.1.84/event/2018/10/08/49-revision-v1/', 0, 'revision', '', 0),
(55, 1, '2018-10-08 12:21:22', '2018-10-08 12:21:22', ' ', '', '', 'publish', 'closed', 'closed', '', '55', '', '', '2018-10-08 12:21:22', '2018-10-08 12:21:22', '', 0, 'http://10.0.1.84/event/2018/10/08/55/', 4, 'nav_menu_item', '', 0),
(56, 1, '2018-10-08 12:21:22', '2018-10-08 12:21:22', '', 'Careers', '', 'inherit', 'closed', 'closed', '', '50-revision-v1', '', '', '2018-10-08 12:21:22', '2018-10-08 12:21:22', '', 50, 'http://10.0.1.84/event/2018/10/08/50-revision-v1/', 0, 'revision', '', 0),
(57, 1, '2018-10-08 12:21:22', '2018-10-08 12:21:22', ' ', '', '', 'publish', 'closed', 'closed', '', '57', '', '', '2018-10-08 12:21:22', '2018-10-08 12:21:22', '', 0, 'http://10.0.1.84/event/2018/10/08/57/', 1, 'nav_menu_item', '', 0),
(60, 1, '2018-10-08 12:22:22', '2018-10-08 12:22:22', '{\n    \"nav_menu_item[51]\": {\n        \"value\": false,\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:22:13\"\n    },\n    \"nav_menu_item[58]\": {\n        \"value\": false,\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:22:13\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '9db01253-39f1-49bd-ab8d-50718596a79d', '', '', '2018-10-08 12:22:22', '2018-10-08 12:22:22', '', 0, 'http://10.0.1.84/event/?p=60', 0, 'customize_changeset', '', 0);
INSERT INTO `event_posts` (`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`) VALUES
(61, 1, '2018-10-08 12:22:39', '2018-10-08 12:22:39', '{\n    \"nav_menu_item[59]\": {\n        \"value\": false,\n        \"type\": \"nav_menu_item\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:22:39\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'e93b4705-479d-427e-b629-6661ceb84ed7', '', '', '2018-10-08 12:22:39', '2018-10-08 12:22:39', '', 0, 'http://10.0.1.84/event/2018/10/08/e93b4705-479d-427e-b629-6661ceb84ed7/', 0, 'customize_changeset', '', 0),
(62, 1, '2018-10-08 12:57:56', '2018-10-08 12:57:56', '{\n    \"sparkling[sticky_header]\": {\n        \"value\": true,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:57:56\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '4b74cf4c-8f35-4fbb-b8ee-4cc66cff0910', '', '', '2018-10-08 12:57:56', '2018-10-08 12:57:56', '', 0, 'http://10.0.1.84/event/2018/10/08/4b74cf4c-8f35-4fbb-b8ee-4cc66cff0910/', 0, 'customize_changeset', '', 0),
(63, 1, '2018-10-08 13:00:09', '2018-10-08 13:00:09', '{\n    \"sparkling[nav_bg_color]\": {\n        \"value\": \"#3d5164\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:59:40\"\n    },\n    \"sparkling[nav_link_color]\": {\n        \"value\": \"#ffffff\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:59:40\"\n    },\n    \"sparkling[nav_item_hover_color]\": {\n        \"value\": \"#ffffff\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 12:59:40\"\n    },\n    \"sparkling[nav_dropdown_bg]\": {\n        \"value\": \"#3d5164\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 13:00:09\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '7c25d07e-dc5b-4dc2-ba95-26eb392fd623', '', '', '2018-10-08 13:00:09', '2018-10-08 13:00:09', '', 0, 'http://10.0.1.84/event/?p=63', 0, 'customize_changeset', '', 0),
(64, 1, '2018-10-08 13:00:57', '2018-10-08 13:00:57', '{\n    \"sparkling[link_color]\": {\n        \"value\": \"#3978f3\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 13:00:57\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '53e59665-c364-462b-99c5-7506202632ee', '', '', '2018-10-08 13:00:57', '2018-10-08 13:00:57', '', 0, 'http://10.0.1.84/event/2018/10/08/53e59665-c364-462b-99c5-7506202632ee/', 0, 'customize_changeset', '', 0),
(65, 1, '2018-10-08 13:01:38', '2018-10-08 13:01:38', '{\n    \"sparkling[site_layout]\": {\n        \"value\": \"side-pull-left\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 13:01:38\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'b08dde5f-e440-4037-bf4e-8ce96c56f322', '', '', '2018-10-08 13:01:38', '2018-10-08 13:01:38', '', 0, 'http://10.0.1.84/event/2018/10/08/b08dde5f-e440-4037-bf4e-8ce96c56f322/', 0, 'customize_changeset', '', 0),
(66, 1, '2018-10-08 13:25:17', '2018-10-08 13:25:17', '', 'g1', '', 'inherit', 'open', 'closed', '', 'g1', '', '', '2018-10-08 13:25:17', '2018-10-08 13:25:17', '', 0, 'http://10.0.1.84/event/wp-content/uploads/2018/10/g1.png', 0, 'attachment', 'image/png', 0),
(67, 1, '2018-10-08 13:25:32', '2018-10-08 13:25:32', '', 'cropped-g1.png', '', 'inherit', 'open', 'closed', '', 'cropped-g1-png', '', '', '2018-10-08 13:25:32', '2018-10-08 13:25:32', '', 0, 'http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png', 0, 'attachment', 'image/png', 0),
(68, 1, '2018-10-08 13:25:39', '2018-10-08 13:25:39', '{\n    \"sparkling::header_image\": {\n        \"value\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 13:25:39\"\n    },\n    \"sparkling::header_image_data\": {\n        \"value\": {\n            \"url\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png\",\n            \"thumbnail_url\": \"http://10.0.1.84/event/wp-content/uploads/2018/10/cropped-g1.png\",\n            \"timestamp\": 1539005132438,\n            \"attachment_id\": 67,\n            \"width\": 89,\n            \"height\": 89\n        },\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-08 13:25:39\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'eb37eb3f-9aa6-44d9-8912-d70f594263b8', '', '', '2018-10-08 13:25:39', '2018-10-08 13:25:39', '', 0, 'http://10.0.1.84/event/2018/10/08/eb37eb3f-9aa6-44d9-8912-d70f594263b8/', 0, 'customize_changeset', '', 0),
(69, 1, '2018-10-09 04:19:18', '2018-10-09 04:19:18', '<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\">\r\n  <!-- Indicators -->\r\n  <ol class=\"carousel-indicators\">\r\n    <li data-target=\"#myCarousel\" data-slide-to=\"0\" class=\"active\"></li>\r\n    <li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n    <li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n  </ol>\r\n\r\n  <!-- Wrapper for slides -->\r\n  <div class=\"carousel-inner\">\r\n    <div class=\"item active\">\r\n      <img src=\"..\\1.jpg\" alt=\"Los Angeles\">\r\n    </div>\r\n\r\n    <div class=\"item\">\r\n      <img src=\"..\\2.jpg\" alt=\"Chicago\">\r\n    </div>\r\n\r\n    <div class=\"item\">\r\n      <img src=\"..\\3.jpg\" alt=\"New York\">\r\n    </div>\r\n  </div>\r\n\r\n  <!-- Left and right controls -->\r\n  <a class=\"left carousel-control\" href=\"#myCarousel\" data-slide=\"prev\">\r\n    <span class=\"glyphicon glyphicon-chevron-left\"></span>\r\n    <span class=\"sr-only\">Previous</span>\r\n  </a>\r\n  <a class=\"right carousel-control\" href=\"#myCarousel\" data-slide=\"next\">\r\n    <span class=\"glyphicon glyphicon-chevron-right\"></span>\r\n    <span class=\"sr-only\">Next</span>\r\n  </a>\r\n</div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 04:19:18', '2018-10-09 04:19:18', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(70, 1, '2018-10-09 04:19:27', '2018-10-09 04:19:27', '<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\">\r\n<!-- Indicators -->\r\n<ol class=\"carousel-indicators\">\r\n 	<li class=\"active\" data-target=\"#myCarousel\" data-slide-to=\"0\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n</ol>\r\n<!-- Wrapper for slides -->\r\n<div class=\"carousel-inner\">\r\n<div class=\"item active\"><img src=\"..\\1.jpg\" alt=\"Los Angeles\" /></div>\r\n<div class=\"item\"><img src=\"..\\2.jpg\" alt=\"Chicago\" /></div>\r\n<div class=\"item\"><img src=\"..\\3.jpg\" alt=\"New York\" /></div>\r\n</div>\r\n<!-- Left and right controls -->\r\n<a class=\"left carousel-control\" href=\"#myCarousel\" data-slide=\"prev\">\r\n\r\n<span class=\"sr-only\">Previous</span>\r\n</a>\r\n<a class=\"right carousel-control\" href=\"#myCarousel\" data-slide=\"next\">\r\n\r\n<span class=\"sr-only\">Next</span>\r\n</a>\r\n\r\n</div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 04:19:27', '2018-10-09 04:19:27', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(71, 1, '2018-10-09 04:21:21', '2018-10-09 04:21:21', '<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\"><!-- Indicators -->\r\n<ol class=\"carousel-indicators\">\r\n 	<li class=\"active\" data-target=\"#myCarousel\" data-slide-to=\"0\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n</ol>\r\n<!-- Wrapper for slides -->\r\n<div class=\"carousel-inner\">\r\n<div class=\"item active\"><img src=\"../1.jpg\" alt=\"Los Angeles\" /></div>\r\n<div class=\"item\"><img src=\"../2.jpg\" alt=\"Chicago\" /></div>\r\n<div class=\"item\"><img src=\"../3.jpg\" alt=\"New York\" /></div>\r\n</div>\r\n<!-- Left and right controls -->\r\n\r\n<span class=\"sr-only\">Previous</span>\r\n\r\n<span class=\"sr-only\">Next</span>\r\n\r\n</div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 04:21:21', '2018-10-09 04:21:21', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(72, 1, '2018-10-09 04:22:54', '2018-10-09 04:22:54', '<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\"><!-- Indicators -->\r\n<ol class=\"carousel-indicators\">\r\n 	<li class=\"active\" data-target=\"#myCarousel\" data-slide-to=\"0\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n</ol>\r\n<!-- Wrapper for slides -->\r\n<div class=\"carousel-inner\">\r\n<div class=\"item active\"><img src=\"../1.jpg\" alt=\"Los Angeles\" /></div>\r\n<div class=\"item\"><img src=\"./2.jpg\" alt=\"Chicago\" /></div>\r\n<div class=\"item\"><img src=\"../3.jpg\" alt=\"New York\" /></div>\r\n</div>\r\n<!-- Left and right controls -->\r\n\r\n<span class=\"sr-only\">Previous</span>\r\n\r\n<span class=\"sr-only\">Next</span>\r\n\r\n</div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 04:22:54', '2018-10-09 04:22:54', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(73, 1, '2018-10-09 04:23:34', '2018-10-09 04:23:34', '<div id=\"myCarousel\" class=\"carousel slide\" data-ride=\"carousel\"><!-- Indicators -->\r\n<ol class=\"carousel-indicators\">\r\n 	<li class=\"active\" data-target=\"#myCarousel\" data-slide-to=\"0\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\r\n 	<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\r\n</ol>\r\n<!-- Wrapper for slides -->\r\n<div class=\"carousel-inner\">\r\n<div class=\"item active\"><img src=\"../1.jpg\" alt=\"Los Angeles\" /></div>\r\n<div class=\"item\"><img src=\"/2.jpg\" alt=\"Chicago\" /></div>\r\n<div class=\"item\"><img src=\"../3.jpg\" alt=\"New York\" /></div>\r\n</div>\r\n<!-- Left and right controls -->\r\n\r\n<span class=\"sr-only\">Previous</span>\r\n\r\n<span class=\"sr-only\">Next</span>\r\n\r\n</div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 04:23:34', '2018-10-09 04:23:34', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(74, 1, '2018-10-09 04:42:08', '2018-10-09 04:42:08', '', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 04:42:08', '2018-10-09 04:42:08', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(75, 1, '2018-10-09 05:51:36', '2018-10-09 05:51:36', '<div id=\"pl-26\"  class=\"panel-layout\" ><div id=\"pg-26-0\"  class=\"panel-grid panel-no-style\"  data-style=\"{&quot;background_image_attachment&quot;:false,&quot;background_display&quot;:&quot;tile&quot;,&quot;cell_alignment&quot;:&quot;flex-start&quot;}\"  data-ratio=\"1\"  data-ratio-direction=\"right\" ><div id=\"pgc-26-0-0\"  class=\"panel-grid-cell panel-grid-cell-empty\"  data-style=\"{&quot;background_image_attachment&quot;:false,&quot;background_display&quot;:&quot;tile&quot;,&quot;vertical_alignment&quot;:&quot;auto&quot;}\"  data-weight=\"1\" ></div></div><div id=\"pg-26-1\"  class=\"panel-grid panel-no-style\" ><div id=\"pgc-26-1-0\"  class=\"panel-grid-cell\"  data-weight=\"1\" ></div></div></div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-autosave-v1', '', '', '2018-10-09 05:51:36', '2018-10-09 05:51:36', '', 26, 'http://10.0.1.84/event/2018/10/09/26-autosave-v1/', 0, 'revision', '', 0),
(76, 1, '2018-10-09 05:53:41', '2018-10-09 05:53:41', '<div id=\"pl-26\"  class=\"panel-layout\" ><div id=\"pg-26-0\"  class=\"panel-grid panel-has-style\"  data-style=\"{&quot;background&quot;:&quot;#ccc&quot;,&quot;background_image_attachment&quot;:false,&quot;background_display&quot;:&quot;tile&quot;,&quot;cell_alignment&quot;:&quot;flex-start&quot;}\"  data-ratio=\"1\"  data-ratio-direction=\"right\"  data-color-label=\"3\" ><div class=\"panel-row-style panel-row-style-for-26-0\" ><div id=\"pgc-26-0-0\"  class=\"panel-grid-cell panel-grid-cell-empty\"  data-style=\"{&quot;background_image_attachment&quot;:false,&quot;background_display&quot;:&quot;tile&quot;,&quot;vertical_alignment&quot;:&quot;auto&quot;}\"  data-weight=\"1\" ></div></div></div><div id=\"pg-26-1\"  class=\"panel-grid panel-no-style\"  data-style=\"{&quot;background_image_attachment&quot;:false,&quot;background_display&quot;:&quot;tile&quot;,&quot;cell_alignment&quot;:&quot;flex-start&quot;}\" ><div id=\"pgc-26-1-0\"  class=\"panel-grid-cell panel-grid-cell-empty panel-grid-cell-mobile-last\"  data-weight=\"0.5\" ></div><div id=\"pgc-26-1-1\"  class=\"panel-grid-cell panel-grid-cell-empty\"  data-style=\"{&quot;background_image_attachment&quot;:false,&quot;background_display&quot;:&quot;tile&quot;,&quot;vertical_alignment&quot;:&quot;auto&quot;}\"  data-weight=\"0.5\" ></div></div></div>', 'Home Page', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 05:53:41', '2018-10-09 05:53:41', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(77, 1, '2018-10-09 09:11:53', '2018-10-09 09:11:53', '', '', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-09 09:11:53', '2018-10-09 09:11:53', '', 26, 'http://10.0.1.84/event/2018/10/09/26-revision-v1/', 0, 'revision', '', 0),
(78, 1, '2018-10-09 09:40:43', '2018-10-09 09:40:43', '{\n    \"sparkling::background_color\": {\n        \"value\": \"#ffffff\",\n        \"type\": \"theme_mod\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-09 09:40:43\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', 'bf7ad604-e797-4c6f-a17a-fcce86cafd34', '', '', '2018-10-09 09:40:43', '2018-10-09 09:40:43', '', 0, 'http://10.0.1.84/event/2018/10/09/bf7ad604-e797-4c6f-a17a-fcce86cafd34/', 0, 'customize_changeset', '', 0),
(79, 1, '2018-10-10 05:38:24', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'closed', 'closed', '', '', '', '', '2018-10-10 05:38:24', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?page_id=79', 0, 'page', '', 0),
(80, 1, '2018-10-10 05:39:39', '2018-10-10 05:39:39', '', 'News & Media Post Page', '', 'publish', 'closed', 'closed', '', 'news-media-post-page', '', '', '2018-10-10 05:39:39', '2018-10-10 05:39:39', '', 47, 'http://10.0.1.84/event/?page_id=80', 0, 'page', '', 0),
(81, 1, '2018-10-10 05:39:39', '2018-10-10 05:39:39', '', 'News & Media Post Page', '', 'inherit', 'closed', 'closed', '', '80-revision-v1', '', '', '2018-10-10 05:39:39', '2018-10-10 05:39:39', '', 80, 'http://10.0.1.84/event/2018/10/10/80-revision-v1/', 0, 'revision', '', 0),
(82, 1, '2018-10-10 06:06:57', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'closed', 'closed', '', '', '', '', '2018-10-10 06:06:57', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?page_id=82', 0, 'page', '', 0),
(83, 1, '2018-10-10 06:29:06', '0000-00-00 00:00:00', '{\n    \"sparkling[sparkling_slider_checkbox]\": {\n        \"value\": true,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-10 06:29:06\"\n    }\n}', '', '', 'auto-draft', 'closed', 'closed', '', 'e2fe0b5b-1909-4005-a920-f26315de2efd', '', '', '2018-10-10 06:29:06', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?p=83', 0, 'customize_changeset', '', 0),
(84, 1, '2018-10-10 06:31:03', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'open', 'open', '', '', '', '', '2018-10-10 06:31:03', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?p=84', 0, 'post', '', 0),
(85, 1, '2018-10-10 06:32:39', '2018-10-10 06:32:39', '', '1', 'Header1', 'inherit', 'open', 'closed', '', '1', '', '', '2018-10-10 06:32:51', '2018-10-10 06:32:51', '', 84, 'http://10.0.1.84/event/wp-content/uploads/2018/10/1.jpg', 0, 'attachment', 'image/jpeg', 0),
(86, 1, '2018-10-10 06:33:21', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'open', 'open', '', '', '', '', '2018-10-10 06:33:21', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?p=86', 0, 'post', '', 0),
(87, 1, '2018-10-10 06:34:54', '2018-10-10 06:34:54', '', 'slider1', '', 'publish', 'open', 'open', '', 'slider1', '', '', '2018-10-15 06:22:01', '2018-10-15 06:22:01', '', 0, 'http://10.0.1.84/event/?p=87', 0, 'post', '', 0),
(88, 1, '2018-10-10 06:34:47', '2018-10-10 06:34:47', '', 'slider1', '', 'inherit', 'closed', 'closed', '', '87-revision-v1', '', '', '2018-10-10 06:34:47', '2018-10-10 06:34:47', '', 87, 'http://10.0.1.84/event/2018/10/10/87-revision-v1/', 0, 'revision', '', 0),
(89, 1, '2018-10-10 06:36:18', '2018-10-10 06:36:18', '{\n    \"sparkling[sparkling_slider_checkbox]\": {\n        \"value\": true,\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-10 06:36:18\"\n    },\n    \"sparkling[sparkling_slide_categories]\": {\n        \"value\": \"7\",\n        \"type\": \"option\",\n        \"user_id\": 1,\n        \"date_modified_gmt\": \"2018-10-10 06:36:18\"\n    }\n}', '', '', 'trash', 'closed', 'closed', '', '7549a430-d932-464f-ba44-e0eb8a657804', '', '', '2018-10-10 06:36:18', '2018-10-10 06:36:18', '', 0, 'http://10.0.1.84/event/2018/10/10/7549a430-d932-464f-ba44-e0eb8a657804/', 0, 'customize_changeset', '', 0),
(90, 1, '2018-10-10 06:37:36', '2018-10-10 06:37:36', '', 'Slider 2', '', 'publish', 'open', 'open', '', 'slider-2', '', '', '2018-10-15 06:22:32', '2018-10-15 06:22:32', '', 0, 'http://10.0.1.84/event/?p=90', 0, 'post', '', 0),
(91, 1, '2018-10-10 06:37:21', '2018-10-10 06:37:21', '', '2', 'Header2', 'inherit', 'open', 'closed', '', '2', '', '', '2018-10-10 06:37:31', '2018-10-10 06:37:31', '', 90, 'http://10.0.1.84/event/wp-content/uploads/2018/10/2.jpg', 0, 'attachment', 'image/jpeg', 0),
(92, 1, '2018-10-10 06:37:36', '2018-10-10 06:37:36', '', 'Slider 2', '', 'inherit', 'closed', 'closed', '', '90-revision-v1', '', '', '2018-10-10 06:37:36', '2018-10-10 06:37:36', '', 90, 'http://10.0.1.84/event/2018/10/10/90-revision-v1/', 0, 'revision', '', 0),
(93, 1, '2018-10-10 07:33:42', '2018-10-10 07:33:42', 'This the content for slider 2', 'Slider 2', '', 'inherit', 'closed', 'closed', '', '90-revision-v1', '', '', '2018-10-10 07:33:42', '2018-10-10 07:33:42', '', 90, 'http://10.0.1.84/event/2018/10/10/90-revision-v1/', 0, 'revision', '', 0),
(94, 1, '2018-10-10 07:36:24', '2018-10-10 07:36:24', '', 'Slider 2', '', 'inherit', 'closed', 'closed', '', '90-revision-v1', '', '', '2018-10-10 07:36:24', '2018-10-10 07:36:24', '', 90, 'http://10.0.1.84/event/2018/10/10/90-revision-v1/', 0, 'revision', '', 0),
(95, 1, '2018-10-10 07:37:29', '2018-10-10 07:37:29', '', 'Slider 3', '', 'publish', 'open', 'open', '', 'slider-3', '', '', '2018-10-15 06:23:15', '2018-10-15 06:23:15', '', 0, 'http://10.0.1.84/event/?p=95', 0, 'post', '', 0),
(96, 1, '2018-10-10 07:37:29', '2018-10-10 07:37:29', '', 'Slider 3', '', 'inherit', 'closed', 'closed', '', '95-revision-v1', '', '', '2018-10-10 07:37:29', '2018-10-10 07:37:29', '', 95, 'http://10.0.1.84/event/2018/10/10/95-revision-v1/', 0, 'revision', '', 0),
(97, 1, '2018-10-11 06:43:06', '2018-10-11 06:43:06', '', 'Home', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-11 06:43:06', '2018-10-11 06:43:06', '', 26, 'http://10.0.1.84/event/2018/10/11/26-revision-v1/', 0, 'revision', '', 0),
(98, 1, '2018-10-11 11:21:50', '2018-10-11 11:21:50', 'exibition 1 content', 'Exibition 1', '', 'publish', 'open', 'open', '', 'exibition-1', '', '', '2018-10-11 11:21:50', '2018-10-11 11:21:50', '', 0, 'http://10.0.1.84/event/?p=98', 0, 'post', '', 0),
(99, 1, '2018-10-11 11:21:00', '2018-10-11 11:21:00', 'exibition event 1 ifeat image describtion', '1-1-3', 'exibition event 1 ifeat image', 'inherit', 'open', 'closed', '', '1-1-3', '', '', '2018-10-11 11:21:40', '2018-10-11 11:21:40', '', 98, 'http://10.0.1.84/event/wp-content/uploads/2018/10/1-1-3.jpg', 0, 'attachment', 'image/jpeg', 0),
(100, 1, '2018-10-11 11:21:50', '2018-10-11 11:21:50', 'exibition 1 content', 'Exibition 1', '', 'inherit', 'closed', 'closed', '', '98-revision-v1', '', '', '2018-10-11 11:21:50', '2018-10-11 11:21:50', '', 98, 'http://10.0.1.84/event/2018/10/11/98-revision-v1/', 0, 'revision', '', 0),
(101, 1, '2018-10-11 11:23:39', '2018-10-11 11:23:39', 'exibition2 event content', 'Exibition 2', '', 'publish', 'open', 'open', '', 'exibition-2', '', '', '2018-10-11 11:23:39', '2018-10-11 11:23:39', '', 0, 'http://10.0.1.84/event/?p=101', 0, 'post', '', 0),
(102, 1, '2018-10-11 11:23:10', '2018-10-11 11:23:10', 'exibition2 event description', '2ndimage1', 'exibition2 event  caption', 'inherit', 'open', 'closed', '', '2ndimage1', '', '', '2018-10-11 11:23:35', '2018-10-11 11:23:35', '', 101, 'http://10.0.1.84/event/wp-content/uploads/2018/10/2ndimage1.jpg', 0, 'attachment', 'image/jpeg', 0),
(103, 1, '2018-10-11 11:23:39', '2018-10-11 11:23:39', 'exibition2 event content', 'Exibition 2', '', 'inherit', 'closed', 'closed', '', '101-revision-v1', '', '', '2018-10-11 11:23:39', '2018-10-11 11:23:39', '', 101, 'http://10.0.1.84/event/2018/10/11/101-revision-v1/', 0, 'revision', '', 0),
(104, 1, '2018-10-11 11:30:58', '2018-10-11 11:30:58', 'hi', 'Home', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-11 11:30:58', '2018-10-11 11:30:58', '', 26, 'http://10.0.1.84/event/2018/10/11/26-revision-v1/', 0, 'revision', '', 0),
(105, 1, '2018-10-11 11:31:19', '2018-10-11 11:31:19', '', 'Home', '', 'inherit', 'closed', 'closed', '', '26-revision-v1', '', '', '2018-10-11 11:31:19', '2018-10-11 11:31:19', '', 26, 'http://10.0.1.84/event/2018/10/11/26-revision-v1/', 0, 'revision', '', 0),
(106, 1, '2018-10-11 12:51:03', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'open', 'open', '', '', '', '', '2018-10-11 12:51:03', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?p=106', 0, 'post', '', 0),
(107, 1, '2018-10-12 07:17:13', '2018-10-12 07:17:13', 'Ceo talk content 1', 'Ceo talk 1', '', 'publish', 'open', 'open', '', 'ceo-talk-1', '', '', '2018-10-12 07:17:13', '2018-10-12 07:17:13', '', 0, 'http://10.0.1.84/event/?p=107', 0, 'post', '', 0),
(108, 1, '2018-10-12 07:17:13', '2018-10-12 07:17:13', 'Ceo talk content 1', 'Ceo talk 1', '', 'inherit', 'closed', 'closed', '', '107-revision-v1', '', '', '2018-10-12 07:17:13', '2018-10-12 07:17:13', '', 107, 'http://10.0.1.84/event/2018/10/12/107-revision-v1/', 0, 'revision', '', 0),
(109, 1, '2018-10-12 07:17:36', '2018-10-12 07:17:36', 'Ceo talk content 2', 'Ceo talk 2', '', 'publish', 'open', 'open', '', 'ceo-talk-2', '', '', '2018-10-12 07:17:36', '2018-10-12 07:17:36', '', 0, 'http://10.0.1.84/event/?p=109', 0, 'post', '', 0),
(110, 1, '2018-10-12 07:17:36', '2018-10-12 07:17:36', 'Ceo talk content 2', 'Ceo talk 2', '', 'inherit', 'closed', 'closed', '', '109-revision-v1', '', '', '2018-10-12 07:17:36', '2018-10-12 07:17:36', '', 109, 'http://10.0.1.84/event/2018/10/12/109-revision-v1/', 0, 'revision', '', 0),
(111, 1, '2018-10-12 07:17:56', '2018-10-12 07:17:56', 'Ceo talk content 3', 'Ceo talk 3', '', 'publish', 'open', 'open', '', 'ceo-talk-3', '', '', '2018-10-13 12:10:25', '2018-10-13 12:10:25', '', 0, 'http://10.0.1.84/event/?p=111', 0, 'post', '', 0),
(112, 1, '2018-10-12 07:17:56', '2018-10-12 07:17:56', 'Ceo talk content 3', 'Ceo talk 3', '', 'inherit', 'closed', 'closed', '', '111-revision-v1', '', '', '2018-10-12 07:17:56', '2018-10-12 07:17:56', '', 111, 'http://10.0.1.84/event/2018/10/12/111-revision-v1/', 0, 'revision', '', 0),
(113, 1, '2018-10-15 06:10:02', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'open', 'open', '', '', '', '', '2018-10-15 06:10:02', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?p=113', 0, 'post', '', 0),
(114, 1, '2018-10-15 06:21:50', '2018-10-15 06:21:50', '', 'exhibition-banner', '', 'inherit', 'open', 'closed', '', 'exhibition-banner', '', '', '2018-10-15 06:21:50', '2018-10-15 06:21:50', '', 87, 'http://10.0.1.84/event/wp-content/uploads/2018/10/exhibition-banner.jpg', 0, 'attachment', 'image/jpeg', 0),
(115, 1, '2018-10-15 06:22:15', '0000-00-00 00:00:00', '', 'Auto Draft', '', 'auto-draft', 'open', 'open', '', '', '', '', '2018-10-15 06:22:15', '0000-00-00 00:00:00', '', 0, 'http://10.0.1.84/event/?p=115', 0, 'post', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_termmeta`
--

CREATE TABLE `event_termmeta` (
  `meta_id` bigint(20) UNSIGNED NOT NULL,
  `term_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_terms`
--

CREATE TABLE `event_terms` (
  `term_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `term_group` bigint(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_terms`
--

INSERT INTO `event_terms` (`term_id`, `name`, `slug`, `term_group`) VALUES
(1, 'News', 'cat-news', 0),
(3, 'Events', 'events', 0),
(5, 'Event', 'cat-event', 0),
(6, 'Pressrelease', 'cat-pressrelease', 0),
(7, 'Slider', 'cat-slider', 0),
(8, 'post-format-image', 'post-format-image', 0),
(9, 'exibition_event', 'cat-exibition', 0),
(10, 'ceo_talk', 'cat-ceotalk', 0),
(11, 'customer_event', 'cat-customer', 0),
(12, 'gofrugal_corner', 'cat-gfcorner', 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_term_relationships`
--

CREATE TABLE `event_term_relationships` (
  `object_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `term_taxonomy_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `term_order` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_term_relationships`
--

INSERT INTO `event_term_relationships` (`object_id`, `term_taxonomy_id`, `term_order`) VALUES
(1, 1, 0),
(38, 3, 0),
(53, 3, 0),
(55, 3, 0),
(57, 3, 0),
(86, 8, 0),
(87, 7, 0),
(87, 8, 0),
(90, 7, 0),
(90, 8, 0),
(95, 7, 0),
(95, 8, 0),
(98, 9, 0),
(101, 9, 0),
(107, 10, 0),
(109, 10, 0),
(111, 10, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_term_taxonomy`
--

CREATE TABLE `event_term_taxonomy` (
  `term_taxonomy_id` bigint(20) UNSIGNED NOT NULL,
  `term_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `taxonomy` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `count` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_term_taxonomy`
--

INSERT INTO `event_term_taxonomy` (`term_taxonomy_id`, `term_id`, `taxonomy`, `description`, `parent`, `count`) VALUES
(1, 1, 'category', 'Contains news about the GoFrugal', 0, 1),
(3, 3, 'nav_menu', '', 0, 4),
(5, 5, 'category', 'Contains the events of GoFrugal', 0, 0),
(6, 6, 'category', 'Contains the press release of GoFrugal', 0, 0),
(7, 7, 'category', 'Category of Slider Image ', 5, 3),
(8, 8, 'post_format', '', 0, 3),
(9, 9, 'category', 'Contains the post comes under the \"cat-exibition\" category', 5, 2),
(10, 10, 'category', 'Contains the post comes under the “ceotalk” category', 5, 3),
(11, 11, 'category', 'Contains the post comes under the “cat-customer” category', 5, 0),
(12, 12, 'category', 'Contains the post comes under the “cat-gfcorner” category', 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_usermeta`
--

CREATE TABLE `event_usermeta` (
  `umeta_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
  `meta_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_value` longtext COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_usermeta`
--

INSERT INTO `event_usermeta` (`umeta_id`, `user_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'nickname', 'admin'),
(2, 1, 'first_name', ''),
(3, 1, 'last_name', ''),
(4, 1, 'description', ''),
(5, 1, 'rich_editing', 'true'),
(6, 1, 'syntax_highlighting', 'true'),
(7, 1, 'comment_shortcuts', 'false'),
(8, 1, 'admin_color', 'fresh'),
(9, 1, 'use_ssl', '0'),
(10, 1, 'show_admin_bar_front', 'true'),
(11, 1, 'locale', ''),
(12, 1, 'event_capabilities', 'a:1:{s:13:\"administrator\";b:1;}'),
(13, 1, 'event_user_level', '10'),
(14, 1, 'dismissed_wp_pointers', 'wp496_privacy,theme_editor_notice,plugin_editor_notice'),
(15, 1, 'show_welcome_panel', '1'),
(16, 1, 'session_tokens', 'a:1:{s:64:\"9c4b7d63f6cb134e0b0dfd6d080d7d7adbf229d3bff7782fe304ed53cfad4241\";a:4:{s:10:\"expiration\";i:1539756602;s:2:\"ip\";s:9:\"10.0.1.84\";s:2:\"ua\";s:114:\"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36\";s:5:\"login\";i:1539583802;}}'),
(17, 1, 'event_dashboard_quick_press_last_post_id', '113'),
(18, 1, 'community-events-location', 'a:1:{s:2:\"ip\";s:8:\"10.0.1.0\";}'),
(19, 1, 'event_user-settings', 'libraryContent=browse&editor=html&mfold=o'),
(20, 1, 'event_user-settings-time', '1539064077'),
(21, 1, 'managenav-menuscolumnshidden', 'a:5:{i:0;s:11:\"link-target\";i:1;s:11:\"css-classes\";i:2;s:3:\"xfn\";i:3;s:11:\"description\";i:4;s:15:\"title-attribute\";}'),
(22, 1, 'metaboxhidden_nav-menus', 'a:2:{i:0;s:12:\"add-post_tag\";i:1;s:15:\"add-post_format\";}'),
(23, 1, 'nav_menu_recently_edited', '3'),
(24, 1, 'closedpostboxes_post', 'a:0:{}'),
(25, 1, 'metaboxhidden_post', 'a:6:{i:0;s:11:\"postexcerpt\";i:1;s:13:\"trackbacksdiv\";i:2;s:10:\"postcustom\";i:3;s:16:\"commentstatusdiv\";i:4;s:11:\"commentsdiv\";i:5;s:9:\"authordiv\";}');

-- --------------------------------------------------------

--
-- Table structure for table `event_users`
--

CREATE TABLE `event_users` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `user_login` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_pass` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_nicename` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_activation_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT '0',
  `display_name` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_users`
--

INSERT INTO `event_users` (`ID`, `user_login`, `user_pass`, `user_nicename`, `user_email`, `user_url`, `user_registered`, `user_activation_key`, `user_status`, `display_name`) VALUES
(1, 'admin', '$P$B.mrM4.mz65jLp89oq1Z5/RifM/D0K.', 'admin', 'muthuvijayan.m@gofrugal.com', '', '2018-10-08 10:25:34', '', 0, 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event_commentmeta`
--
ALTER TABLE `event_commentmeta`
  ADD PRIMARY KEY (`meta_id`),
  ADD KEY `comment_id` (`comment_id`),
  ADD KEY `meta_key` (`meta_key`(191));

--
-- Indexes for table `event_comments`
--
ALTER TABLE `event_comments`
  ADD PRIMARY KEY (`comment_ID`),
  ADD KEY `comment_post_ID` (`comment_post_ID`),
  ADD KEY `comment_approved_date_gmt` (`comment_approved`,`comment_date_gmt`),
  ADD KEY `comment_date_gmt` (`comment_date_gmt`),
  ADD KEY `comment_parent` (`comment_parent`),
  ADD KEY `comment_author_email` (`comment_author_email`(10));

--
-- Indexes for table `event_links`
--
ALTER TABLE `event_links`
  ADD PRIMARY KEY (`link_id`),
  ADD KEY `link_visible` (`link_visible`);

--
-- Indexes for table `event_options`
--
ALTER TABLE `event_options`
  ADD PRIMARY KEY (`option_id`),
  ADD UNIQUE KEY `option_name` (`option_name`);

--
-- Indexes for table `event_postmeta`
--
ALTER TABLE `event_postmeta`
  ADD PRIMARY KEY (`meta_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `meta_key` (`meta_key`(191));

--
-- Indexes for table `event_posts`
--
ALTER TABLE `event_posts`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `post_name` (`post_name`(191)),
  ADD KEY `type_status_date` (`post_type`,`post_status`,`post_date`,`ID`),
  ADD KEY `post_parent` (`post_parent`),
  ADD KEY `post_author` (`post_author`);

--
-- Indexes for table `event_termmeta`
--
ALTER TABLE `event_termmeta`
  ADD PRIMARY KEY (`meta_id`),
  ADD KEY `term_id` (`term_id`),
  ADD KEY `meta_key` (`meta_key`(191));

--
-- Indexes for table `event_terms`
--
ALTER TABLE `event_terms`
  ADD PRIMARY KEY (`term_id`),
  ADD KEY `slug` (`slug`(191)),
  ADD KEY `name` (`name`(191));

--
-- Indexes for table `event_term_relationships`
--
ALTER TABLE `event_term_relationships`
  ADD PRIMARY KEY (`object_id`,`term_taxonomy_id`),
  ADD KEY `term_taxonomy_id` (`term_taxonomy_id`);

--
-- Indexes for table `event_term_taxonomy`
--
ALTER TABLE `event_term_taxonomy`
  ADD PRIMARY KEY (`term_taxonomy_id`),
  ADD UNIQUE KEY `term_id_taxonomy` (`term_id`,`taxonomy`),
  ADD KEY `taxonomy` (`taxonomy`);

--
-- Indexes for table `event_usermeta`
--
ALTER TABLE `event_usermeta`
  ADD PRIMARY KEY (`umeta_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `meta_key` (`meta_key`(191));

--
-- Indexes for table `event_users`
--
ALTER TABLE `event_users`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_login_key` (`user_login`),
  ADD KEY `user_nicename` (`user_nicename`),
  ADD KEY `user_email` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event_commentmeta`
--
ALTER TABLE `event_commentmeta`
  MODIFY `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_comments`
--
ALTER TABLE `event_comments`
  MODIFY `comment_ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `event_links`
--
ALTER TABLE `event_links`
  MODIFY `link_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_options`
--
ALTER TABLE `event_options`
  MODIFY `option_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=554;

--
-- AUTO_INCREMENT for table `event_postmeta`
--
ALTER TABLE `event_postmeta`
  MODIFY `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=297;

--
-- AUTO_INCREMENT for table `event_posts`
--
ALTER TABLE `event_posts`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `event_termmeta`
--
ALTER TABLE `event_termmeta`
  MODIFY `meta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_terms`
--
ALTER TABLE `event_terms`
  MODIFY `term_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `event_term_taxonomy`
--
ALTER TABLE `event_term_taxonomy`
  MODIFY `term_taxonomy_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `event_usermeta`
--
ALTER TABLE `event_usermeta`
  MODIFY `umeta_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `event_users`
--
ALTER TABLE `event_users`
  MODIFY `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
