'use strict'

var Filter = require('broccoli-filter')
var Webp = require('cwebp')
var optional = require('optional')

function newWebp (source) {
	var npm_bin = optional('cwebp-bin')
	if (npm_bin !== null) {
		return new Webp(source, npm_bin)
	} else {
		return new Webp(source)
	}
}

WebPFilter.prototype = Object.create(Filter.prototype)

WebPFilter.prototype.constructor = WebPFilter
function WebPFilter (inputNode, options) {
	if (!(this instanceof WebPFilter)) {
		return new WebPFilter(inputNode, options)
	}

	Filter.call(this, inputNode)
	this.options = options || {}
}


WebPFilter.prototype.extensions = ['png', 'jpg', 'jpeg']
WebPFilter.prototype.targetExtension = 'webp'

WebPFilter.prototype.processFile = function (srcDir, destDir, relativePath) {
	var webp = newWebp(srcDir + '/' + relativePath)
	webp.multiThreading(true)
	var options = this.options
	;['quality', 'alphaQuality', 'compression'].forEach(function (prop) {
		if (typeof options[prop] === 'number') webp[prop](options[prop])
	})
	if (relativePath.slice(0, -3) === 'png') webp.lossless(true)
	// cwebp's write method returns a promise! How convenient :-)
	return webp.write(destDir + '/' + this.getDestFilePath(relativePath))
}

module.exports = WebPFilter
