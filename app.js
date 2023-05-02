// Menu code (unchanged)
const menuIcon = document.querySelector('.mobile-menu-icon');
const navItems = document.querySelector('.nav-items');
const menuLinks = document.querySelectorAll('.nav-items a');
const body = document.querySelector('body');
const thirdLine = document.querySelector('.mobile-menu-icon span:nth-child(3)');

function toggleMenuIcon() {
  if (navItems.classList.contains('show')) {
    // if menu is open, show close icon
    menuIcon.querySelector('span:first-child').style.transform = 'rotate(45deg)';
    menuIcon.querySelector('span:nth-child(2)').style.transform = 'rotate(-45deg)';
    menuIcon.querySelector('span:nth-child(2)').style.top = '0';
    thirdLine.style.display = 'none'; // hide the third line
  } else {
    // if menu is closed, show menu icon
    menuIcon.querySelector('span:first-child').style.transform = 'rotate(0deg)';
    menuIcon.querySelector('span:nth-child(2)').style.transform = 'rotate(0deg)';
    menuIcon.querySelector('span:nth-child(2)').style.top = '10px';
    thirdLine.style.display = 'block'; // show the third line
  }
}

function toggleMenu() {
  navItems.classList.toggle('show');
  menuIcon.classList.toggle('active');
  body.classList.toggle('no-scroll'); // add class to body to prevent scrolling
  toggleMenuIcon();
}

menuIcon.addEventListener('click', toggleMenu);

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    navItems.classList.remove('show');
    menuIcon.classList.remove('active');
    body.classList.remove('no-scroll'); // remove class to allow scrolling
    toggleMenuIcon();
  });
});


const root = document.getElementById('root');

async function getNewsByCountryAndCategory(countryCode, category) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${category}&apiKey=YOUR_API_KEY`
    );
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve news articles. Please check your internet connection and try again.');
  }
}

function share(url) {
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('Link copied to clipboard!');
    })
    .catch((error) => {
      console.error(`Error copying link: ${error}`);
    });
}

async function renderNews(countryCode, category) {
  root.innerHTML = ''; // clear existing content

  try {
    const news = await getNewsByCountryAndCategory(countryCode, category);

    if (news.length === 0) {
      root.innerHTML = '<div class="error"><p>Sorry, there are no news articles available for the selected category and country.</p><p>Please try selecting a different category or country.</p></div>';
    } else {
      news.forEach((article) => {
        const card = document.createElement('div');
        card.classList.add('news-card');

        // Set a default image URL if the article doesn't have an image
        const defaultImageUrl = 'stock.png';
        const imageUrl = article.urlToImage || defaultImageUrl;

        card.innerHTML = `
          <div class="card-image">
            <img src="${imageUrl}" alt="Article Image">
          </div>
          <h2 class="card-title">${article.title}</h2>
          <p>${article.description}</p>
          <p1>By ${article.author}</p1>
          <p2>${new Date(article.publishedAt).toLocaleDateString()} ${article.source.name}</p2>
          <a href="${article.url}" target="_blank" class="read-more-button">Read More</a>
          <button onclick="share('${article.url}')">Share</button>
        `;
        root.appendChild(card);
      });
    }
  } catch (error) {
    console.error(error);
    root.innerHTML = '<div class="error"><p>Sorry, there was an error retrieving the news articles. Please try again later.</p></div>';
  }
}

// Load initial news articles for the 'general' category
renderNews('us', 'general');

// Add click event listeners to each category link in the header
const categoryLinks = document.querySelectorAll('.nav-items a');
categoryLinks.forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const countryCode = 'us'; // default to US
    await renderNews(countryCode, link.textContent.toLowerCase());
  });
});
