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
		font-size: 14px;
	 	}
	
	.tabs ul {
		list-style-type: none;
    	padding-left: 0px;
    	display: flex;
    	flex-direction: row;
    	margin-bottom: 0px;
    	justify-content: space-between;
    	align-items: flex-end;
    	flex-wrap: wrap;
    	border-bottom: 1px solid #d7e3ed;
    	padding-bottom: 7px;
    	width: 75%;
    	margin: 0 auto;
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
		width: 180px;
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
		left: 43%;
		top: 100%;
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
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
	label {
    margin-bottom: 0;
	font-weight: normal;
}
.tabs input[name="tab-control"]:nth-of-type(1):checked~ ul> li:nth-child(1)> label { font-weight: bold; }
.tabs input[name="tab-control"]:nth-of-type(2):checked~ ul> li:nth-child(2)> label { font-weight: bold; }
.tabs input[name="tab-control"]:nth-of-type(3):checked~ ul> li:nth-child(3)> label { font-weight: bold; }
.tabs input[name="tab-control"]:nth-of-type(4):checked~ ul> li:nth-child(4)> label { font-weight: bold; }

	
	@media (max-width: 600px) {
		.tabs input[name="tab-control"]:nth-of-type(1):checked~ ul> li:nth-child(1)> label {
			background: rgba(0, 0, 0, 0.08);
		}
	}
	
	.tabs input[name="tab-control"]:nth-of-type(1):checked~ .slider {
		-webkit-transform: translateX(36%);
		transform: translateX(36%);
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
		-webkit-transform: translateX(112%);
		transform: translateX(112%);
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
		-webkit-transform: translateX(186%);
		transform: translateX(186%);
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
		-webkit-transform: translateX(261%);
		transform: translateX(261%);
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
		
		/* toggle this on/off to see the start/end positions of the content div */
		overflow: hidden;
	}
	
	.slider_cont_1,
	.slider_cont_2,.slider_cont_3 {
		/*   holder of the boxes */
		width: 12000px;
		height: 100%;
		top: 0;
		left: 0;
		position: relative;
	}
	
	.tlBox {
		width: 220px;
		height: 180px;
		margin: 10px 18px 0 0;
		float: left;
		text-align: center;
		color: #fff;
		display: block;
		/*border: 2px solid blue;*/
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
    float: right;
    margin-top: 5px;
}
.acolor_u_b:hover
{
color: #397BF3;	
text-decoration: underline;
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
<!--

	<form method="post" action="">
		<input type="hidden" name="cat-slider">
				
		<input type="submit" value="cat-slider">
		
	</form>	
-->
	
		<!--<button class="button">cat-news</button>
	<script>
		$('.button').click(function() {
			
			$.ajax({  type: "POST",  url: "http://10.0.1.84/event/wp-content/themes/sparkling/category-filter.php",  data: { catname: "cat-news" },  dataType: 'json',	 
}).done(function(response) {
	 response.result
});   	
			
			
//			 $.post("http://10.0.1.84/event/wp-content/themes/sparkling/category-filter.php", { 
//        catname: 'cat-news' 
//    }, function(data){
//
//        var theResult = data;
//}, 'json' );
		
			
			
    });
								</script>-->

		<input type="hidden" class="buttval" value="cat-slider">
		
		
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
				<!-- section1 -->
				<section>
					<div>
						<!--Code of sliding content-->

						<div class="tlContainer clearfix">
			
						<div class="slider_cont_1">
			<script>				
							
									
	
							<?php 
			
			$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1, 'category_name' =>  $catname ));?>
							</script>
	
								<?php if ( $wpb_all_query->have_posts() ) : ?>
								<?php
								$year_count = array( '2018' => 1, '2017' => 1, '2016' => 1, '2015' => 1, '2014' => 1, '2013' => 1, '2012' => 1, '2011' => 1, '2010' => 1, '2009' => 1, '2008' => 1, '2007' => 1, '2006' => 1, '2005' => 1, '2004' => 1 );
								?>
								<!-- the loop - year wise post count -->
								<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>
								<div id="box1" class="tlBox <?php echo get_the_date( 'Y' ); ?>" style="color: #000;">
									<a href="<?php the_permalink(); ?>">
										<?php  
									   the_post_thumbnail( 'medium' );
										 the_title(); 
										?>
										<?php $year=get_the_date( 'Y' ); ?>
									</a>
									<!-- <?php


									if ( $year == "2018" ) {
										$year_count[ 0 ] = $year_count[ 0 ] + 1;
										//echo( $year . $year_count[ 0 ] );
									} else if ( $year == "2017" ) {
										$year_count[ 1 ] = $year_count[ 1 ] + 1;
										//echo( $year . $year_count[ 1 ] );
									} else if ( $year == "2016" ) {
										$year_count[ 2 ] = $year_count[ 2 ] + 1;
										//echo( $year . $year_count[ 2 ] );
									} else if ( $year == "2015" ) {
										$year_count[ 3 ] = $year_count[ 3 ] + 1;
										echo( $year . $year_count[ 3 ] );
									} else if ( $year == "2014" ) {
										$year_count[ 4 ] = $year_count[ 4 ] + 1;
										echo( $year . $year_count[ 4 ] );
									} else if ( $year == "2013" ) {
										$year_count[ 5 ] = $year_count[ 5 ] + 1;
										echo( $year . $year_count[ 5 ] );
									} else if ( $year == "2012" ) {
										$year_count[ 6 ] = $year_count[ 6 ] + 1;
										echo( $year . $year_count[ 6 ] );
									} else if ( $year == "2011" ) {
										$year_count[ 7 ] = $year_count[ 7 ] + 1;
										echo( $year . $year_count[ 7 ] );
									} else if ( $year == "2010" ) {
										$year_count[ 8 ] = $year_count[ 8 ] + 1;
										echo( $year . $year_count[ 8 ] );
									} else if ( $year == "2009" ) {
										$year_count[ 9 ] = $year_count[ 9 ] + 1;
										echo( $year . $year_count[ 9 ] );
									} else if ( $year == "2008" ) {
										$year_count[ 10 ] = $year_count[ 10 ] + 1;
										echo( $year . $year_count[ 10 ] );
									} else if ( $year == "2007" ) {
										$year_count[ 11 ] = $year_count[ 11 ] + 1;
										echo( $year . $year_count[ 11 ] );
									} else if ( $year == "2006" ) {
										$year_count[ 12 ] = $year_count[ 12 ] + 1;
										echo( $year . $year_count[ 12 ] );
									} else if ( $year == "2005" ) {
										$year_count[ 13 ] = $year_count[ 13 ] + 1;
										echo( $year . $year_count[ 13 ] );
									} else if ( $year == "2004" ) {
										$year_count[ 14 ] = $year_count[ 14 ] + 1;
										echo( $year . $year_count[ 14 ] );
									}

									?> -->
									<?php $y=2018;
									$i=0;
									for($i=0; $i<=14;$i++){
									if ( $year == $y ) {
										$year_count[ $i ] = $year_count[ $i ] + 1;
										//echo( $year . $year_count[ 0 ] );
									}
									$y=$y-1;
									$i=$i+1;	
									}

									
									?>
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
					<div class="col-md-12" style="margin-top: 15px; color:#eee;">

						<?php

						for($y=2018; $y>=2005; $y--){
echo('<span><a href="javascript:void(0);" onclick="myFunction('.$y.')";>'.$y.'</a></span>|');
					}

						 ?>
						
						<span><a href="javascript:void(0);" onclick="myFunction(2004);">2004</a></span>

						<script>
							function myFunction( year ) {


								switch ( year ) {
									case 2018:
										<?php
	$leftVar  = "-".(0*238)."px";
	//echo "var leftu = '{$leftVar}';"; to convert php variable to script variable
 
?>
										$( ".2018" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 0 );
										return year;
										break;
									case 2017:
										<?php
	$leftVar  = "-".($year_count[0]*238)."px";
	
 
?>

										$( ".2017" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 10 );
										return year;
										break;

									case 2016:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1])*238)."px";
	
 
?>

										$( ".2016" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 17 );
										return year;

										break;
									case 2015:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2])*238)."px";
	
 
?>

										$( ".2015" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );

										$( "#year_slider_1" ).slider( 'value', 23 );
										return year;
										break;
									case 2014:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3])*238)."px";
	
 
?>

										$( ".2014" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 30 );
										return year;
										break;
									case 2013:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4])*238)."px";
	
 
?>

										$( ".2013" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 36 );
										return year;
										break;
									case 2012:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5])*238)."px";
	
 
?>

										$( ".2012" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 43 );
										return year;
										break;
									case 2011:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2011" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 50 );
										return year;
										break;
									case 2010:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2010" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 56 );
										return year;
										break;
									case 2009:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2009" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 62 );
										return year;
										break;
									case 2008:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2008" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 69 );
										return year;
										break;
									case 2007:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2007" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 75 );
										return year;
										break;
									case 2006:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2006" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 81 );
										return year;
										break;
									case 2005:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2005" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 88 );
										return year;
										break;
									case 2004:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12]+$year_count[13])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2004" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 94 );
										return year;
										break;
								}

							}
						</script>

					</div>
				</section>
				<!-- section2 -->
				<section>

					<div>
						<!--Code of sliding content-->

						<div class="tlContainer clearfix">
							<div class="slider_cont_2">





								<?php 
// the query
$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1 , 'category_name' => 'cat-ceotalk')); ?>


								<?php  if ( $wpb_all_query->have_posts() ) : ?>



								<!-- the loop -->
								<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>
								<div id="box1" class="tlBox" style="color: #000;">
									<a href="<?php the_permalink(); ?>">
										<?php the_title();   ?>

										<li class="icon-date">
											<?php echo get_the_date( 'Y' ); ?>
										</li>
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
<div class="col-md-12" style="margin-top: 15px; color:#eee;">

						<?php

						for($y=2018; $y>=2005; $y--){
echo('<span><a href="javascript:void(0);" onclick="myFunction('.$y.')";>'.$y.'</a></span>|');
					}

						 ?>
						
						<span><a href="javascript:void(0);" onclick="myFunction(2004);">2004</a></span>

						<script>
							function myFunction( year ) {


								switch ( year ) {
									case 2018:
										<?php
	$leftVar  = "-".(0*238)."px";
	//echo "var leftu = '{$leftVar}';"; to convert php variable to script variable
 
?>
										$( ".2018" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 0 );
										return year;
										break;
									case 2017:
										<?php
	$leftVar  = "-".($year_count[0]*238)."px";
	
 
?>

										$( ".2017" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 10 );
										return year;
										break;

									case 2016:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1])*238)."px";
	
 
?>

										$( ".2016" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 17 );
										return year;

										break;
									case 2015:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2])*238)."px";
	
 
?>

										$( ".2015" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );

										$( "#year_slider_2" ).slider( 'value', 23 );
										return year;
										break;
									case 2014:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3])*238)."px";
	
 
?>

										$( ".2014" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 30 );
										return year;
										break;
									case 2013:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4])*238)."px";
	
 
?>

										$( ".2013" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 36 );
										return year;
										break;
									case 2012:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5])*238)."px";
	
 
?>

										$( ".2012" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 43 );
										return year;
										break;
									case 2011:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2011" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 50 );
										return year;
										break;
									case 2010:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2010" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 56 );
										return year;
										break;
									case 2009:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2009" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 62 );
										return year;
										break;
									case 2008:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2008" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 69 );
										return year;
										break;
									case 2007:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2007" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 75 );
										return year;
										break;
									case 2006:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2006" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 81 );
										return year;
										break;
									case 2005:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2005" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 88 );
										return year;
										break;
									case 2004:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12]+$year_count[13])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2004" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_2" ).slider( 'value', 94 );
										return year;
										break;
								}

							}
						</script>

					</div>



					</div>
				</section>
				<!-- section3 -->
				<section>
					<div>
						<!--Code of sliding content-->

						<div class="tlContainer clearfix">
			
						<div class="slider_cont_3">
			<script>				
							
									
	
							<?php 
			
			$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1, 'category_name' =>  $catname ));?>
							</script>
	
								<?php if ( $wpb_all_query->have_posts() ) : ?>
								<?php
								$year_count = array( '2018' => 1, '2017' => 1, '2016' => 1, '2015' => 1, '2014' => 1, '2013' => 1, '2012' => 1, '2011' => 1, '2010' => 1, '2009' => 1, '2008' => 1, '2007' => 1, '2006' => 1, '2005' => 1, '2004' => 1 );
								?>
								<!-- the loop - year wise post count -->
								<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>
								<div id="box1" class="tlBox <?php echo get_the_date( 'Y' ); ?>" style="color: #000;">
									<a href="<?php the_permalink(); ?>">
										<?php  
									   the_post_thumbnail( 'medium' );
										/*the_title();*/
										?>
										<?php $year=get_the_date( 'Y' ); ?>
									</a>
									<?php $y=2018;
									$i=0;
									for($i=0; $i<=14;$i++){
									if ( $year == $y ) {
										$year_count[ $i ] = $year_count[ $i ] + 1;
										//echo( $year . $year_count[ 0 ] );
									}
									$y=$y-1;
									$i=$i+1;	
									}

									
									?>
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
						<div id="year_slider_3"></div>

						<!--Code of sliding content-->

 					</div>
					<div class="col-md-12" style="margin-top: 15px; color:#eee;">

						<?php

						for($y=2018; $y>=2005; $y--){
echo('<span><a href="javascript:void(0);" onclick="myFunction('.$y.')";>'.$y.'</a></span>|');
					}

						 ?>
						
						<span><a href="javascript:void(0);" onclick="myFunction(2004);">2004</a></span>
					 

						<script>
							function myFunction( year ) {


								switch ( year ) {
									case 2018:
										<?php
	$leftVar  = "-".(0*238)."px";
	//echo "var leftu = '{$leftVar}';"; to convert php variable to script variable
 
?>
										$( ".2018" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 0 );
										return year;
										break;
									case 2017:
										<?php
	$leftVar  = "-".($year_count[0]*238)."px";
	
 
?>

										$( ".2017" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 10 );
										return year;
										break;

									case 2016:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1])*238)."px";
	
 
?>

										$( ".2016" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 17 );
										return year;

										break;
									case 2015:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2])*238)."px";
	
 
?>

										$( ".2015" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );

										$( "#year_slider_3" ).slider( 'value', 23 );
										return year;
										break;
									case 2014:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3])*238)."px";
	
 
?>

										$( ".2014" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 30 );
										return year;
										break;
									case 2013:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4])*238)."px";
	
 
?>

										$( ".2013" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 36 );
										return year;
										break;
									case 2012:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5])*238)."px";
	
 
?>

										$( ".2012" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 43 );
										return year;
										break;
									case 2011:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2011" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 50 );
										return year;
										break;
									case 2010:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2010" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 56 );
										return year;
										break;
									case 2009:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2009" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 62 );
										return year;
										break;
									case 2008:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2008" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 69 );
										return year;
										break;
									case 2007:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2007" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 75 );
										return year;
										break;
									case 2006:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2006" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 81 );
										return year;
										break;
									case 2005:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2005" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 88 );
										return year;
										break;
									case 2004:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12]+$year_count[13])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2004" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_3" ).slider( 'value', 94 );
										return year;
										break;
								}

							}
						</script>

					</div>
				</section>
				<!-- section4 -->
				<section>
					<div>
						<!--Code of sliding content-->

						<div class="tlContainer clearfix">
			
						<div class="slider_cont_3">
			<script>				
							
									
	
							<?php 
			
			$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>-1, 'category_name' =>  $catname ));?>
							</script>
	
								<?php if ( $wpb_all_query->have_posts() ) : ?>
								<?php
								$year_count = array( '2018' => 1, '2017' => 1, '2016' => 1, '2015' => 1, '2014' => 1, '2013' => 1, '2012' => 1, '2011' => 1, '2010' => 1, '2009' => 1, '2008' => 1, '2007' => 1, '2006' => 1, '2005' => 1, '2004' => 1 );
								?>
								<!-- the loop - year wise post count -->
								<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>
								<div id="box1" class="tlBox <?php echo get_the_date( 'Y' ); ?>" style="color: #000;">
									<a href="<?php the_permalink(); ?>">
										<?php  
									   the_post_thumbnail( 'medium' );
										/*the_title();*/
										?>
										<?php $year=get_the_date( 'Y' ); ?>
									</a>
									<?php $year=get_the_date( 'Y' ); ?>
									</a>
									<?php $y=2018;
									$i=0;
									for($i=0; $i<=14;$i++){
									if ( $year == $y ) {
										$year_count[ $i ] = $year_count[ $i ] + 1;
										//echo( $year . $year_count[ 0 ] );
									}
									$y=$y-1;
									$i=$i+1;	
									}

									
									?>
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
						<div id="year_slider_3"></div>

						<!--Code of sliding content-->

 					</div>
					<div class="col-md-12" style="margin-top: 15px; color:#eee;">

						<?php

						for($y=2018; $y>=2005; $y--){
echo('<span><a href="javascript:void(0);" onclick="myFunction('.$y.')";>'.$y.'</a></span>|');
					}

						 ?>
						
						<span><a href="javascript:void(0);" onclick="myFunction(2004);">2004</a></span>

						<script>
							function myFunction( year ) {


								switch ( year ) {
									case 2018:
										<?php
	$leftVar  = "-".(0*238)."px";
	//echo "var leftu = '{$leftVar}';"; to convert php variable to script variable
 
?>
										$( ".2018" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 0 );
										return year;
										break;
									case 2017:
										<?php
	$leftVar  = "-".($year_count[0]*238)."px";
	
 
?>

										$( ".2017" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 10 );
										return year;
										break;

									case 2016:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1])*238)."px";
	
 
?>

										$( ".2016" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 17 );
										return year;

										break;
									case 2015:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2])*238)."px";
	
 
?>

										$( ".2015" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );

										$( "#year_slider_1" ).slider( 'value', 23 );
										return year;
										break;
									case 2014:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3])*238)."px";
	
 
?>

										$( ".2014" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 30 );
										return year;
										break;
									case 2013:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4])*238)."px";
	
 
?>

										$( ".2013" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 36 );
										return year;
										break;
									case 2012:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5])*238)."px";
	
 
?>

										$( ".2012" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 43 );
										return year;
										break;
									case 2011:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2011" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 50 );
										return year;
										break;
									case 2010:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2010" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 56 );
										return year;
										break;
									case 2009:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2009" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 62 );
										return year;
										break;
									case 2008:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2008" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 69 );
										return year;
										break;
									case 2007:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2007" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 75 );
										return year;
										break;
									case 2006:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>

										$( ".2006" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 81 );
										return year;
										break;
									case 2005:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2005" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 88 );
										return year;
										break;
									case 2004:
										<?php
	$leftVar  = "-".(($year_count[0]+$year_count[1]+$year_count[2]+$year_count[3]+$year_count[4]+$year_count[5]+$year_count[6]+$year_count[7]+$year_count[8]+$year_count[9]+$year_count[10]+$year_count[11]+$year_count[12]+$year_count[13])*238)."px";
	echo "var leftu = '{$leftVar}';";
 
?>
										$( ".2004" ).parent().css( {
											"transform": "translate3d(<?php echo $leftVar; ?>, 0px, 0px)",
											"transition": "ease 2s"
										} );
										$( "#year_slider_1" ).slider( 'value', 94 );
										return year;
										break;
								}

							}
						</script>

					</div>
				</section>
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



				<div class="news-title" style="border-bottom: 1px solid #dbdbdb; margin-bottom: 5px; padding-bottom: 15px; ">
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
				<div class="" style="background-color: #FFF;margin: 40px 0 5px 0px;padding: 40px 0px 35px 20px;box-shadow: 0px 0px 3px 2px #ccc;">
					<?php 
				// the query	
				$wpb_all_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'posts_per_page'=>1 , 'category_name' => 'cat-pressrelease')); ?>


					<?php  if ( $wpb_all_query->have_posts() ) : ?>



					<!-- the loop -->
					<?php while ( $wpb_all_query->have_posts() ) : $wpb_all_query->the_post(); ?>



					<div class="news-title">
						<h3 style="line-height: 1.5;" class="entry-title">
							<?php the_title();?>
						</h3>
						<?php the_post_thumbnail( 'medium' ); ?>
						<div style="display: inline-block;max-width:200px;margin-left: 10px;vertical-align: top; margin-top: -6px;">
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

			<img src="http://localhost/event/wp-content/uploads/2018/10/credentional-logo.jpg" style="margin-top: 40px;">
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

		var tl2 = new TimelineMax()
		// make the timeline duration equal to the number of boxes (in seconds)
	tl2.to( ".slider_cont_3", _boxCount, {
		xPercent: -100,
		force3D: true
	} );
	tl2.pause();
	// tl.play();

	varctrl = $( "#year_slider_1" ),
		ctrlValue = {
			value: 0
		};
	varctrl2 = $( "#year_slider_2" ),
		ctrlValue = {
			value: 0
		};
	varctrl3 = $( "#year_slider_3" ),
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
	tl2.eventCallback( "onUpdate", function () {
		ctrlValue.value = tl2.progress() * 100;
		varctrl3.slider( ctrlValue );
	} );
</script>
<!--Scripts of Sliding content-->

<?php get_footer(); ?>