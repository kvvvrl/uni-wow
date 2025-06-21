function setStarRating(score, stars) {
	if (!Array.isArray(stars)) stars = Array.from(stars);
	if (!stars || stars.length === 0 || isNaN(score)) return;

	stars.forEach((star, index) => {
		const pos = index + 1;
		star.classList.remove('fa-star', 'fa-star-half-o', 'fa-star-o');

		if (score >= pos) {
			star.classList.add('fa-star');
		} else if (score >= pos - 0.5) {
			star.classList.add('fa-star-half-o');
		} else {
			star.classList.add('fa-star-o');
		}
	});
}
