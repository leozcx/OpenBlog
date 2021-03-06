var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var async = require('async');
var crypto = require('crypto');
var md = require('markdown').markdown;

var metaFile = path.join(__dirname, 'doc', 'metadata.json');
var indexFile = path.join(__dirname, 'doc', 'index.json');
var articlePath = path.join(__dirname, 'articles');
var articleUrl = '/article';
var pwdFile = path.join(__dirname, 'doc', 'passwd');
var saltFile = path.join(__dirname, 'doc', 'salt');
var admin = 'admin';

var jsonMeta = null, index = null;
;

function init() {
	load().then(loadIndex);
}

function load() {
	var promise = new Promise(function(resolve, reject) {
		if (jsonMeta)
			resolve(jsonMeta);
		fs.readFile(metaFile, {
			encoding : 'utf8'
		}, function(err, data) {
			if (err) {
				if (err.errno === 34) {
					jsonMeta = [];
					resolve(jsonMeta);
				} else
					reject(err);
			} else {
				if (data && data !== "")
					jsonMeta = JSON.parse(data);
				else
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

function loadIndex(jsonMeta) {
	var promise = new Promise(function(resolve, reject) {
		if(index)
			resolve(index);
		else {
			index = {};
			jsonMeta.forEach(function(item) {
				addIndex(item);
			});
			resolve(index);
		}
	});
	return promise;
}

function addIndex(metadata) {
	index[metadata.id] = {
		'title' : metadata.title,
		'file' : metadata.file,
		'markdown': metadata.markdown
	};
	return saveIndex(metadata);
}

function saveIndex(metadata) {
	var promise = new Promise(function(resolve, reject) {
		fs.writeFile(indexFile, JSON.stringify(index), {
			encoding : 'utf8'
		}, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve(metadata);
			}
		});
	});

	return promise;
}

function generateId() {
	var date = new Date();
	return date.getTime().toString();
	;
}

function save(article, upload) {
	return saveContent(article, upload).then(addMetadata, function(err) {
		console.log(err);
	}).then(addIndex, function(err) {
		console.log(err);
	});
}

function saveContent(article, upload) {
	var promise = new Promise(function(resolve, reject) {
		//if is upload, file is saved directly, but we need get abstract
		var file = path.join(articlePath, article.file);
		if (upload) {
			fs.readFile(file, {
				encoding : 'utf8'
			}, function(err, data) {
				if (err) {
					reject(err);
				} else {
					article.abstract = md.toHTML(getAbstract(data));
					resolve(article);
				}
			});
		} else {
			fs.writeFile(file, article.content, {
				encoding : 'utf8'
			}, function(err) {
				if (err)
					reject(err);
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
		fs.writeFile(metaFile, JSON.stringify(jsonMeta), {
			encoding : 'utf8'
		}, function(err) {
			if (err)
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
		var file = path.join(articlePath, index[id].file);
		fs.unlink(file, function(err) {
			if (err)
				reject(err);
			resolve(id);
		});
	});
	return promise;
}

function deleteMetadata(id) {
	var promise = new Promise(function(resolve, reject) {
		var len = jsonMeta.length;
		for (var i = 0; i < len; i++) {
			var item = jsonMeta[i];
			if (item.id == id) {
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

function getUser(userId) {
	return new Promise(function(resolve, reject) {
		fs.readFile(pwdFile, {
			encoding : 'utf8'
		}, function(err, data) {
			if (err)
				reject(err);
			else {
				//id:password:displayName
				var line = data.split(':');
				var user = {
					id : line[0],
					password : line[1],
					displayName : line[2]
				};
				resolve(user);
			}
		});
	});
}

function saveSalt(salt) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(saltFile, salt, {
			encoding : 'utf8'
		}, function(err) {
			if (err)
				reject(err);
			else
				resolve(salt);
		});
	});
}

function getSalt() {
	return new Promise(function(resolve, reject) {
		fs.readFile(saltFile, {
			encoding : 'utf8'
		}, function(err, data) {
			if (err)
				reject(err);
			else
				resolve(data);
		});
	});
}

function generateSalt() {
	var salt = '';
	for (var i = 0; i < 4; i++) {
		salt += Math.floor(Math.random() * 16).toString(16);
	}
	return salt;
}

function encrypt(password, salt) {
	return crypto.createHash('sha1').update(password + salt).digest('hex');
}

function verifyPassword(user, password) {
	return getSalt().then(function(salt) {
		var inputPassword = encrypt(password, salt);
		return user.password == inputPassword;
	});
}

function savePassword(userId, password) {
	return new Promise(function(resolve, reject) {
		var salt = generateSalt();
		var encryptedPassword = encrypt(password, salt);
		var content = userId + ":" + encryptedPassword + ":" + userId;
		fs.writeFile(pwdFile, content, {
			encoding : 'utf8'
		}, function(err) {
			if (err)
				reject(err);
			else {
				saveSalt(salt).then(function(salt) {
					resolve(userId);
				});
			}
		});
	});
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
exports.savePassword = savePassword;
exports.verifyPassword = verifyPassword;
exports.getUser = getUser;
exports.adminId = admin;
