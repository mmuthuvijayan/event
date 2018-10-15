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
<link rel='stylesheet' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>

<style>
	/* colors */
	/* tab setting */
	/* breakpoints */
	/* selectors relative to radio inputs */
	
	.tabs {
		left: 50%;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
		position: relative;
		background: white;
		padding: 50px;
		padding-bottom: 80px;
		width: 100%;
		border-radius: 5px;
		min-width: 240px;
	}
	
	.tabs input[name="tab-control"] {
		display: none;
	}
	
	.tabs .content section h2,
	.tabs ul li label {
		font-family: "Montserrat";
		font-weight: bold;
		font-size: 18px;
		color: #428BFF;
	}
	
	.tabs ul {
		list-style-type: none;
		padding-left: 0;
		display: flex;
		flex-direction: row;
		margin-bottom: 0px;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		border-bottom: 1px solid #d7e3ed;
		padding-bottom: 7px;
	}
	
	.tabs ul li {
		box-sizing: border-box;
		flex: 1;
		width: 25%;
		padding: 0 10px;
		text-align: center;
	}
	
	.tabs ul li label {
		transition: all 0.3s ease-in-out;
		color: #000;
		padding: 5px auto;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		white-space: nowrap;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.tabs ul li label br {
		display: none;
	}
	
	.tabs ul li label:hover,
	.tabs ul li label:focus,
	.tabs ul li label:active {
		outline: 0;
		color: #bec5cf;
	}
	
	.tabs .slider {
		position: relative;
		width: 25%;
		transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
		z-index: -1;
	}
	
	.tabs .slider .indicator {
		position: relative;
		width: 220px;
		max-width: 100%;
		background: #d7e3ed;
		height: 40px;
		z-index: 0;
		margin: -40px auto 0 auto;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
	}
	
	.tabs .slider .indicator::after {
		content: '';
		position: absolute;
		left: 47%;
		top: 100%;
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 7px solid #d7e3ed;
		clear: both;
	}
	
	.tabs .content {
		margin-top: 30px;
	}
	
	.tabs .content section {
		display: none;
		-webkit-animation-name: content;
		animation-name: content;
		-webkit-animation-direction: normal;
		animation-direction: normal;
		-webkit-animation-duration: 0.3s;
		animation-duration: 0.3s;
		-webkit-animation-timing-function: ease-in-out;
		animation-timing-function: ease-in-out;
		-webkit-animation-iteration-count: 1;
		animation-iteration-count: 1;
		line-height: 1.4;
	}
	
	.tabs .content section h2 {
		color: #428BFF;
		display: none;
	}
	
	.tabs .content section h2::after {
		content: "";
		position: relative;
		display: block;
		width: 30px;
		height: 3px;
		background: #428BFF;
		margin-top: 5px;
		left: 1px;
	}
	
	.tabs input[name="tab-control"]:nth-of-type(1):checked~ ul> li:nth-child(1)> label {
		cursor: default;
		color: #000;
	}
	
	@media (max-width: 600px) {
		.tabs input[name="tab-control"]:nth-of-type(1):checked~ ul> li:nth-child(1)> label {
			background: rgba(0, 0, 0, 0.08);
		}
	}
	
	.tabs input[name="tab-control"]:nth-of-type(1):checked~ .slider {
		-webkit-transform: translateX(0%);
		transform: translateX(0%);
	}
	
	.tabs input[name="tab-control"]:nth-of-type(1):checked~ .content> section:nth-child(1) {
		display: block;
	}
	
	.tabs input[name="tab-control"]:nth-of-type(2):checked~ ul> li:nth-child(2)> label {
		cursor: default;
		color: #000;
	}
	
	@media (max-width: 600px) {
		.tabs input[name="tab-control"]:nth-of-type(2):checked~ ul> li:nth-child(2)> label {
			background: rgba(0, 0, 0, 0.08);
		}
	}
	
	.tabs input[name="tab-control"]:nth-of-type(2):checked~ .slider {
		-webkit-transform: translateX(100%);
		transform: translateX(100%);
	}
	
	.tabs input[name="tab-control"]:nth-of-type(2):checked~ .content> section:nth-child(2) {
		display: block;
	}
	
	.tabs input[name="tab-control"]:nth-of-type(3):checked~ ul> li:nth-child(3)> label {
		cursor: default;
		color: #000;
	}
	
	@media (max-width: 600px) {
		.tabs input[name="tab-control"]:nth-of-type(3):checked~ ul> li:nth-child(3)> label {
			background: rgba(0, 0, 0, 0.08);
		}
	}
	
	.tabs input[name="tab-control"]:nth-of-type(3):checked~ .slider {
		-webkit-transform: translateX(200%);
		transform: translateX(200%);
	}
	
	.tabs input[name="tab-control"]:nth-of-type(3):checked~ .content> section:nth-child(3) {
		display: block;
	}
	
	.tabs input[name="tab-control"]:nth-of-type(4):checked~ ul> li:nth-child(4)> label {
		cursor: default;
		color: #000;
	}
	
	@media (max-width: 600px) {
		.tabs input[name="tab-control"]:nth-of-type(4):checked~ ul> li:nth-child(4)> label {
			background: rgba(0, 0, 0, 0.08);
		}
	}
	
	.tabs input[name="tab-control"]:nth-of-type(4):checked~ .slider {
		-webkit-transform: translateX(300%);
		transform: translateX(300%);
	}
	
	.tabs input[name="tab-control"]:nth-of-type(4):checked~ .content> section:nth-child(4) {
		display: block;
	}
	
	@-webkit-keyframes content {
		from {
			opacity: 0;
			-webkit-transform: translateY(5%);
			transform: translateY(5%);
		}
		to {
			opacity: 1;
			-webkit-transform: translateY(0%);
			transform: translateY(0%);
		}
	}
	
	@keyframes content {
		from {
			opacity: 0;
			-webkit-transform: translateY(5%);
			transform: translateY(5%);
		}
		to {
			opacity: 1;
			-webkit-transform: translateY(0%);
			transform: translateY(0%);
		}
	}
	
	@media (max-width: 1000px) {
		.tabs ul li label {
			white-space: initial;
		}
		.tabs ul li label br {
			display: initial;
		}
		.tabs ul li label svg {
			height: 1.5em;
		}
	}
	
	@media (max-width: 600px) {
		.tabs ul li label {
			padding: 5px;
			border-radius: 5px;
		}
		.tabs ul li label span {
			display: none;
		}
		.tabs .slider {
			display: none;
		}
		.tabs .content {
			margin-top: 20px;
		}
		.tabs .content section h2 {
			display: block;
		}
	}
</style>
<!--Styles of Sliding content-->
<style>
	.tlContainer {
		width: 90%;
		height: 260px;
		max-height: 360px;
		background-color: #fff;
		position: relative;
		margin: 20px auto;
		font-size: 1.5em;
		border: 1px solid #555;
		/* toggle this on/off to see the start/end positions of the content div */
		overflow: hidden;
	}
	
	.slider_cont_1,
	.slider_cont_2 {
		/*   holder of the boxes */
		width: 12000px;
		height: 100%;
		top: 0;
		left: 0;
		position: relative;
		border: 1px solid red;
	}
	
	.tlBox {
		width: 360px;
		height: 100%;
		margin: 0 5px 0 0;
		float: left;
		text-align: center;
		color: #fff;
		display: block;
		border: 2px solid blue;
	}
	
	.red {
		background-color: red;
	}
	
	.green {
		background-color: green;
	}
	
	.blue {
		background-color: blue;
	}
	/* #ctrl_slider {
  width: 400px;
  margin: 10px auto;
} */
	
	#slider {
		/*   position:relative; */
		width: 824px;
		height: 10px;
		margin: 10px auto;
		background: rgba(80, 80, 80, 0.5);
		border: 1px solid rgba(102, 102, 102, 0.5);
	}
	
	#sliderText {
		text-align: center;
	}
	
	.clearfix:after {
		height: 0;
		clear: both;
		visibility: hidden;
	}
	
	.clearfix:before,
	.clearfix:after {
		display: table;
		content: " ";
	}
</style>
<style>
.counters {
  animation-duration: 1s;
  animation-delay: 0s;
font-size: 40px;
font-weight: 400;
}
</style>

<div id="primary" class="content-area">


	<main id="main" class="site-main" role="main">



		<div class="tabs">
			<input type="radio" id="tab1" name="tab-control" checked>
			<input type="radio" id="tab2" name="tab-control">
			<input type="radio" id="tab3" name="tab-control">
			<input type="radio" id="tab4" name="tab-control">
			<ul>
				<li title="Exibition Events"><label for="tab1" role="button"><br><span>EXIBITION EVENTS</span></label>
				</li>
				<li title="CEO's Talk"><label for="tab2" role="button"><br><span>CEO'S TALK</span></label>
				</li>
				<li title="Customer Event"><label for="tab3" role="button"><br><span>CUSTOMER EVENT</span></label>
				</li>
				<li title="GoFrugal Corner"><label for="tab4" role="button">
</svg><br><span>GOFRUGAL CORNER</span></label>
				
				</li>
			</ul>

			<div class="slider">
				<div class="indicator"></div>
			</div>
			<div class="content">
				<section>
					<div>
						<!--Code of sliding content-->

						<div class="tlContainer clearfix">
							<div class="slider_cont_1">





								<?php 
// the query
$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1 , 'category_name' => 'cat-exibition')); ?>

								<?php if ( $wpb_all_query->have_posts() ) : ?>



								<!-- the loop -->
								<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>
								<div id="box1" class="tlBox" style="color: #000;">
									<a href="<?php the_permalink(); ?>">
										<?php the_title(); ?>
									</a>
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
						</div>
						<!--<div id="year_slider_cont_1">Use the slider to scroll through colored panels</div>-->
						<div id="year_slider_1"></div>

						<!--Code of sliding content-->




					</div>
					<div class="col-md-12">
						<div class="col-md-4">
							<span>2018</span>|
							<span>2017</span>|
							<span>2016</span>|
							<span>2015</span>|
							<span>2014</span>|
						</div>
						<div class="col-md-4">2</div>
						<div class="col-md-4">3</div>
					</div>
				</section>
				<section>

					<div>
						<!--Code of sliding content-->

						<div class="tlContainer clearfix">
							<div class="slider_cont_2">





								<?php 
// the query
$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1 , 'category_name' => 'cat-ceotalk')); ?>

								<?php if ( $wpb_all_query->have_posts() ) : ?>



								<!-- the loop -->
								<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>
								<div id="box1" class="tlBox" style="color: #000;">
									<a href="<?php the_permalink(); ?>">
										<?php the_title(); ?>
									</a>
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
						</div>
						<!--<div id="year_slider_cont_2">Use the slider to scroll through colored panels</div>-->
						<div id="year_slider_2"></div>

						<!--Code of sliding content-->




					</div>
				</section>
				<section>
					<h2>Shipping</h2> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam nemo ducimus eius, magnam error quisquam sunt voluptate labore, excepturi numquam! Alias libero optio sed harum debitis! Veniam, quia in eum.</section>
				<section>
					<h2>Returns</h2> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa dicta vero rerum? Eaque repudiandae architecto libero reprehenderit aliquam magnam ratione quidem? Nobis doloribus molestiae enim deserunt necessitatibus eaque quidem incidunt.</section>
			</div>
		</div>



	</main>

	<!-- #main -->

</div> <!-- #primary -->


</div> <!-- close .main-content-inner -->
</div>
</div>
<!--Section Start-->
<div class="container-fluid" style="background-color: #ecf2f6; height:500px;">

	<div class="container">

		<div class="row">
			<div class="col-md-6">
				<h1>In the news</h1>
				<div class="news-title" style="border-top: 1px solid #dbdbdb; margin-top:10px;">
					<h3>Post - GST, Tiruppur has Enormous Opportunities In ERP Accounting</h3>
					<span class="author vcard"><a class="url fn n" href="http://10.0.1.84/event/author/admin/">by admin, </a></span><time class="entry-date published" datetime="2018-10-12T07:17:56+00:00">October 12, 2018</time>
				</div>
				<div class="news-title" style="border-top: 1px solid #dbdbdb;margin-top:10px;">
					<h3>GST Brings Discipline IN Business Process : Gofrugal</h3>
					<span class="author vcard"><a class="url fn n" href="http://10.0.1.84/event/author/admin/">by admin, </a></span><time class="entry-date published" datetime="2018-10-12T07:17:56+00:00">October 12, 2018</time>
				</div>
				<div class="news-title" style="border-top: 1px solid #dbdbdb;margin-top:10px;" >
				<h3>Interviewing Candidates is easy now with INTERVIEWDESK!!!</h3>
				<span class="author vcard"><a class="url fn n" href="http://10.0.1.84/event/author/admin/">by admin, </a></span><time class="entry-date published" datetime="2018-10-12T07:17:56+00:00">October 12, 2018</time>
			</div>
				</div>


			<div class="col-md-6">
				<div class="" style="background-color: #FFF; padding: 30px; margin:20px;">
					<strong><span style="margin-bottom: 20px;">Your android phone is the new stock taking device, Imagine?</span></strong> 
						<img src="http://10.0.1.84/event/wp-content/uploads/2018/10/instok-image.jpg" style="display: inline-block ">
						<div  style="display: inline-block;max-width:200px;margin-left: 5px;vertical-align: top;">
							GoFrugal has recently launched Stock taking app call"GoFrugal Instock" which people can quickly takes stocks without any hassels...
						</div>
					
				</div>

			</div>
		</div>
	</div>
</div>
<!--Section Ends-->

<!--Section Start-->
<div class="container-fluid" style="height:500px;">

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
  jQuery(document).ready(function ($) {
    $('.counters').counterUp({
      delay: 10,
      time: 3000
    });
  });
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
		varctrl.slider( ctrlValue );
	} );
</script>
<!--Scripts of Sliding content-->

<?php get_footer(); ?>