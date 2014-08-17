
var fs = require('fs');
var path = require('path');
var Promise = require('promise');

var metaFile = path.join(__dirname, 'doc', 'metadata.json');
var indexFile = path.join(__dirname, 'doc', 'index.json');
var articlePath = path.join(__dirname, 'articles');
var articleUrl = '/a';

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

function updateIndex(metadata) {
	console.log("updateIndex");
	index[metadata.id] = {
		'title': metadata.title
	};
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

function save(article) {
	return saveContent(article).then(saveMetadata, function(err){
		console.log(err);
	}).then(updateIndex, function(err) {
		console.log(err);
	});
}

function saveContent(article) {
	console.log("saveContent");
	var promise = new Promise(function(resolve, reject) {
		var file = path.join(articlePath, article.id);
		fs.writeFile(file, article.content, {encoding: 'utf8'}, function (err) {
		  if (err) reject(err);
			var metadata = {
				"id" : article.id,
				"title" : article.title,
				"abstract" : getAbstract(article.content),
				"tag" : article.tag || []
			};

		  resolve(metadata);
		});
	});
	return promise;
}

function saveMetadata(metadata) {
	console.log("updateMetadata");
	jsonMeta.push(metadata);
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

function delete(id) {
	
}

function deleteContent(id) {
	var promise = new Promise(function(resolve, reject) {
		var file = path.join(articlePath, id);
		fs.unlink(file, function (err) {
		  if (err) reject(err);
		  resolve({"id": id});
		});
	});
	return promise;
}

function deleteMetadata(id) {
	
}

exports.init = init;
exports.load = load;
exports.loadIndex = loadIndex;
exports.articleUrl = articleUrl;
exports.articlePath = articlePath;
exports.generateId = generateId;
exports.save = save;
exports.delete = delete;