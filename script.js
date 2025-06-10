document.addEventListener('DOMContentLoaded', () => {
    const clubNameInput = document.getElementById('clubNameInput');
    const clubLogoInput = document.getElementById('clubLogoInput');
    const addClubBtn = document.getElementById('addClubBtn');
    const clubsContainer = document.getElementById('clubsContainer');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startTimerBtn = document.getElementById('startTimerBtn');
    const stopTimerBtn = document.getElementById('stopTimerBtn');
    const alarmSound = document.getElementById('alarmSound');

    let clubs = [];
    let timerInterval;
    let totalTime = 10 * 60; // 10 دقائق بالثواني
    let timeLeft = totalTime;

    // دالة لتحديث عرض المؤقت
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    // دالة لبدء المؤقت
    startTimerBtn.addEventListener('click', () => {
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    alarmSound.play(); // تشغيل الصوت بصوت عالي جداً
                    alert('انتهى وقت المباراة!'); // يمكن استبدالها بشيء آخر
                    timeLeft = totalTime; // إعادة تعيين المؤقت
                    updateTimerDisplay();
                }
            }, 1000);
        }
    });

    // دالة لإيقاف المؤقت مؤقتاً
    stopTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    // دالة لرسم نادي في الواجهة
    function renderClub(club) {
        const clubCard = document.createElement('div');
        clubCard.classList.add('club-card');
        clubCard.dataset.id = club.id;

        const clubLogoImg = document.createElement('img');
        clubLogoImg.classList.add('club-logo');
        clubLogoImg.src = club.logo || 'https://via.placeholder.com/60?text=شعار'; // شعار افتراضي
        clubLogoImg.alt = club.name + ' Logo';

        const clubInfo = document.createElement('div');
        clubInfo.classList.add('club-info');

        const clubName = document.createElement('div');
        clubName.classList.add('club-name');
        clubName.textContent = club.name;

        const clubPoints = document.createElement('div');
        clubPoints.classList.add('club-points');
        clubPoints.textContent = `النقاط: ${club.points}`;

        const pointsControls = document.createElement('div');
        pointsControls.classList.add('points-controls');

        const winBtn = document.createElement('button');
        winBtn.classList.add('win-btn');
        winBtn.textContent = 'فوز';
        winBtn.addEventListener('click', () => updateClubPoints(club.id, 3));

        const drawBtn = document.createElement('button');
        drawBtn.classList.add('draw-btn');
        drawBtn.textContent = 'تعادل';
        drawBtn.addEventListener('click', () => updateClubPoints(club.id, 1));

        const loseBtn = document.createElement('button');
        loseBtn.classList.add('lose-btn');
        loseBtn.textContent = 'خسارة';
        loseBtn.addEventListener('click', () => updateClubPoints(club.id, 0)); // لا تزيد النقاط عند الخسارة

        pointsControls.appendChild(winBtn);
        pointsControls.appendChild(drawBtn);
        pointsControls.appendChild(loseBtn);

        const pointsModifier = document.createElement('div');
        pointsModifier.classList.add('points-modifier');

        const pointsModifierInput = document.createElement('input');
        pointsModifierInput.type = 'number';
        pointsModifierInput.value = 0;
        pointsModifierInput.min = 0; // لضمان عدم وجود نقاط سالبة
        pointsModifierInput.style.width = '50px';

        const applyPointsBtn = document.createElement('button');
        applyPointsBtn.textContent = 'تغيير النقاط';
        applyPointsBtn.addEventListener('click', () => {
            const newPoints = parseInt(pointsModifierInput.value);
            if (!isNaN(newPoints)) {
                updateClubPoints(club.id, newPoints, true); // true للإشارة إلى تغيير مباشر
            }
        });

        pointsModifier.appendChild(pointsModifierInput);
        pointsModifier.appendChild(applyPointsBtn);


        clubInfo.appendChild(clubName);
        clubInfo.appendChild(clubPoints);
        clubInfo.appendChild(pointsControls);
        clubInfo.appendChild(pointsModifier);

        clubCard.appendChild(clubLogoImg);
        clubCard.appendChild(clubInfo);

        clubsContainer.appendChild(clubCard);
    }

    // دالة لتحديث نقاط النادي
    function updateClubPoints(id, pointsToAdd, isDirectChange = false) {
        const clubIndex = clubs.findIndex(c => c.id === id);
        if (clubIndex !== -1) {
            if (isDirectChange) {
                clubs[clubIndex].points = pointsToAdd;
            } else {
                clubs[clubIndex].points += pointsToAdd;
            }

            const clubCard = document.querySelector(`.club-card[data-id="${id}"]`);
            if (clubCard) {
                const clubPointsElement = clubCard.querySelector('.club-points');
                if (clubPointsElement) {
                    clubPointsElement.textContent = `النقاط: ${clubs[clubIndex].points}`;
                }
            }
        }
    }

    // إضافة نادي جديد
    addClubBtn.addEventListener('click', () => {
        const name = clubNameInput.value.trim();
        if (name) {
            let logoUrl = '';
            if (clubLogoInput.files.length > 0) {
                logoUrl = URL.createObjectURL(clubLogoInput.files[0]);
            }

            const newClub = {
                id: Date.now(), // معرف فريد
                name: name,
                points: 0,
                logo: logoUrl
            };
            clubs.push(newClub);
            renderClub(newClub);

            clubNameInput.value = '';
            clubLogoInput.value = ''; // مسح اختيار الملف
        } else {
            alert('الرجاء إدخال اسم النادي.');
        }
    });

    // تحديث عرض المؤقت عند التحميل الأولي
    updateTimerDisplay();
});
