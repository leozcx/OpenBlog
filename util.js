
var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var async = require('async');

var metaFile = path.join(__dirname, 'doc', 'metadata.json');
var indexFile = path.join(__dirname, 'doc', 'index.json');
var articlePath = path.join(__dirname, 'articles');
var articleUrl = '/article';

var jsonMeta = null, index = null;;

function init() {
	load();
	loadIndex();
}

function load() {
	var promise = new Promise(function(resolve, reject) {
		if (jsonMeta)
			resolve(jsonMeta);
		fs.exists(metaFile, function(exists) {
			if (exists) {
				fs.readFile(metaFile, {
					encoding : 'utf8'
				}, function(err, data) {
					if (err) {
						reject(err);
					} else {
						if (data && data !== "")
							jsonMeta = JSON.parse(data);
						else
							jsonMeta = [];
						resolve(jsonMeta);
					}
				});
			} else {
				jsonMeta = [];
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
		if (index)
			resolve(index);
		fs.exists(indexFile, function(exists) {
			if (exists) {
				fs.readFile(indexFile, {
					encoding : 'utf8'
				}, function(err, data) {
					if (err)
						reject(err);
					else {
						if (data && data !== "")
							index = JSON.parse(data);
						else
							index = {};
						resolve(index);
					}
				});
			} else {
				index = {};
				resolve(index);
			}
		});
	});
	return promise;
}

function addIndex(metadata) {
	index[metadata.id] = {
		'title': metadata.title
	};
	return saveIndex(metadata);
}

function saveIndex(metadata) {
	var promise = new Promise(function(resolve, reject) {
		fs.writeFile(indexFile, JSON.stringify(index), {encoding: 'utf8'}, function(err) {
			if(err) {
				reject(err);
			}
			else {
				resolve(metadata);
			}
		});
	});
	
	return promise;
}

function generateId() {
	var date = new Date();
	return date.getTime().toString();;
}

function save(article, upload) {
	return saveContent(article, upload).then(addMetadata, function(err){
		console.log(err);
	}).then(addIndex, function(err) {
		console.log(err);
	});
}

function saveContent(article, upload) {
	var promise = new Promise(function(resolve, reject) {
		//if is upload, file is saved directly, but we need get abstract
		var file = path.join(articlePath, article.file);
		if(upload) {
			fs.readFile(file, {
				encoding : 'utf8'
			}, function(err, data) {
				if (err) {
					reject(err);
				} else {
					article.abstract = getAbstract(data);
					resolve(article);
				}
			});
		} else {
			fs.writeFile(file, article.content, {encoding: 'utf8'}, function (err) {
				if (err) reject(err);
				delete article.content;
				resolve(article);
			});
		}
	});
	return promise;
}

function addMetadata(metadata) {
	jsonMeta.push(metadata);
	return saveMetadata(metadata);
}

function saveMetadata(metadata) {
	var promise = new Promise(function(resolve, reject) {
		fs.writeFile(metaFile, JSON.stringify(jsonMeta), {encoding: 'utf8'}, function(err) {
			if(err) 
				reject(err);
			else {
				resolve(metadata);
			}
		});
	});
	
	return promise;
}

function getAbstract(content) {
	return content;
}

function deleteArticle(id) {
	return deleteMetadata(id).then(deleteContent).then(deleteIndex);
}

function deleteContent(id) {
	var promise = new Promise(function(resolve, reject) {
		var file = path.join(articlePath, id);
		fs.unlink(file, function (err) {
		  if (err) reject(err);
		  resolve(id);
		});
	});
	return promise;
}

function deleteMetadata(id) {
	var promise = new Promise(function(resolve, reject) {
		var len = jsonMeta.length;
		for(var i = 0; i < len; i++) {
			var item = jsonMeta[i];
			if(item.id == id) {
				jsonMeta.splice(i, 1);
				saveMetadata(id).then(resolve);
				break;
			}
		}
		resolve(id);
	});
	return promise;
}

function deleteIndex(id) {
	delete index[id];
	return saveIndex(id);
}

exports.init = init;
exports.load = load;
exports.getAbstract = getAbstract;
exports.loadIndex = loadIndex;
exports.articleUrl = articleUrl;
exports.articlePath = articlePath;
exports.generateId = generateId;
exports.save = save;
exports.deleteArticle = deleteArticle;