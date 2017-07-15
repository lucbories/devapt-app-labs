
var fn_init_plot_options = function (arg_options) {
	arg_options = arg_options || {}

	arg_options.id   = arg_options.id ? arg_options.id : 'noname'
	arg_options.dims = Array.isArray(arg_options.dims) ? arg_options.dims : ['x', 'y', 'z']

	var default_scale = (arg_options.dims.length <= 2) ? [1,1] : ( (arg_options.dims.length == 3) ? [1,1,1] : [1,1,1,1] )
	var default_rotation = (arg_options.dims.length <= 3) ? [0,0,0] : [0,0,0,0]
	var default_origin   = (arg_options.dims.length <= 3) ? [0,0,0] : [0,0,0,0]

	arg_options.camera = arg_options.camera ? arg_options.camera : {}
	arg_options.camera.proxy = arg_options.camera.proxy ? arg_options.camera.proxy : true
	arg_options.camera.position = arg_options.camera.position ? arg_options.camera.position : [0, 0, 3]
	arg_options.camera.controls = arg_options.camera.controls ? arg_options.camera.controls : 'orbit'
	
	arg_options.ranges = arg_options.ranges ? arg_options.ranges : {}
	arg_options.ranges.x = arg_options.ranges.x ? arg_options.ranges.x : [-1, 1, 0.1]
	arg_options.ranges.y = arg_options.ranges.y ? arg_options.ranges.y : [-1, 1, 0.1]
	arg_options.ranges.z = arg_options.ranges.z ? arg_options.ranges.z : [-1, 1, 0.1]
	arg_options.ranges.t = arg_options.ranges.t ? arg_options.ranges.t : [-1, 1, 0.1]

	arg_options.space = arg_options.space ? arg_options.space : {}
	arg_options.space.type  = arg_options.space.type ? arg_options.space.type : 'cartesian'
	arg_options.space.scale = arg_options.space.scale ? arg_options.space.scale : default_scale
	arg_options.space.rotation = arg_options.space.rotation ? arg_options.space.rotation : default_rotation
	arg_options.space.origin   = arg_options.space.origin ? arg_options.space.origin : default_origin

	arg_options.grid = arg_options.grid ? arg_options.grid : {}
	
	arg_options.grid.axes    = arg_options.grid.axes    ? arg_options.grid.axes    : [1,2]
	arg_options.grid.opacity = arg_options.grid.opacity ? arg_options.grid.opacity : undefined
	arg_options.grid.width   = arg_options.grid.width   ? arg_options.grid.width   : 1

	arg_options.grid.axis = arg_options.grid.axis ? arg_options.grid.axis : {}
	arg_options.grid.axis.divider = arg_options.grid.axis.divider ? arg_options.grid.axis.divider : 10
	arg_options.grid.axis.ticks   = arg_options.grid.axis.ticks   ? arg_options.grid.axis.ticks   : undefined
	arg_options.grid.axis.labels  = arg_options.grid.axis.labels  ? arg_options.grid.axis.labels  : undefined
	arg_options.grid.axis.color   = arg_options.grid.axis.color   ? arg_options.grid.axis.color   : 'black'
	arg_options.grid.axis.width   = arg_options.grid.axis.width   ? arg_options.grid.axis.width   : 3
	arg_options.grid.axis.detail  = arg_options.grid.axis.detail  ? arg_options.grid.axis.detail  : undefined
	var axis_attributes = ['divider', 'ticks', 'labels', 'color', 'width', 'detail']
	arg_options.dims.forEach(
		function(dim_name) {
			if ( ! (dim_name in arg_options.grid.axis) )
			{
				arg_options.grid.axis[dim_name] = {}
			}
			axis_attributes.forEach(
				function (attr_name) {
					arg_options.grid.axis[dim_name][attr_name] = arg_options.grid.axis[dim_name][attr_name] ? arg_options.grid.axis[dim_name][attr_name] : arg_options.grid.axis[attr_name]
				}
			)
		}
	)
	
	arg_options.grid.ranges = arg_options.grid.ranges ? arg_options.grid.ranges : {}
	arg_options.grid.ranges.horiz = arg_options.grid.ranges.horiz ? arg_options.grid.ranges.horiz : arg_options.ranges.x
	arg_options.grid.ranges.vert  = arg_options.grid.ranges.vert  ? arg_options.grid.ranges.vert  : arg_options.ranges.y
	
	arg_options.grid.dividers = arg_options.grid.dividers ? arg_options.grid.dividers : {}
	arg_options.grid.dividers.horiz = arg_options.grid.dividers.horiz ? arg_options.grid.dividers.horiz : 10
	arg_options.grid.dividers.vert  = arg_options.grid.dividers.vert  ? arg_options.grid.dividers.vert  : 10

	arg_options.draws = arg_options.draws ? arg_options.draws : []

	return arg_options
}



var fn_init_mathbox = function(arg_options)
{
	
	// INIT MATHBOX LIBRARY
		// Orbit controls, i.e. Euler angles, with gimbal lock
		// Trackball controls, i.e. Free quaternion rotation
	var controls = arg_options.camera.controls == 'trackball' ? THREE.TrackballControls : THREE.OrbitControls
	var mathbox = mathBox(
		{
			plugins: ['core', 'controls', 'cursor', 'mathbox'],
			controls: {
				klass: controls
			}
		}
	)

	// CHECK BROWSER COMPATIBILITY
	if (mathbox.fallback) throw "WebGL not supported"

	// INIT THREE LIBRARY
	var three = mathbox.three
	three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0)

	// INIT CAMERA
	var camera = mathbox.camera(
		{
			proxy: arg_options.camera.proxy,
			position: arg_options.camera.position,
		}
	)

	return {
		mathbox:mathbox,
		three:three,
		camera:camera,
		options:arg_options,
		dims_count:arg_options.dims.length
	}
}



var fn_init_grid = function(arg_mathbox_context, arg_options)
{
	// INIT AXIS
	var axis_config = {
		width: arg_options.grid.axis.width,
	}
	if (arg_options.grid.axis.detail)
	{
		axis_config.detail = arg_options.grid.axis.detail
	}
	
	axis_config.axis = 1
	arg_mathbox_context.view.axis(axis_config)

	axis_config.axis = 2
	arg_mathbox_context.view.axis(axis_config)

	if (arg_mathbox_context.dims_count > 2)
	{
		axis_config.axis = 3
		arg_mathbox_context.view.axis(axis_config)
	}
	if (arg_mathbox_context.dims_count > 3)
	{
		axis_config.axis = 4
		arg_mathbox_context.view.axis(axis_config)
	}

	// SHOW AXIS TICKS AND LABELS
	var dims_names = arg_options.dims
	dims_names.forEach(
		function(dim_name) {
			if ( ! (dim_name in arg_options.grid.axis) )
			{
				return
			}

			var axis_config = arg_options.grid.axis[dim_name]
			if (axis_config.ticks || axis_config.labels)
			{
				// SET AXIS DIVIDER
				var scale = arg_mathbox_context.view.scale(
					{
						divide: axis_config.divider,
					}
				)

				// SET AXIS TICKS
				if (arg_options.grid.ticks)
				{
					var ticks = arg_mathbox_context.view.ticks(
						{
							width: 5,
							size: 15,
							color: 'black',
						}
					)
				}

				// SET AXIS LABELS
				if (arg_options.grid.labels)
				{
					var format = arg_mathbox_context.view.format(
						{
							digits: 2,
							weight: 'bold',
						}
					)
					var labels = arg_mathbox_context.view.label(
						{
							color: 'red',
							zIndex: 1,
						}
					)
				}
			}
		}
	)
	
	// INIT GRID
	var grid_config = {
		axes: arg_options.grid.axes,
		rangeX : arg_options.grid.ranges.horiz, 
		rangeY : arg_options.grid.ranges.vert,
		divideX: arg_options.grid.dividers.horiz,
		divideY: arg_options.grid.dividers.vert
	}
	if (arg_options.grid.opacity)
	{
		grid_config.opacity = arg_options.grid.opacity
	}
	arg_mathbox_context.view.grid(grid_config)

	arg_mathbox_context.mathbox.select('axis').set('color', arg_options.grid.axis.color)

	return arg_mathbox_context
}



var fn_init_space = function(arg_mathbox_context, arg_options)
{
	// INIT RANGES
	var dim_0 = Array.isArray(arg_options.dims) && arg_options.dims.length > 0 ? arg_options.dims[0] : 'x'
	var dim_1 = Array.isArray(arg_options.dims) && arg_options.dims.length > 1 ? arg_options.dims[1] : 'y'
	var dim_2 = Array.isArray(arg_options.dims) && arg_options.dims.length > 2 ? arg_options.dims[1] : 'z'
	var dim_3 = Array.isArray(arg_options.dims) && arg_options.dims.length > 3 ? arg_options.dims[1] : 't'

	var ranges = [arg_options.ranges[dim_0], arg_options.ranges[dim_1]]
	if (arg_mathbox_context.dims_count > 2)
	{
		ranges.push(arg_options.ranges[dim_2])
	}
	if (arg_mathbox_context.dims_count > 3)
	{
		ranges.push(arg_options.ranges[dim_3])
	}

	switch(arg_options.space.type) {
		case 'cartesian': {
			// 4 DIMENSIONS 
			if (arg_mathbox_context.dims >= 4)
			{
				arg_mathbox_context.view = arg_mathbox_context.mathbox.cartesian4(
					{
						id: arg_options.id,
						range: ranges,
						scale: arg_options.space.scale,
						rotation: arg_options.space.rotation
					}
				)
				break
			}

			// < 4 DIMENSIONS
			arg_mathbox_context.view = arg_mathbox_context.mathbox.cartesian(
				{
					id: arg_options.id,
					range: ranges,
					scale: arg_options.space.scale,
					rotation: arg_options.space.rotation
				}
			)
			break
		}
	}
	
	fn_init_grid(arg_mathbox_context, arg_options)
	
	arg_mathbox_context.mathbox.set('focus', arg_options.id)

	return arg_mathbox_context
}
