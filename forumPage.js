// Load existing posts from localStorage
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Display all posts from the beginning
displayPosts();

// Function to create a new post
function createPost() {
  const title = document.getElementById('postTitle').value;
  const content = document.getElementById('postContent').value;

  // Validate inputs
  if (title.trim() === '' || content.trim() === '') {
    alert('Please enter both title and content.');
    return;
  }

  // Create post object
  const post = {
    title: title,
    content: content,
    date: new Date().toLocaleString() // Current date and time
  };

  // Add post to the array
  posts.push(post);

  // Save posts to localStorage
  localStorage.setItem('posts', JSON.stringify(posts));

  // Clear form inputs
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';

  // Call function to display posts
  displayPosts();
}

// Function to display posts
function displayPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = ''; // Clear previous posts

  // Loop through posts array and create HTML elements for each post
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><em>${post.date}</em></p>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Function to search posts by keyword
function searchPosts(keyword) {
  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(keyword.toLowerCase()) || post.content.toLowerCase().includes(keyword.toLowerCase());
  });
  displayFilteredPosts(filteredPosts);
}

// Function to display filtered posts
function displayFilteredPosts(filteredPosts) {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = ''; // Clear previous posts

  filteredPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><em>${post.date}</em></p>
    `;
    postsContainer.appendChild(postElement);
  });
}

// Speech recognition setup
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

// Handle speech recognition results
recognition.onresult = function(event) {
  const result = event.results[0][0].transcript;
  searchPosts(result);
};

// Add event listener to a button to trigger speech recognition
document.getElementById('voiceSearchButton').addEventListener('click', function() {
  recognition.start();
});

// Add event listener to create post button
document.getElementById('createPost').addEventListener('click', createPost);
