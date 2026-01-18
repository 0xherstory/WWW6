document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮和内容元素
    const creationsBtn = document.getElementById('creationsBtn');
    const earningsBtn = document.getElementById('earningsBtn');
    const creationsContent = document.getElementById('creationsContent');
    const earningsContent = document.getElementById('earningsContent');

    // 切换到"我创作的"标签
    function showCreations() {
        // 更新按钮状态
        creationsBtn.classList.add('active');
        earningsBtn.classList.remove('active');
        
        // 更新内容显示
        creationsContent.classList.add('active');
        earningsContent.classList.remove('active');
    }

    // 切换到"我的收益"标签
    function showEarnings() {
        // 更新按钮状态
        earningsBtn.classList.add('active');
        creationsBtn.classList.remove('active');
        
        // 更新内容显示
        earningsContent.classList.add('active');
        creationsContent.classList.remove('active');
    }

    // 绑定点击事件
    creationsBtn.addEventListener('click', showCreations);
    earningsBtn.addEventListener('click', showEarnings);

    // 为故事项目添加点击效果
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach(item => {
        item.addEventListener('click', function() {
            const storyId = this.getAttribute('data-story-id');
            const storyTitle = this.querySelector('.story-title').textContent;
            console.log('跳转到故事:', storyTitle, 'ID:', storyId);

            // 跳转到故事树页面
            if (storyId) {
                window.location.href = `../story-tree.html?id=${storyId}`;
            }
        });

        // 添加鼠标悬停效果
        item.style.cursor = 'pointer';
    });

    // 为收益卡片添加点击效果
    const earningsCards = document.querySelectorAll('.earnings-card');
    earningsCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            console.log('点击了收益卡片:', cardTitle);
            // 这里可以添加查看详细收益信息的逻辑
        });
    });

    // 添加一些动画效果
    function addScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        // 观察故事项目和收益卡片
        document.querySelectorAll('.story-item, .earnings-card').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    // 初始化动画
    addScrollAnimation();
});