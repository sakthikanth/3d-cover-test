console.clear();
// Adapted from http://webglfundamentals.org/webgl/lessons/webgl-image-processing.html 
// and http://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments/#WebGL_20
// and http://tympanus.net/codrops/2016/05/03/animated-heat-distortion-effects-webgl/

var image = new Image();
image.onload = function(){ render(image); }

function render(image) {

  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  document.body.appendChild(canvas);

  var gl = canvas.getContext("webgl");

  function createShader(gl,source,type){
    var shader = gl.createShader(type);
    source = document.getElementById(source).text;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  var vertexShader = createShader(gl, '2d-vertex-shader', gl.VERTEX_SHADER);
  var fragShader = createShader(gl, '2d-fragment-shader-haze-mouse', gl.FRAGMENT_SHADER);
  // setup GLSL program
  function createProgram(vertexShader, fragShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    return program;
  }
  var program = createProgram(vertexShader, fragShader);
  gl.useProgram(program);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // provide texture coordinates for the rectangle.
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);


  var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
  // set the size of the image
  gl.uniform2f(textureSizeLocation, image.width, image.height);

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // set the resolution
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  // Create a buffer for the position of the rectangle corners.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Set a rectangle the same size as the image.
  setRectangle(gl, 0, 0, image.width, image.height);

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // document.addEventListener('mousemove',function(event){
  //   var location = gl.getUniformLocation(program,"mouse");
  //   // send the mouse position as a vec2
  //   gl.uniform2f(location, event.clientX/canvas.width, event.clientY/ canvas.height);
  // });

  var fps=60; // target frame rate
  var frameDuration=1000/fps; // how long, in milliseconds, a regular frame should take to be drawn
  var time=0; // time value, to be sent to shaders, for example
  var lastTime=0; // when was the last frame drawn
  // get the location of the "time" variable in the shader
  var location = gl.getUniformLocation(program,"time");

  var i = 0;

  (function draw(elapsed){
    requestAnimationFrame(draw);

    var delta=elapsed-lastTime;
    lastTime=elapsed;
    var step=delta/frameDuration;
    time+=step;
    gl.uniform1f(location, time);

    //     i++;

    //     if ( i % 10 === 0 ) {
    //       gl.uniform1f(location, Math.random() * 200); //time);
    //     }
    gl.drawArrays(gl.TRIANGLES, 0, 6);

  }(0));

}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2]), gl.STATIC_DRAW);
}

image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAAC4CAYAAABQMybHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeZJREFUeNrs3DEKwkAQQNFE9i7aWypYeJw0OUqaHMdC0DK93kUYe0E0ReJmfa8WiTufwSZbR0T1rVTX1dKcduuomM3xep80kkeMG+fKSCiZwBE4CBwEDgIHgYPAEbgjQOAgcBA4CBwEDgJH4CBwEDgIHAQOAofP0pgPe0OdDBoZ9da+DY6/KCBwEDgIHAQOAkfgjgCBg8BB4CBwEDgIHIGDwEHgIHAQOAgcBI7AQeAgcBA4CBwEDgJH4CBwEDgIHAQOAgeBI3AQOAgcBA4CB4GDwBE4CBwEDllJOTzEtm9NohBD09ngIHAQOAgcgYPAQeAgcBA4CBwEjsBB4CBwEDgIHAQOAkfgIHAQOAgcBA4CB4EjcBA4CBwEDgIHgYPAETgIHAQOAgeBg8BB4AgcBA4CB4GDwEHg8E4q/QcOTWfKL7Z9a4ODwEHgIHAQOAgcBI7AQeAgcBA4CBwEDgJH4CBwEDgIHAQOAgeBI3BYvCyujZjyaod/uiIhh/O2wUHgIHAQOAIHgYPAQeAgcBA4CByBg8BB4CBwEDgIHASOwEHgIHAQOMyljoifP8R5vwmjKKepKb/8cLnZ4CBwBA4CB4GDwEHgIHAQOAIHgYPAQeAgcBA4CByBg8BB4CBwEDgIHARO+Z4CDAClMCF2qjPyKgAAAABJRU5ErkJggg==";  // MUST BE SAME DOMAIN!!!
