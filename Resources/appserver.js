var server,
	http      = require('http'),
	sys       = require("sys"),
	GitHubApi = require("github").GitHubApi,
	github    = new GitHubApi(true),
	githubUserOfConcern = 'appcelerator';
	
var ohNo = function(req, resp) {
	resp.writeHead(500, {"Content-Type": "text/plain"});  
    resp.write(err + "\n");  
    resp.close();
    return;
};
	
var getFollowers = function(req, resp) {
	github.getUserApi().getFollowers(githubUserOfConcern, function(err, followers) {
	    if(err) { ohNo(); }
	    
	    if (followers) {
	    	resp.write(JSON.stringify({users: followers}));
	    } else {
	    	resp.write(JSON.stringify({users: []}));
	    }
	    
	    resp.end();
	});
};

var getRepos = function(req, resp) {
	github.getRepoApi().getUserRepos(githubUserOfConcern, function(err, repositories) {
	    if(err) { ohNo(); }

	    if (repositories) {
	    	resp.write(JSON.stringify({repos: repositories}));
	    } else {
	    	resp.write(JSON.stringify({repos: []}));
	    }
	    
	    resp.end();
	});
};

var getRepoWatchers = function(req, resp) {
	var urlParts = req.url.split('/');
	if (urlParts && urlParts.length === 3) {
		//Valid length, so pick out the repo name
		var repo = urlParts[2];
		
		github.getRepoApi().getRepoWatchers(githubUserOfConcern, repo, function(err, watchers) {
		    if(err) { ohNo(); }

		    if (watchers) {
		    	resp.write(JSON.stringify({users: watchers}));
		    } else {
		    	resp.write(JSON.stringify({users: []}));
		    }
		    
		    resp.end();
		});
	} else {
		resp.writeHead(404, {"Content-Type": "text/plain"});  
        resp.write("404 Not Found\n");  
        resp.end(); 
        return;
	}
};

var getProfile = function(req, resp) {
	var urlParts = req.url.split('/');
	if (urlParts && urlParts.length === 3) {
		//Valid length, so pick out the username
		var username = urlParts[2];
		
		github.getUserApi().show(username, function(err, details) {
		    if(err) { ohNo(); }
		    
		    resp.write(JSON.stringify(details));
		    resp.end();
		});
	} else {
		resp.writeHead(404, {"Content-Type": "text/plain"});  
        resp.write("404 Not Found\n");  
        resp.end(); 
        return;
	}
};

server = http.createServer(function (req, resp) {
	resp.writeHead(200, {'Content-Type': 'text/plain'});
	
	if (req.url === '/get_followers') {
		getFollowers(req, resp);
	} else if (req.url === '/get_repos') {
		getRepos(req, resp);
	} else if (req.url.indexOf('/get_repo_watchers') === 0) {
		getRepoWatchers(req, resp);
	} else if (req.url.indexOf('/get_profile') === 0) {
		getProfile(req, resp);
	} else {
		resp.writeHead(404, {"Content-Type": "text/plain"});  
        resp.write("404 Not Found\n");  
        resp.end(); 
        return;
	}
}).listen(1338, "127.0.0.1");

console.log('NodeJS server now running at http://127.0.0.1:1338/');