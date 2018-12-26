const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const resizeImg = require('resize-img')
const opts =  require('./opts')
function reduceImg( dimensions, expectedWidth ) {
    if (dimensions.width > expectedWidth) {
        return {
            width : expectedWidth,
            height: dimensions.height * expectedWidth / dimensions.width
        }
    }
    else{
        return dimensions
    }
}
fs.readdirSync( opts.dirs.original ).forEach( file => {
    const dimensions = sizeOf( path.join( opts.dirs.original, file ) )
    Object.keys(opts.resos).forEach( reso => {
        if ( !fs.existsSync( path.join( opts.dirs.imgFolder, opts.resos[reso].prefix, file ) ) ) {
            reso = opts.resos[reso]
            // create dir if necessary
            let dir = path.join( opts.dirs.imgFolder, reso.prefix )
            if ( !fs.existsSync( dir ) ) fs.mkdirSync(dir) 
            // get new dimensions
            const newDims = reduceImg( dimensions, reso.width )
            // create new resized img
            resizeImg( fs.readFileSync( path.join( opts.dirs.original, file ) ), {width: newDims.width, height: newDims.height} ).then( buf => {
                fs.writeFileSync( path.join( opts.dirs.imgFolder, reso.prefix, file ), buf)
            })
        }
    })
})