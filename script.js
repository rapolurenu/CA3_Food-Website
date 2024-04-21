document.addEventListener('DOMContentLoaded', function () {
  const randomMealContainer = document.getElementById('randomMealContainer');
  const mealImage = document.getElementById('mealImage');
  const mealName = document.getElementById('mealName');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementsByClassName('close')[0];

  // Fetch random meal
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => {
          const randomMeal = data.meals[0];
          mealImage.src = randomMeal.strMealThumb;
          mealName.textContent = randomMeal.strMeal;

          // Display ingredients in modal
          randomMealContainer.addEventListener('click', () => {
              const ingredients = getIngredients(randomMeal);
              populateModal(ingredients);
              modal.style.display = 'block';
          });
      });

  // Search for meal category
  searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
          const category = searchInput.value;
          fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
              .then(response => response.json())
              .then(data => {
                  if (data.meals) {
                      displaySearchResults(data.meals);
                  } else {
                      searchResultsContainer.innerHTML = '<p>No meals found.</p>';
                  }
              });

          searchResults.style.display = 'block';
      }
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });

  function getIngredients(meal) {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
              ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
          } else {
              break;
          }
      }
      return ingredients;
  }

  function populateModal(ingredients) {
      const ingredientList = document.getElementById('ingredientList');
      ingredientList.innerHTML = '';
      ingredients.forEach(ingredient => {
          const li = document.createElement('li');
          li.textContent = ingredient;
          ingredientList.appendChild(li);
      });
  }

  function displaySearchResults(meals) {
      searchResultsContainer.innerHTML = '';
      meals.forEach(meal => {
          const mealDiv = document.createElement('div');
          mealDiv.classList.add('meal');
          const mealImg = document.createElement('img');
          mealImg.src = meal.strMealThumb;
          mealImg.alt = meal.strMeal;
          const mealTitle = document.createElement('p');
          mealTitle.textContent = meal.strMeal;
          mealDiv.appendChild(mealImg);
          mealDiv.appendChild(mealTitle);
          mealDiv.addEventListener('click', () => {
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                  .then(response => response.json())
                  .then(data => {
                      const ingredients = getIngredients(data.meals[0]);
                      populateModal(ingredients);
                      modal.style.display = 'block';
                  });
          });
          searchResultsContainer.appendChild(mealDiv);
      });
  }
});
