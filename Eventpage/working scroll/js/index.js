// get width of boxes, and multiply by how many to set width of sliding container div.

// Include the 5px margin if the CSS is using one.
var _boxwidth = document.getElementById("box1").offsetWidth + 5;
var _boxCount = $('.tlBox').length;
var _tlInnerWidth = _boxwidth * _boxCount;
// set the container div width to the calculated _tlInnerWidth
TweenLite.set(".tlContent", {width: _tlInnerWidth});


//responsive timeline animation.
//values recorded once, nothing changes on resize
// var tl = new TimelineMax({repeat:-1, yoyo:true, repeatDelay:1}) 
var tl = new TimelineMax() 
// make the timeline duration equal to the number of boxes (in seconds)
tl.to(".tlContent", _boxCount, {xPercent:-100, force3D:true});
tl.pause();
// tl.play(); 

varctrl = $("#slider"),
ctrlValue = {value:0}; 

varctrl.slider({
  range: false,
  min: 0,
  max: 100,
  step:.1,
  start:function() {
    tl.pause();
  },
  slide: function ( event, ui ) {
    tl.progress( ui.value / 100 );
  }
  // },
  // stop:function() {
  //   tl.play();
  // }
});

tl.eventCallback("onUpdate", function() {
  ctrlValue.value = tl.progress() * 100;
  varctrl.slider(ctrlValue);
});