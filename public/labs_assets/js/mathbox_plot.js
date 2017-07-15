
var fn_plot = function (Xxit, Yxit, Zxit, arg_options)
{
	// INIT OPTIONS
	arg_options = fn_init_plot_options(arg_options)
	console.log('fn_plot2d:options=', arg_options)

	// INIT MATHBOX LIBRARY
	var mathbox_context = fn_init_mathbox(arg_options)
	console.log('fn_plot2d:mathbox_context=', mathbox_context)

	// INIT MATHBOX PLOTTING SPACE
	mathbox_context = fn_init_space(mathbox_context, arg_options)

	// INIT CALCULUS FUNCTIONS
	var data = undefined
	switch(mathbox_context.dims_count + '')
	{
		case '2': {
			data = mathbox_context.view.interval(
				{
					expr: function (emit, x, i, time, delta) {
						emit( Xxit(x, i, time), Yxit(x, i, time), Zxit(x, i, time) )
					},
					width: arg_options.draws[0].steps.width,
					channels: 2,
				}
			)
			break
		}
		case '3': {
			data = mathbox_context.view.area(
				{
					expr: function (emit, x, y, i, j, time, delta) {
						emit( Xxit(x, y, i, j, time, delta), Yxit(x, y, i, j, time, delta), Zxit(x, y, i, j, time, delta) )
					},
					width: arg_options.draws[0].steps.width,
					height:arg_options.draws[0].steps.height,
					channels: 3,
				}
			)
			break
		}
		default:{
			throw 'Bad dimensions [' + mathbox_context.dims_count + ']'
		}
	}

	// INIT PLOTTING
	var draw = arg_options.draws[0]
	switch(draw.type) {
		case 'curve':{
			draw.shape = mathbox_context.view.line(
				{
					width: draw.size,
					color: draw.color
				}
			)
			break
		}
		case 'point':{
			draw.shape = mathbox_context.view.point(
				{
					size: draw.size,
					color: draw.color
				}
			)
			break
		}
		case 'face':{
			draw.shape = mathbox_context.view.face(
				{
					// size: draw.size,
					color: draw.color
				}
			)
			break
		}
		case 'strip':{
			draw.shape = mathbox_context.view.strip(
				{
					size: draw.size,
					color: draw.color
				}
			)
			break
		}
		case 'surface':{
			var colors_datas = mathbox_context.view.area(
				{
					expr:function(emit, x, y, i, j, t) 
						{ 
							var z = Math.sin(1*x + 1*x*y)
							var percent = (z - (-0.5)) / (0.5 - (-0.5))
							emit( percent, percent, percent, 1.0 )
						},
					axes: [1,3],
					width: arg_options.draws[0].steps.width,
					height:arg_options.draws[0].steps.height,
					channels: 4, // RGBA
				}
			)
			draw.shape = mathbox_context.view.surface(
				{
					color: draw.color,
					fill:false,
					shaded:false,
					lineX:true,
					lineY:true,
					visible:true,
					colors:colors_datas,
					points:data
				}
			)
			break
		}
	}
}
/*
if (graphColorStyle == "Grayscale")
		{
			// zMax = white, zMin = black
			graphColors.set("expr", 
				function (emit, x, y, i, j, t) 
				{ 
					var z = zFunc(x,y);
					var percent = (z - zMin) / (zMax - zMin);
					emit( percent, percent, percent, 1.0 );
				}
			);
		}
		else if (graphColorStyle == "Rainbow")
		{
			// rainbow hue; zMax = red, zMin = violet			
			graphColors.set("expr", 
				function (emit, x, y, i, j, t) 
				{ 
					var z = zFunc(x,y);
					var percent = (z - 1.2 * zMin) / (zMax - 1.2 * zMin);
					var color = new THREE.Color( 0xffffff );
					color.setHSL( 1-percent, 1, 0.5 );
					emit( color.r, color.g, color.b, 1.0 );
				}
			);
		}
		else if (graphColorStyle == "Solid Blue")
		{
			// just a solid blue color			
			graphColors.set("expr", 
				function (emit, x, y, i, j, t) 
				{ 
					emit( 0.5, 0.5, 1.0, 1.0 );
				}
			);
		}
*/


var fn_plot2d = function(arg_config)
{
	if (! arg_config || ! arg_config.type) throw 'Bad plot2d config'
	console.log('fn_plot2d:config=', arg_config)

	var options = {
		id:'space1',
		camera:{
			proxy:true,
			position:[0, 0, 3],
			controls:'orbit'
		},
		grid:{
			axes:[1,3],
			axis:{
				color:'red',
				width:5,
				divider:10,
				ticks:true,
				labels:true,
				'x':{
					color:'blue',
					width:3,
					divider:5,
					ticks:false,
					labels:true
				}
			},
			ranges:{
				// horiz:[-1,1]
			},
			dividers:{
				horiz:10,
				vert:10
			}
		},
		draws:[
			{
				type:'surface',
				size:1,
				color: 'green', //'#3090FF',
				steps:{
					width:10,
					height:10
				}
			}
		]
	}

	switch(arg_config.type)
	{
		case 'y(x)':{
			var x_config = Array.isArray(arg_config.x) ? arg_config.x : [0, 1, 0.1]
			var x_start = x_config.length > 0 ?x_config[0] : 0
			var x_end   = x_config.length > 1 ?x_config[1] : 1
			var x_step  = x_config.length > 2 ?x_config[2] : 0.1
			var x_steps = Math.ceil( (x_end - x_start) / x_step )
			var fn_x    = function(x, i, t) { return x_start + i * x_step }
			var range_x = [x_start, x_end, x_step]

			var y_config = arg_config.y
			var fn_y = function(x, i, t, delta) {
				return y_config(x)
			}
			var range_y = [-1, 1, 0.1]

			var fn_z = function() { return 0 }
			// var fn_z = function() { return Math.random() }
			var range_z = [-1, 1, 0.1]
			
			var dim_0 = 'x'
			var dim_1 = 'z'
			var dim_2 = 'y'

			options.dims = [dim_0, dim_1]
			options.ranges = {
				x:range_x,
				y:range_y,
				z:range_z
			}
			options.space = {
				type:'cartesian',
				scale:[1,1],
				rotation:[0,0,0]
			}
			options.draws[0].steps.width = x_steps
			options.draws[0].steps.height = 0

			fn_plot(fn_x, fn_y, fn_z, options)
			return
		}
		case 'z(x,y)':{
			var x_config = Array.isArray(arg_config.x) ? arg_config.x : [0, 1, 0.1]
			var x_start = x_config.length > 0 ? x_config[0] : 0
			var x_end   = x_config.length > 1 ? x_config[1] : 1
			var x_step  = x_config.length > 2 ? x_config[2] : 0.1
			var x_steps = Math.ceil( (x_end - x_start) / x_step )
			var fn_x    = function(x, y, i, j, t) { return x_start + i * x_step }
			var range_x = [x_start, x_end, x_step]

			var y_config = Array.isArray(arg_config.y) ? arg_config.y : [0, 1, 0.1]
			var y_start = y_config.length > 0 ? y_config[0] : 0
			var y_end   = y_config.length > 1 ? y_config[1] : 1
			var y_step  = y_config.length > 2 ? y_config[2] : 0.1
			var y_steps = Math.ceil( (y_end - y_start) / y_step )
			var fn_y    = function(x, y, i, j, t) { return y_start + j * y_step }
			var range_y = [y_start, y_end, y_step]

			var z_config = arg_config.z
			var fn_z = function(x, y, i, j, t, delta) {
				// return x + y
				return z_config(x, y)
			}
			var range_z = [-1, 1, 0.1]

			var dim_0 = 'x'
			var dim_1 = 'z'
			var dim_2 = 'y'

			options.dims = [dim_0, dim_1, dim_2]

			options.ranges = {}
			options.ranges[dim_0] = range_x
			options.ranges[dim_1] = range_y
			options.ranges[dim_2] = range_z

			options.space = {
				type:'cartesian',
				scale:[1,1,1],
				rotation:[0,0,0]
			}
			options.draws[0].steps.width = x_steps
			options.draws[0].steps.height = y_steps

			fn_plot(fn_x, fn_z, fn_y, options)
			return
		}
	}

	throw 'Bad plot2d type [' + arg_config.type + ']'
}

