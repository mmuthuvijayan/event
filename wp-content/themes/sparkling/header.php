<?php
/* *
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package sparkling
 */

if ( isset( $_SERVER['HTTP_USER_AGENT'] ) && ( strpos( $_SERVER['HTTP_USER_AGENT'], 'MSIE' ) !== false ) ) {
	header( 'X-UA-Compatible: IE=edge,chrome=1' );
} ?>
<!doctype html>
<!--[if !IE]>
<html class="no-js non-ie" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7 ]>
<html class="no-js ie7" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8 ]>
<html class="no-js ie8" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 9 ]>
<html class="no-js ie9" <?php language_attributes(); ?>> <![endif]-->
<!--[if gt IE 9]><!-->
<html class="no-js" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="<?php echo of_get_option( 'nav_bg_color' ); ?>">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="icon" type="image/x-icon" href="https://gofrugal.com/favicon.ico">
	<script src="http://www.gofrugal.com//js/jquery-1.11.2.min.js"></script>

<?php wp_head(); ?>

<link rel="stylesheet" href="http://10.0.1.84/event/wp-content/themes/sparkling/custom-style.css" type="text/css" media="all">
<link rel="stylesheet" href="http://10.0.1.84/event/wp-content/themes/sparkling/footer-cust-style.css" type="text/css" media="all">
</head>

<body <?php body_class(); ?>>
<a class="sr-only sr-only-focusable" href="#content">Skip to main content</a>
<div id="page" class="hfeed site">

	<header id="masthead" class="site-header" role="banner">
		<nav class="navbar navbar-default 
		<?php
		if ( of_get_option( 'sticky_header' ) ) {
			echo 'navbar-fixed-top';}
?>
" role="navigation">
			<div class="container">
				<div class="row">
					<div class="site-navigation-inner col-sm-12">
						
						<div class="navbar-header">
							<button type="button" class="btn navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
								<span class="sr-only">Toggle navigation</span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							</button>

														<div id="logo">
															
															 <?php if ( get_header_image() != '' ) { ?>
																	<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><img src="<?php header_image(); ?>"  height="<?php echo get_custom_header()->height; ?>" width="<?php echo get_custom_header()->width; ?>" alt="<?php bloginfo( 'name' ); ?>"/></a>
																		<?php if ( is_home() ) { ?>
																		<h1 class="site-name hide-site-name"><a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
																	<?php
}
} else {
	echo is_home() ? '<h1 class="site-name">' : '<p class="site-name">';
	?>
																		<a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
																<?php echo is_home() ? '</h1>' : '</p>'; ?>
															<?php } ?>
														</div><!-- end of #logo -->
						</div>
						<div style="color: #FFF;text-align: end; margin: 13px 0 auto;"><span>Retail </span> | <span> Restaurant</span> | <span> Sales & Distribution</span> | <span> What's New </span><span class="but-down">FREE DOWNLOAD</span></div>
					</div>
				</div>
			</div>
		</nav><!-- .site-navigation -->
	</header><!-- #masthead -->


<!-- Left and right controls -->

<span class="sr-only">Previous</span>

<span class="sr-only">Next</span>

 <div class="container" id="nav-cus"><?php  sparkling_header_menu();  // main navigation ?></div>
	<div id="content" class="site-content">


		<div class="top-section">

			<?php sparkling_featured_slider(); ?>

			<?php sparkling_call_for_action(); ?>
		</div>

		<div class="container main-content-area">
			<?php $layout_class = get_layout_class(); ?>
			<div class="row <?php echo $layout_class; ?>">
				<div class="main-content-inner <?php echo sparkling_main_content_bootstrap_classes(); ?>">
