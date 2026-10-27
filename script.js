
/* =================================================
   CONNECTX SOCIAL MEDIA APP
   HTML + CSS + JAVASCRIPT + LOCAL STORAGE
================================================= */


/* ================= DATA ================= */

let users =
    JSON.parse(localStorage.getItem("users")) || [];

let posts =
    JSON.parse(localStorage.getItem("posts")) || [];

let currentUser =
    localStorage.getItem("currentUser");


/* ================= PAGE ELEMENTS ================= */

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const appPage =
    document.getElementById("appPage");

const feed =
    document.getElementById("feed");

const peopleList =
    document.getElementById("peopleList");

const profileSection =
    document.getElementById("profileSection");


/* ================= START ================= */

if (currentUser) {

    showApp();

} else {

    showLogin();

}


/* ================= LOGIN PAGE ================= */

function showLogin() {

    loginPage.classList.remove("hidden");

    registerPage.classList.add("hidden");

    appPage.classList.add("hidden");
}


/* ================= REGISTER PAGE ================= */

function showRegister() {

    loginPage.classList.add("hidden");

    registerPage.classList.remove("hidden");

    appPage.classList.add("hidden");
}


/* ================= REGISTER ================= */

function register() {

    const username =
        document
        .getElementById("registerUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("registerPassword")
        .value
        .trim();


    if (username === "" || password === "") {

        alert("Please fill all fields");

        return;
    }


    const existingUser =
        users.find(function(user) {

            return user.username === username;

        });


    if (existingUser) {

        alert("Username already exists");

        return;
    }


    const newUser = {

        username: username,

        password: password,

        followers: [],

        following: []

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    alert("Registration successful!");


    document
        .getElementById("registerUsername")
        .value = "";

    document
        .getElementById("registerPassword")
        .value = "";


    showLogin();
}


/* ================= LOGIN ================= */

function login() {

    const username =
        document
        .getElementById("loginUsername")
        .value
        .trim();

    const password =
        document
        .getElementById("loginPassword")
        .value
        .trim();


    if (username === "" || password === "") {

        alert("Please enter username and password");

        return;
    }


    const user =
        users.find(function(user) {

            return (
                user.username === username &&
                user.password === password
            );

        });


    if (!user) {

        alert("Invalid username or password");

        return;
    }


    currentUser = username;


    localStorage.setItem(
        "currentUser",
        currentUser
    );


    alert("Login successful!");


    document
        .getElementById("loginUsername")
        .value = "";

    document
        .getElementById("loginPassword")
        .value = "";


    showApp();
}


/* ================= SHOW APP ================= */

function showApp() {

    loginPage.classList.add("hidden");

    registerPage.classList.add("hidden");

    appPage.classList.remove("hidden");


    document
        .getElementById("welcomeUser")
        .innerText =
        "Hi, " + currentUser;


    showHome();
}


/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("currentUser");

    currentUser = null;

    alert("Logged out successfully!");

    showLogin();
}


/* ================= HOME ================= */

function showHome() {

    profileSection.classList.add("hidden");

    displayPeople();

    displayPosts();
}


/* ================= PROFILE ================= */

function showProfile() {

    profileSection.classList.remove("hidden");


    const user =
        users.find(function(user) {

            return user.username === currentUser;

        });


    if (!user) {
        return;
    }


    document
        .getElementById("profileUsername")
        .innerText = user.username;


    document
        .getElementById("profileCircle")
        .innerText =
        user.username
            .charAt(0)
            .toUpperCase();


    const myPosts =
        posts.filter(function(post) {

            return post.username === currentUser;

        });


    document
        .getElementById("profilePosts")
        .innerText = myPosts.length;


    document
        .getElementById("profileFollowers")
        .innerText =
        user.followers.length;


    document
        .getElementById("profileFollowing")
        .innerText =
        user.following.length;


    displayPosts();
}


/* ================= PEOPLE ================= */

function displayPeople() {

    peopleList.innerHTML = "";


    users.forEach(function(user) {

        if (user.username === currentUser) {

            return;
        }


        const currentUserData =
            users.find(function(item) {

                return item.username === currentUser;

            });


        const isFollowing =
            currentUserData.following.includes(
                user.username
            );


        let personHTML = "";


        personHTML +=
            '<div class="person">';


        personHTML +=
            '<div class="person-left">';


        personHTML +=
            '<div class="small-profile">';


        personHTML +=
            user.username
                .charAt(0)
                .toUpperCase();


        personHTML +=
            '</div>';


        personHTML +=
            '<strong>' +
            escapeHTML(user.username) +
            '</strong>';


        personHTML +=
            '</div>';


        personHTML +=
            '<button ';


        if (isFollowing) {

            personHTML +=
                'class="follow-btn following-btn"';

        } else {

            personHTML +=
                'class="follow-btn"';
        }


        personHTML +=
            ' onclick="followUser(\'' +
            user.username +
            '\')">';


        if (isFollowing) {

            personHTML +=
                "Following";

        } else {

            personHTML +=
                "Follow";
        }


        personHTML +=
            '</button>';


        personHTML +=
            '</div>';


        peopleList.innerHTML += personHTML;

    });
}


/* ================= FOLLOW ================= */

function followUser(username) {

    const currentUserData =
        users.find(function(user) {

            return user.username === currentUser;

        });


    const selectedUser =
        users.find(function(user) {

            return user.username === username;

        });


    if (!selectedUser) {

        alert("User not found");

        return;
    }


    const index =
        currentUserData.following.indexOf(
            username
        );


    if (index === -1) {

        /* FOLLOW */

        currentUserData.following.push(
            username
        );


        selectedUser.followers.push(
            currentUser
        );


        alert(
            "Followed " +
            username +
            " successfully!"
        );


    } else {

        /* UNFOLLOW */

        currentUserData.following.splice(
            index,
            1
        );


        const followerIndex =
            selectedUser.followers.indexOf(
                currentUser
            );


        if (followerIndex !== -1) {

            selectedUser.followers.splice(
                followerIndex,
                1
            );

        }


        alert(
            "Unfollowed " +
            username +
            " successfully!"
        );
    }


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    displayPeople();
}


/* ================= CREATE POST ================= */

function createPost() {

    const imageInput =
        document.getElementById("imageInput");

    const captionInput =
        document.getElementById("captionInput");


    const file =
        imageInput.files[0];

    const caption =
        captionInput.value.trim();


    if (!file) {

        alert("Please select an image");

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const newPost = {

                id: Date.now(),

                username: currentUser,

                image: event.target.result,

                caption: caption,

                likes: [],

                comments: [],

                repostedBy: null

            };


            posts.unshift(newPost);


            localStorage.setItem(
                "posts",
                JSON.stringify(posts)
            );


            imageInput.value = "";

            captionInput.value = "";


            alert("Post uploaded successfully!");


            displayPosts();

        };


    reader.readAsDataURL(file);
}


/* ================= DISPLAY POSTS ================= */

function displayPosts() {

    feed.innerHTML = "";


    if (posts.length === 0) {

        feed.innerHTML =
            '<div class="create-post">' +
            '<p style="text-align:center;">' +
            'No posts yet.' +
            '</p>' +
            '</div>';

        return;
    }


    posts.forEach(function(post) {

        displaySinglePost(post);

    });
}


/* ================= DISPLAY ONE POST ================= */

function displaySinglePost(post) {

    const isLiked =
        post.likes.includes(currentUser);


    let commentsHTML = "";


    post.comments.forEach(function(comment) {

        commentsHTML +=

            '<div class="comment">' +

            '<strong>' +

            escapeHTML(comment.username) +

            '</strong> ' +

            escapeHTML(comment.text) +

            '</div>';

    });


    let postHTML = "";


    postHTML +=
        '<article class="post">';


    /* REPOST MESSAGE */

    if (post.repostedBy) {

        postHTML +=
            '<div class="repost-text">' +

            '🔁 Reposted by ' +

            escapeHTML(post.repostedBy) +

            '</div>';
    }


    /* HEADER */

    postHTML +=
        '<div class="post-header">';


    postHTML +=
        '<div class="profile-circle">';


    postHTML +=
        post.username
            .charAt(0)
            .toUpperCase();


    postHTML +=
        '</div>';


    postHTML +=
        '<div class="username">';


    postHTML +=
        escapeHTML(post.username);


    postHTML +=
        '</div>';


    postHTML +=
        '</div>';


    /* IMAGE */

    postHTML +=
        '<img src="' +
        post.image +
        '" class="post-image" alt="Post Image">';


    /* CAPTION */

    postHTML +=
        '<div class="caption">';


    postHTML +=
        escapeHTML(post.caption);


    postHTML +=
        '</div>';


    /* ACTIONS */

    postHTML +=
        '<div class="actions">';


    /* LIKE */

    postHTML +=
        '<button class="like-button ';


    if (isLiked) {

        postHTML +=
            'liked';
    }


    postHTML +=
        '" onclick="likePost(' +
        post.id +
        ')">';


    if (isLiked) {

        postHTML +=
            "❤️";

    } else {

        postHTML +=
            "🤍";
    }


    postHTML +=
        " " + post.likes.length;


    postHTML +=
        '</button>';


    /* COMMENT COUNT */

    postHTML +=
        '<button>💬 ' +
        post.comments.length +
        '</button>';


    /* REPOST */

    postHTML +=
        '<button onclick="repostPost(' +
        post.id +
        ')">';


    postHTML +=
        '🔁 Repost';


    postHTML +=
        '</button>';


    postHTML +=
        '</div>';


    /* COMMENTS */

    postHTML +=
        '<div class="comments">';


    postHTML +=
        commentsHTML;


    postHTML +=
        '</div>';


    /* COMMENT BOX */

    postHTML +=
        '<div class="comment-box">';


    postHTML +=
        '<input type="text" ';

    postHTML +=
        'id="comment-' +
        post.id +
        '" ';

    postHTML +=
        'placeholder="Write a comment...">';


    postHTML +=
        '<button onclick="addComment(' +
        post.id +
        ')">';


    postHTML +=
        'Send';


    postHTML +=
        '</button>';


    postHTML +=
        '</div>';


    postHTML +=
        '</article>';


    feed.innerHTML += postHTML;
}


/* ================= LIKE ================= */

function likePost(postId) {

    const post =
        posts.find(function(post) {

            return post.id === postId;

        });


    if (!post) {
        return;
    }


    const index =
        post.likes.indexOf(currentUser);


    if (index === -1) {

        post.likes.push(currentUser);

        alert("Post liked!");

    } else {

        post.likes.splice(index, 1);

        alert("Post unliked!");
    }


    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );


    displayPosts();
}


function addComment(postId) {

    const input =
        document.getElementById(
            "comment-" + postId
        );


    const text =
        input.value.trim();


    if (text === "") {

        alert("Please enter a comment");

        return;
    }


    const post =
        posts.find(function(post) {

            return post.id === postId;

        });


    if (!post) {
        return;
    }


    post.comments.push({

        username: currentUser,

        text: text

    });


    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );


    alert("Comment added successfully!");


    displayPosts();
}


function repostPost(postId) {

    const originalPost =
        posts.find(function(post) {

            return post.id === postId;

        });


    if (!originalPost) {
        return;
    }



    const alreadyReposted =
        posts.find(function(post) {

            return (
                post.originalPostId === postId &&
                post.username === currentUser &&
                post.repostedBy === currentUser
            );

        });


    if (alreadyReposted) {

        alert("You already reposted this post");

        return;
    }

    const repost = {

        id: Date.now(),

        username: originalPost.username,

        image: originalPost.image,

        caption: originalPost.caption,

        likes: [],

        comments: [],

        repostedBy: currentUser,

        originalPostId: originalPost.id

    };


    posts.unshift(repost);


    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );


    alert("Post reposted successfully!");


    displayPosts();
}

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

