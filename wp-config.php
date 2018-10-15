<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'event_db');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '3tCQgXw4bo*@frL pvHK<?#MLv j#-k.TR<w3{g-8a91e6pW^9VTLP(zj{?x[W]w');
define('SECURE_AUTH_KEY',  'u|ojpnDdq7$OXkTOx|=s$35djJoq#V}Az{uHwCXuT79Xa5%7c[nq_Jo-Sp[CPIEd');
define('LOGGED_IN_KEY',    'HbSj.c+p!cwOx1``7sfX~Sk1)Lj~p_Xiigba ]8FUZ;nuB&#n!?*Ab?zX[hEwc/`');
define('NONCE_KEY',        'Ny41&=kM-}]s%,HE|7boZZ1=[ir8%F,<wPx%<4*yadlA]w=Ay,3.U9_|@vZ8f|!V');
define('AUTH_SALT',        '=oALP0@T=}K7=U=.0Z{CA6LWY@CuT2*sIV1TKP$ge9Q O_na}foA2R dU> y_4fq');
define('SECURE_AUTH_SALT', 'fGaPY|X)%V(!3)c:qx~a4=a3@ZgOmy^ja,pUI1/n{d7uDW}+{S(1q$)+W: ]$xj^');
define('LOGGED_IN_SALT',   '9aS5&6MS&z)O#W2VZBrD#5b}DaM.8OUkMrCx7+wZ5^w-c1&Xc]~v$Kp2P}l2:K6H');
define('NONCE_SALT',       '~,pgGFU7$]qw(*-]z#9-D2qO;^~JdO.X(ijB*Hj!nP5JE(RiV]ddeEw|dJV*0USW');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'event_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
