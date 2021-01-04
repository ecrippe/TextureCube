// Elliot Rippe
// 11/9/17

var canvas;
var gl;

var NumVertices  = 36;
var numTextures = 6;

var texCoordsArray = [];
var texture = [];
var image = [];
var points = [];
var colors = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

function configureTexture(image, id) {
    texture[id] = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture[id]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
                  gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                     gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniformli(gl.getUniformLocation(program, "texture"), 0);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord);
    
    //Initialize textures
    initializeTexture(image, "earth.jpg", 0);
    initializeTexture(image, "flowers.jpg", 1);
    initializeTexture(image, "frogs.jpg", 2);
    initializeTexture(image, "jupiter.jpg", 3);
    initializeTexture(image, "lightning.jpg", 4);
    initializeTexture(image, "stars.jpg", 5);

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    
    //event listeners for buttons
    
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
        
    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    points.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    points.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    points.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    points.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    points.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    points.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
}

function initializeTexture(myImage, fileName, id) {
    myImage[id] = new Image();
    myImage[id].onload = function() {
        configureTexture(myImage[id], id);
    }
    myImage[id].src = fileName;
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    for(var i = 0; i <numTextures; i++) {
        gl.bindTexture(gl.TEXTURE_2D, texture[i]);
        gl.drawArrays( gl.TRIANGLES, i*NumVertices/numTextures, NumVertices/numTextures );
    }
    requestAnimFrame( render );
}