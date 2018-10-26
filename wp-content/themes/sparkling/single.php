<?php
/**
 * Template Name: custom-home
 *
 * This is the template that displays full width page without sidebar
 *
 * @package sparkling
 */

get_header();
?>

<link rel="stylesheet" href="http://10.0.1.84/event/wp-content/themes/sparkling/jquery-ui.css" type="text/css" media="all">



<style>
	.counters {
		animation-duration: 1s;
		animation-delay: 0s;
		font-size: 40px;
		font-weight: 800;
	}
	.ui-state-default,
.ui-widget-content .ui-state-default,
.ui-widget-header .ui-state-default {
	border: 1px solid #d3d3d3;
	background:#397BF3;
	font-weight: normal;
	color: #555555;
	border:5px solid #FFF;
	border-radius:15px;
	box-shadow:2px 2px 2px 2px #CCC;
	box-shadow: 1px 1px 15px 1px #bbb;
}
.ui-slider .ui-slider-handle {
    position: absolute;
    z-index: 2;
    width: 1.5em;
    height: 1.5em;
    cursor: default;
    touch-action: none;
    outline: none;
    margin-top: -1px;
}

.ui-widget-content .ui-state-active {
	 
    z-index: 2;
    width: 2em;
    height: 2em;
    cursor: default;
    touch-action: none;
    margin-top: -5px;
    outline: none;

}
div #year_slider_1 {
    border: 2px solid #c7d8e5;
    border-radius: 0px;
    height: 14px;
    width: 96%;
    margin: 0 auto;
    background-color: #f7fbff;
}
.acolor_u_b
{
	float: right;
    color: #397BF3;
    font-weight: bold;
    text-decoration: underline;
    float: right;
}
.entry-date  {
	color:#a5a6a6;

}
.author
{
	color:#a5a6a6;

} 

</style>
<style>
	.col-md-12 span {
		    padding: 0px 10px 0px 12px;
	}
</style>


<div id="primary" class="content-area">


	<main id="main" class="site-main" role="main">
 
<div class="container">
	<div class="row">
		<div class="col-md-6">
			<?php
		while ( have_posts() ) :
		
	 
			the_post();
			

			get_template_part( 'template-parts/content', 'single' );
			 
 
			// If comments are open or we have at least one comment, load up the comment template
			/*if ( comments_open() || '0' != get_comments_number() ) :
				comments_template();
				endif;

			the_post_navigation(
				array(
					'next_text' => '<span class="post-title">%title <i class="fa fa-chevron-right"></i></span>',
					'prev_text' => '<i class="fa fa-chevron-left"></i> <span class="post-title">%title</span>',
				)
			);*/

		endwhile; // end of the loop.
		?>

	
</div>
		<div class="col-md-6"><?php /* The loop */
while ( have_posts() ) : the_post();
    if ( get_post_gallery() ) :
        echo get_post_gallery();
    endif; 
endwhile; 
?></div>
	</div>

</div>
		


	</main>

	<!-- #main -->

</div> <!-- #primary -->


</div> <!-- close .main-content-inner -->
</div>
</div>
<!--Section Start-->
<div class="container-fluid" style="background-color: #ecf2f6; padding: 90px 0px;">

	<div class="container">






		<div class="row">
			<div class="col-md-7">
				<h1 style="border-bottom: 1px solid #dbdbdb; padding-bottom: 20px;  ">In the news</h1>

				<?php 
// the query
$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>3 , 'category_name' => 'cat-news')); ?>


				<?php  if ( $wpb_all_query->have_posts() ) : ?>



				<!-- the loop -->
				<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>



				<div class="news-title" style="border-bottom: 1px solid #dbdbdb; margin-bottom: 5px; padding-bottom: 10px; ">
					<h3><a href="<?php the_permalink(); ?>"><?php the_title();?></a></h3>
					<span class="author vcard">
						<?php echo get_the_author_meta('display_name', $author_id); ?>, </span>
					<time class="entry-date published">
						<?php echo get_the_date('M d Y');?>
					</time>
				</div>


				<?php endwhile; ?>
				<!-- end of the loop -->



				<?php wp_reset_postdata(); ?>

				<?php else : ?>
				<p>
					<?php _e( 'Sorry, no posts matched your criteria.' ); ?>
				</p>
				<?php endif; ?>
				<a class="acolor_u_b" href="<?php the_permalink(); ?>">More news »</a>

			</div>


			<div class="col-md-5">
				<div class="" style="background-color: #FFF;margin: 20px 0 5px 0px;padding: 40px 20px;box-shadow: 0px 0px 3px 2px #ccc;">
					<?php 
				// the query	
				$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>1 , 'category_name' => 'cat-pressrelease')); ?>


					<?php  if ( $wpb_all_query->have_posts() ) : ?>



					<!-- the loop -->
					<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>



					<div class="news-title">
						<h3 style="line-height: 1.5;">
							<?php the_title();?>
						</h3>
						<?php the_post_thumbnail( 'medium' ); ?>
						<div style="display: inline-block;max-width:200px;margin-left: 5px;vertical-align: top;">
							<?php the_excerpt(); ?>
							<a class="acolor_u_b" href="<?php the_permalink(news-media); ?>">Read More &#187;</a>
						</div>


					</div>


					<?php endwhile; ?>
					<!-- end of the loop -->



					<?php wp_reset_postdata(); ?>

					<?php else : ?>
					<p>
						<?php _e( 'Sorry, no posts matched your criteria.' ); ?>
					</p>
					<?php endif; ?>





				</div>
				<a class="acolor_u_b" href="<?php the_permalink(); ?>">More news »</a>
			</div>
		</div>
	</div>
</div>
<!--Section Ends-->

<!--Section Start-->
<div class="container-fluid" style="padding: 80px 0px;">

	<div class="container">

		<div class="row" style="text-align: center; ">

			<div class="col-md-4">
				<span class="counters">15000</span><br>
				<span>Lives Impacted</span>
			</div>
			<div class="col-md-4">
				<span class="counters">75</span><br>
				<span>Events Covered</span>
			</div>
			<div class="col-md-4">
				<span class="counters">10</span><br>

				<span>Cites Visited</span>
			</div>

			<img src="http://10.0.1.84/event/wp-content/uploads/2018/10/credentional-logo.jpg" style="margin-top: 40px;">
		</div>
	</div>
</div>
<!--Section Ends-->
<!--Section Start-->
<!--Section Ends-->
<!--Scripts of Sliding content-->
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js'></script>
<script src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/jquery.ui.touch-punch.js'></script>

<script>
	jQuery( document ).ready( function ( $ ) {
		$( '.counters' ).counterUp( {
			delay: 10,
			time: 3000
		} );
	} );
</script>
<script src="https://cdn.jsdelivr.net/jquery.counterup/1.0/jquery.counterup.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/waypoints/2.0.3/waypoints.min.js"></script>


<script>
	// get width of boxes, and multiply by how many to set width of sliding container div.

	// Include the 5px margin if the CSS is using one.
	var _boxwidth = document.getElementById( "box1" ).offsetWidth + 6;
	var _boxCount = $( '.tlBox' ).length;
	var _tlInnerWidth = _boxwidth * _boxCount;
	// set the container div width to the calculated _tlInnerWidth
	TweenLite.set( ".slider_cont_1", {
		width: _tlInnerWidth
	} );


	//responsive timeline animation.
	//values recorded once, nothing changes on resize
	// var tl = new TimelineMax({repeat:-1, yoyo:true, repeatDelay:1}) 
	var tl = new TimelineMax()
		// make the timeline duration equal to the number of boxes (in seconds)
	tl.to( ".slider_cont_1", _boxCount, {
		xPercent: -100,
		force3D: true
	} );
	tl.pause();

	var tl1 = new TimelineMax()
		// make the timeline duration equal to the number of boxes (in seconds)
	tl1.to( ".slider_cont_2", _boxCount, {
		xPercent: -100,
		force3D: true
	} );
	tl1.pause();
	// tl.play(); 

	varctrl = $( "#year_slider_1" ),
		ctrlValue = {
			value: 0
		};
	varctrl2 = $( "#year_slider_2" ),
		ctrlValue = {
			value: 0
		};

	varctrl.slider( {
		range: false,
		min: 0,
		max: 100,
		step: .1,
		start: function () {
			tl.pause();
		},
		slide: function ( event, ui ) {
				tl.progress( ui.value / 100 );
			}
			// },
			// stop:function() {
			//   tl.play();
			// }
	} );
	varctrl2.slider( {
		range: false,
		min: 0,
		max: 100,
		step: .1,
		start: function () {
			tl1.pause();
		},
		slide: function ( event, ui ) {
				tl1.progress( ui.value / 100 );
			}
			// },
			// stop:function() {
			//   tl.play();
			// }
	} );

	tl.eventCallback( "onUpdate", function () {
		ctrlValue.value = tl.progress() * 100;
		varctrl.slider( ctrlValue );
	} );
	tl1.eventCallback( "onUpdate", function () {
		ctrlValue.value = tl1.progress() * 100;
		varctrl2.slider( ctrlValue );
	} );
</script>
<!--Scripts of Sliding content-->

<?php get_footer(); ?>