
var fs = require('fs');
var path = require('path');
var Promise = require('promise');

var metaFile = path.join(__dirname, 'doc', 'metadata.json');
var indexFile = path.join(__dirname, 'doc', 'index.json');
var articlePath = path.join(__dirname, 'articles');
var articleUrl = '/a';

var jsonMeta = null, index = null;;

function load() {
	var promise = new Promise(function(resolve, reject) {
		fs.readFile(metaFile, {encoding: 'utf8'}, function(err, data) {
			if(err) 
				reject(err);
			else {
				jsonMeta = JSON.parse(data);
				resolve(jsonMeta);
			}
		});
	});
	
	return promise;
}

function unload() {
	jsonMeta = null;
}

function update() {
	
}

function loadIndex() {
	var promise = new Promise(function(resolve, reject) {
		if(index) return index;
		fs.readFile(indexFile, {encoding: 'utf8'}, function(err, data) {
			if(err) 
				reject(err);
			else {
				index = JSON.parse(data);
				resolve(index);
			}
		});
	});
	
	return promise;
}

function updateIndex() {
	
}

exports.load = load;
exports.loadIndex = loadIndex;
exports.articleUrl = articleUrl;
exports.articlePath = articlePath;