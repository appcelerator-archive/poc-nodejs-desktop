var fetchRepoList = function() {
	$.get('http://127.0.0.1:1338/get_repos', function(data) {
		var targetNode = $('#repositories'),
			jsonData   = $.parseJSON(data);
    	var repoList = new EJS({url: 'templates/repos.ejs'}).render(jsonData);
    	targetNode.html(repoList);
    	
    	$("#repolist").delegate(".repolist-link", "click", function(e){
	    	e.preventDefault();
	    	
	    	if ($(this).hasClass('repo') === true) {
	    		Titanium.Platform.openURL($(this).attr('href'));
	    	} else if ($(this).hasClass('watchercount') === true) {
	    		fetchWatchersList($(this).attr('rel'));
	    	}
	    });
	});
};

var fetchFollowersList = function() {
	$.get('http://127.0.0.1:1338/get_followers', function(data) {
		var jsonData   = $.parseJSON(data);
	    
        html = new EJS({url: 'templates/userlist.ejs'}).render(jsonData);
        generalContentOverlay.html(html);
    	generalContentOverlay.dialog('option', 'title', 'Github Followers');
    	generalContentOverlay.dialog('open');
	});
};

var fetchWatchersList = function(reponame) {
	$.get('http://127.0.0.1:1338/get_repo_watchers/' + reponame, function(data) {
		var jsonData   = $.parseJSON(data);
	    
        if (jsonData) {
        	html = new EJS({url: 'templates/userlist.ejs'}).render(jsonData);
        	generalContentOverlay.html(html);
	    	generalContentOverlay.dialog('option', 'title', 'Repo Watchers');
	    	generalContentOverlay.dialog('open');
        }
	});
};

var fetchProfile = function(username) {
	$.get('http://127.0.0.1:1338/get_profile/' + username, function(data) {
		var html,
			jsonData = $.parseJSON(data);
	    
        if (jsonData) {
        	html = new EJS({url: 'templates/profile.ejs'}).render(jsonData);
        	generalContentOverlay.html(html);
    		generalContentOverlay.dialog('option', 'title', 'User Profile');
        }
	});
};

var generalContentOverlay;
$(window).load(function() {
	generalContentOverlay = $("#general-content-overlay");
	
	generalContentOverlay.dialog({
		height: 400,
		width: 500,
		modal: true,
		resizable: false,
		draggable: false,
		autoOpen: false
	});
	
	$(window).resize(function() {
    	generalContentOverlay.dialog("option", "position", "center");
	});
	$(window).scroll(function() {
	    generalContentOverlay.dialog("option", "position", "center");
	});
	
	$('#fetch-followers').click(function(e) {
		e.preventDefault();
		fetchFollowersList();
	});
    
    $("#general-content-overlay").delegate("a.user", "click", function(e){
    	e.preventDefault();
		fetchProfile(e.target.rel);
    });
    
    $("#general-content-overlay").delegate("a.blog-link", "click", function(e){
    	e.preventDefault();
		Titanium.Platform.openURL($(this).attr('href'));
    });
});