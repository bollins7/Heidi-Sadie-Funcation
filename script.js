const surveyForm = document.querySelector('#surveyForm');
const formStatus = document.querySelector('#formStatus');
const ratingInput = document.querySelector('#rating');
const ratingValue = document.querySelector('#ratingValue');
const heidiSound = document.querySelector('#heidiSound');
const sadieSound = document.querySelector('#sadieSound');
const polaroids = document.querySelectorAll('.polaroid');

ratingInput.addEventListener('input', () => {
    ratingValue.textContent = ratingInput.value;
});

polaroids[0]?.addEventListener('mouseenter', () => {
    heidiSound?.play().catch(() => {});
});

polaroids[1]?.addEventListener('mouseenter', () => {
    sadieSound?.play().catch(() => {});
});

surveyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formStatus.textContent = 'Saving your response...';

    const formData = new FormData(surveyForm);
    const surveyResponse = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveyResponse)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Something went wrong.');
        }

        surveyForm.reset();
        ratingInput.value = 5;
        ratingValue.textContent = '5';
        formStatus.textContent = 'Thanks! Your survey response was saved.';
    } catch (error) {
        formStatus.textContent = error.message;
    }
});
