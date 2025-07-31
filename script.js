 class RecommendationSystem {
     constructor() {
         this.currentUser = null;
         this.currentAlgorithm = 'collaborative';
         this.initializeData();
         this.initializeUI();
         this.bindEvents();
     }
     initializeData() {
         // Sample movie database
         this.movies = {
             1: { title: 'The Matrix', genre: 'Sci-Fi', year: 1999, director: 'Wachowski Sisters' },
             2: { title: 'Inception', genre: 'Sci-Fi', year: 2010, director: 'Christopher Nolan' },
             3: { title: 'The Godfather', genre: 'Crime', year: 1972, director: 'Francis Ford Coppola' },
             4: { title: 'Pulp Fiction', genre: 'Crime', year: 1994, director: 'Quentin Tarantino' },
             5: { title: 'Forrest Gump', genre: 'Drama', year: 1994, director: 'Robert Zemeckis' },
             6: { title: 'The Dark Knight', genre: 'Action', year: 2008, director: 'Christopher Nolan' },
             7: { title: 'Fight Club', genre: 'Drama', year: 1999, director: 'David Fincher' },
             8: { title: 'Goodfellas', genre: 'Crime', year: 1990, director: 'Martin Scorsese' },
             9: { title: 'The Lord of the Rings', genre: 'Fantasy', year: 2001, director: 'Peter Jackson' },
             10: { title: 'Star Wars', genre: 'Sci-Fi', year: 1977, director: 'George Lucas' },
             11: { title: 'Titanic', genre: 'Romance', year: 1997, director: 'James Cameron' },
             12: { title: 'Avatar', genre: 'Sci-Fi', year: 2009, director: 'James Cameron' },
             13: { title: 'Casablanca', genre: 'Romance', year: 1942, director: 'Michael Curtiz' },
             14: { title: 'The Shawshank Redemption', genre: 'Drama', year: 1994, director: 'Frank Darabont' },
             15: { title: 'Interstellar', genre: 'Sci-Fi', year: 2014, director: 'Christopher Nolan' }
         };
         // Sample user ratings (userId: {movieId: rating})
         this.userRatings = {
             'alice': { 1: 5, 2: 4, 3: 3, 6: 5, 7: 4, 10: 5, 15: 4 },
             'bob': { 1: 3, 2: 5, 4: 4, 6: 4, 8: 5, 9: 3, 14: 5 },
             'charlie': { 3: 5, 4: 5, 5: 4, 8: 5, 11: 3, 13: 4, 14: 5 },
             'diana': { 1: 4, 2: 5, 6: 5, 7: 3, 9: 4, 10: 4, 12: 5 },
             'eve': { 3: 4, 4: 3, 5: 5, 11: 5, 13: 5, 14: 4 }
         };
         this.users = {
             'alice': { name: 'Alice', avatar: '👩‍💻', preferences: ['Sci-Fi', 'Action'] },
             'bob': { name: 'Bob', avatar: '👨‍🎨', preferences: ['Action', 'Crime'] },
             'charlie': { name: 'Charlie', avatar: '👨‍💼', preferences: ['Crime', 'Drama'] },
             'diana': { name: 'Diana', avatar: '👩‍🔬', preferences: ['Sci-Fi', 'Fantasy'] },
             'eve': { name: 'Eve', avatar: '👩‍🎭', preferences: ['Romance', 'Drama'] }
         };
     }
     initializeUI() {
         this.populateUserSelector();
         this.populateRatingsGrid();
         this.updateAlgorithmInfo();
     }
     populateUserSelector() {
         const userSelector = document.getElementById('userSelector');
         userSelector.innerHTML = '';
         
         Object.keys(this.users).forEach(userId => {
             const user = this.users[userId];
             const button = document.createElement('button');
             button.className = 'user-btn';
             button.textContent = `${user.avatar} ${user.name}`;
             button.addEventListener('click', () => this.selectUser(userId));
             userSelector.appendChild(button);
         });
     }
     populateRatingsGrid() {
         const ratingsGrid = document.getElementById('ratingsGrid');
         ratingsGrid.innerHTML = '';
         
         // Show a selection of movies for rating
         const moviesToRate = Object.keys(this.movies).slice(0, 6);
         
         moviesToRate.forEach(movieId => {
             const movie = this.movies[movieId];
             const card = document.createElement('div');
             card.className = 'movie-card';
             
             const currentRating = this.currentUser ? 
                 (this.userRatings[this.currentUser] && this.userRatings[this.currentUser][movieId]) || 0 : 0;
             
             card.innerHTML = `
                 <div class="movie-info">
                     <div class="movie-poster">🎬</div>
                     <div class="movie-details">
                         <h4>${movie.title}</h4>
                         <p>Genre: ${movie.genre}</p>
                         <p>Year: ${movie.year}</p>
                         <p>Director: ${movie.director}</p>
                     </div>
                 </div>
                 <div class="rating-section">
                     <div class="stars" data-movie-id="${movieId}">
                         ${[1, 2, 3, 4, 5].map(star => 
                             `<span class="star ${star <= currentRating ? 'active' : ''}" data-rating="${star}">★</span>`
                         ).join('')}
                     </div>
                     <span>Rating: ${currentRating}/5</span>
                 </div>
             `;
             
             ratingsGrid.appendChild(card);
         });
         
         // Add star rating functionality
         document.querySelectorAll('.stars').forEach(starsContainer => {
             const movieId = starsContainer.dataset.movieId;
             const stars = starsContainer.querySelectorAll('.star');
             
             stars.forEach(star => {
                 star.addEventListener('click', () => {
                     if (!this.currentUser) {
                         alert('Please select a user first!');
                         return;
                     }
                     
                     const rating = parseInt(star.dataset.rating);
                     this.rateMovie(movieId, rating);
                     this.updateStarDisplay(starsContainer, rating);
                     this.generateRecommendations();
                 });
             });
         });
     }
     updateStarDisplay(container, rating) {
         const stars = container.querySelectorAll('.star');
         stars.forEach((star, index) => {
             star.classList.toggle('active', index < rating);
         });
         
         const ratingText = container.parentElement.querySelector('span');
         ratingText.textContent = `Rating: ${rating}/5`;
     }
     selectUser(userId) {
         this.currentUser = userId;
         const user = this.users[userId];
         
         // Update profile display
         document.getElementById('profileAvatar').textContent = user.avatar;
         document.getElementById('profileName').textContent = user.name;
         document.getElementById('profileStats').textContent = 
             `Preferences: ${user.preferences.join(', ')} | Ratings: ${Object.keys(this.userRatings[userId] || {}).length}`;
         
         // Update user selector buttons
         document.querySelectorAll('.user-btn').forEach(btn => {
             btn.classList.remove('active');
         });
         event.target.classList.add('active');
         
         // Update ratings display
         this.populateRatingsGrid();
         this.generateRecommendations();
     }
     rateMovie(movieId, rating) {
         if (!this.userRatings[this.currentUser]) {
             this.userRatings[this.currentUser] = {};
         }
         this.userRatings[this.currentUser][movieId] = rating;
     }
     bindEvents() {
         document.querySelectorAll('.algorithm-btn').forEach(btn => {
             btn.addEventListener('click', () => {
                 document.querySelectorAll('.algorithm-btn').forEach(b => b.classList.remove('active'));
                 btn.classList.add('active');
                 this.currentAlgorithm = btn.dataset.algorithm;
                 this.updateAlgorithmInfo();
                 this.generateRecommendations();
             });
         });
     }
     updateAlgorithmInfo() {
         const info = document.getElementById('algorithmInfo');
         const algorithmData = {
             collaborative: {
                 title: '🤝 Collaborative Filtering',
                 description: 'Finds users with similar preferences and recommends items they liked',
                 technique: 'User-User similarity using cosine similarity and Pearson correlation',
                 bestFor: 'Popular items with many ratings, discovering new genres'
             },
             content: {
                 title: '📊 Content-Based Filtering',
                 description: 'Recommends items similar to those the user has liked before',
                 technique: 'Feature matching based on genre, director, and year',
                 bestFor: 'Users with clear preferences, niche interests'
             },
             hybrid: {
                 title: '🔄 Hybrid Approach',
                 description: 'Combines collaborative and content-based filtering for better results',
                 technique: 'Weighted combination of both algorithms',
                 bestFor: 'Balanced recommendations, handling cold start problems'
             }
         };
         
         const data = algorithmData[this.currentAlgorithm];
         info.innerHTML = `
             <h4>${data.title}</h4>
             <p><strong>How it works:</strong> ${data.description}</p>
             <p><strong>Technique:</strong> ${data.technique}</p>
             <p><strong>Best for:</strong> ${data.bestFor}</p>
         `;
     }
     generateRecommendations() {
         if (!this.currentUser) return;
         
         let recommendations = [];
         
         switch (this.currentAlgorithm) {
             case 'collaborative':
                 recommendations = this.collaborativeFiltering();
                 break;
             case 'content':
                 recommendations = this.contentBasedFiltering();
                 break;
             case 'hybrid':
                 recommendations = this.hybridFiltering();
                 break;
         }
         
         this.displayRecommendations(recommendations);
         
         if (this.currentAlgorithm === 'collaborative') {
             this.displaySimilarityMatrix();
         } else {
             document.getElementById('similarityMatrix').style.display = 'none';
         }
     }
     collaborativeFiltering() {
         const currentUserRatings = this.userRatings[this.currentUser] || {};
         const similarities = {};
         
         // Calculate user similarities
         Object.keys(this.userRatings).forEach(otherUser => {
             if (otherUser !== this.currentUser) {
                 similarities[otherUser] = this.calculateUserSimilarity(
                     currentUserRatings, 
                     this.userRatings[otherUser]
                 );
             }
         });
         
         // Get recommendations based on similar users
         const recommendations = [];
         const userMovies = Object.keys(currentUserRatings);
         
         Object.keys(similarities)
             .sort((a, b) => similarities[b] - similarities[a])
             .slice(0, 3) // Top 3 similar users
             .forEach(similarUser => {
                 const similarUserRatings = this.userRatings[similarUser];
                 
                 Object.keys(similarUserRatings).forEach(movieId => {
                     if (!userMovies.includes(movieId)) {
                         const score = similarities[similarUser] * similarUserRatings[movieId];
                         const existingRec = recommendations.find(r => r.movieId === movieId);
                         
                         if (existingRec) {
                             existingRec.score += score;
                             existingRec.count += 1;
                         } else {
                             recommendations.push({
                                 movieId,
                                 score,
                                 count: 1,
                                 reason: `Users similar to you rated this ${similarUserRatings[movieId]}/5`
                             });
                         }
                     }
                 });
             });
         
         return recommendations
             .map(rec => ({
                 ...rec,
                 score: rec.score / rec.count,
                 confidence: Math.min(rec.count * 30, 95)
             }))
             .sort((a, b) => b.score - a.score)
             .slice(0, 6);
     }
     contentBasedFiltering() {
         const currentUserRatings = this.userRatings[this.currentUser] || {};
         const likedMovies = Object.keys(currentUserRatings)
             .filter(movieId => currentUserRatings[movieId] >= 4);
         
         if (likedMovies.length === 0) return [];
         
         // Calculate user preferences
         const genrePreferences = {};
         const directorPreferences = {};
         
         likedMovies.forEach(movieId => {
             const movie = this.movies[movieId];
             const rating = currentUserRatings[movieId];
             
             genrePreferences[movie.genre] = (genrePreferences[movie.genre] || 0) + rating;
             directorPreferences[movie.director] = (directorPreferences[movie.director] || 0) + rating;
         });
         
         // Score all unrated movies
         const recommendations = [];
         
         Object.keys(this.movies).forEach(movieId => {
             if (!currentUserRatings[movieId]) {
                 const movie = this.movies[movieId];
                 let score = 0;
                 let reasons = [];
                 
                 // Genre similarity
                 if (genrePreferences[movie.genre]) {
                     score += genrePreferences[movie.genre] * 0.6;
                     reasons.push(`You like ${movie.genre} movies`);
                 }
                 
                 // Director similarity
                 if (directorPreferences[movie.director]) {
                     score += directorPreferences[movie.director] * 0.4;
                     reasons.push(`You like ${movie.director}'s work`);
                 }
                 
                 if (score > 0) {
                     recommendations.push({
                         movieId,
                         score,
                         confidence: Math.min(score * 15, 90),
                         reason: reasons.join(', ')
                     });
                 }
             }
         });
         
         return recommendations
             .sort((a, b) => b.score - a.score)
             .slice(0, 6);
     }
     hybridFiltering() {
         const collaborative = this.collaborativeFiltering();
         const contentBased = this.contentBasedFiltering();
         
         // Combine recommendations
         const combined = {};
         
         collaborative.forEach(rec => {
             combined[rec.movieId] = {
                 movieId: rec.movieId,
                 score: rec.score * 0.6,
                 confidence: rec.confidence * 0.6,
                 reason: `Collaborative: ${rec.reason}`
             };
         });
         
         contentBased.forEach(rec => {
             if (combined[rec.movieId]) {
                 combined[rec.movieId].score += rec.score * 0.4;
                 combined[rec.movieId].confidence += rec.confidence * 0.4;
                 combined[rec.movieId].reason += ` & Content: ${rec.reason}`;
             } else {
                 combined[rec.movieId] = {
                     movieId: rec.movieId,
                     score: rec.score * 0.4,
                     confidence: rec.confidence * 0.4,
                     reason: `Content: ${rec.reason}`
                 };
             }
         });
         
         return Object.values(combined)
             .sort((a, b) => b.score - a.score)
             .slice(0, 6);
     }
     calculateUserSimilarity(user1Ratings, user2Ratings) {
         const commonMovies = Object.keys(user1Ratings)
             .filter(movieId => user2Ratings[movieId]);
         
         if (commonMovies.length === 0) return 0;
         
         // Calculate cosine similarity
         let dotProduct = 0;
         let magnitude1 = 0;
         let magnitude2 = 0;
         
         commonMovies.forEach(movieId => {
             const rating1 = user1Ratings[movieId];
             const rating2 = user2Ratings[movieId];
             
             dotProduct += rating1 * rating2;
             magnitude1 += rating1 * rating1;
             magnitude2 += rating2 * rating2;
         });
         
         magnitude1 = Math.sqrt(magnitude1);
         magnitude2 = Math.sqrt(magnitude2);
         
         if (magnitude1 === 0 || magnitude2 === 0) return 0;
         
         return dotProduct / (magnitude1 * magnitude2);
     }
     displayRecommendations(recommendations) {
         const recommendationsGrid = document.getElementById('recommendationsGrid');
         
         if (recommendations.length === 0) {
             recommendationsGrid.innerHTML = `
                 <div class="no-recommendations">
                     No recommendations found. Try rating more movies or selecting a different algorithm.
                 </div>
             `;
             return;
         }
         
         recommendationsGrid.innerHTML = '';
         
         recommendations.forEach(rec => {
             const movie = this.movies[rec.movieId];
             const confidencePercent = Math.round(rec.confidence);
             const confidenceColor = this.getConfidenceColor(confidencePercent);
             
             const card = document.createElement('div');
             card.className = 'recommendation-card';
             
             card.innerHTML = `
                 <div class="recommendation-info">
                     <div class="recommendation-poster">🎬</div>
                     <div class="recommendation-details">
                         <h4>${movie.title}</h4>
                         <p>Genre: ${movie.genre}</p>
                         <p>Year: ${movie.year}</p>
                         <p>Director: ${movie.director}</p>
                         <p class="recommendation-reason">${rec.reason}</p>
                     </div>
                 </div>
                 <div class="confidence-bar">
                     <div class="confidence-fill" style="width: ${confidencePercent}%; background: ${confidenceColor};"></div>
                 </div>
                 <div class="confidence-text">Confidence: ${confidencePercent}%</div>
             `;
             
             recommendationsGrid.appendChild(card);
         });
     }
     getConfidenceColor(percent) {
         if (percent > 75) return '#28a745'; // Green
         if (percent > 50) return '#ffc107'; // Yellow
         if (percent > 25) return '#fd7e14'; // Orange
         return '#dc3545'; // Red
     }
     displaySimilarityMatrix() {
         const matrixContainer = document.getElementById('similarityMatrix');
         const matrixGrid = document.getElementById('matrixGrid');
         
         matrixContainer.style.display = 'block';
         matrixGrid.innerHTML = '';
         
         // Add header row
         const headerCell = document.createElement('div');
         headerCell.className = 'matrix-cell';
         headerCell.style.background = 'transparent';
         headerCell.style.color = '#333';
         headerCell.textContent = '';
         matrixGrid.appendChild(headerCell);
         
         // Add column headers
         Object.keys(this.users).forEach(userId => {
             const user = this.users[userId];
             const headerCell = document.createElement('div');
             headerCell.className = 'matrix-cell';
             headerCell.style.background = 'transparent';
             headerCell.style.color = '#333';
             headerCell.textContent = user.avatar;
             matrixGrid.appendChild(headerCell);
         });
         
         // Add similarity values
         Object.keys(this.users).forEach(user1 => {
             // Row header
             const user = this.users[user1];
             const headerCell = document.createElement('div');
             headerCell.className = 'matrix-cell';
             headerCell.style.background = 'transparent';
             headerCell.style.color = '#333';
             headerCell.textContent = user.avatar;
             matrixGrid.appendChild(headerCell);
             
             // Similarity values
             Object.keys(this.users).forEach(user2 => {
                 const similarity = user1 === user2 ? 1 : 
                     this.calculateUserSimilarity(
                         this.userRatings[user1] || {}, 
                         this.userRatings[user2] || {}
                     );
                 
                 const cell = document.createElement('div');
                 cell.className = 'matrix-cell';
                 
                 // Highlight current user
                 if (user1 === this.currentUser || user2 === this.currentUser) {
                     cell.style.border = '2px solid #4facfe';
                 }
                 
                 // Set color based on similarity
                 const similarityPercent = Math.round(similarity * 100);
                 cell.style.background = `hsl(210, 100%, ${100 - similarityPercent * 0.7}%)`;
                 cell.textContent = similarityPercent;
                 
                 matrixGrid.appendChild(cell);
             });
         });
     }
 }
 // Initialize the recommendation system when the page loads
 document.addEventListener('DOMContentLoaded', () => {
     new RecommendationSystem();
 });