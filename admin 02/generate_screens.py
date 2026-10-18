import os

def gen_screen(content, show_bottom_nav=True, nav_active="home", header=None):
    nav_html = f"""
        <nav class="bottom-nav">
            <a href="#" class="nav-item {'active' if nav_active == 'home' else ''}">
                <i class="fa-solid fa-house nav-icon"></i>
                <span>Home</span>
            </a>
            <a href="#" class="nav-item {'active' if nav_active == 'flashcard' else ''}">
                <i class="fa-solid fa-clone nav-icon"></i>
                <span>FlashCard</span>
            </a>
            <a href="#" class="nav-item {'active' if nav_active == 'game' else ''}">
                <i class="fa-solid fa-gamepad nav-icon"></i>
                <span>Game</span>
            </a>
            <a href="#" class="nav-item {'active' if nav_active == 'pronunciation' else ''}">
                <i class="fa-solid fa-microphone nav-icon"></i>
                <span>Pronunciation</span>
            </a>
            <a href="#" class="nav-item {'active' if nav_active == 'listening' else ''}">
                <i class="fa-solid fa-headphones nav-icon"></i>
                <span>Listening</span>
            </a>
        </nav>
    """ if show_bottom_nav else ""

    status_bar = """
        <div class="status-bar">
            <span>09:52</span>
            <div class="status-icons">
                <i class="fa-solid fa-signal"></i>
                <i class="fa-solid fa-wifi"></i>
                <i class="fa-solid fa-battery-full"></i>
            </div>
        </div>
    """

    header_html = f"""
        <div class="top-bar">
            <i class="fa-solid fa-chevron-left back-btn"></i>
            <div class="title">{header}</div>
            <i class="fa-solid fa-ellipsis"></i>
        </div>
    """ if header else ""

    return f"""
        <div class="mobile-container">
            {status_bar}
            {header_html}
            <div class="mobile-content">
                {content}
            </div>
            {nav_html}
        </div>
    """

screens = []

# Screen 1: Home
s1 = """
<header class="home-header">
    <div class="user-info">
        <div class="avatar"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar"></div>
        <div class="greeting">
            <div class="greeting-sub">Chào buổi sáng,</div>
            <div class="greeting-name">Nguyễn Văn A!</div>
        </div>
    </div>
    <div class="header-actions">
        <div class="action-btn"><i class="fa-solid fa-fire" style="color: #f97316;"></i> <span style="font-size:14px; font-weight:700;">12</span></div>
        <div class="action-btn"><i class="fa-solid fa-bell"></i></div>
    </div>
</header>
<div class="section">
    <div class="section-title">
        NHIỆM VỤ HỌC TẬP HÔM NAY
    </div>
    <div class="tasks-card glass-card">
        <div class="progress-container">
            <div class="progress-info">
                <span class="progress-text">Tiến độ</span>
                <span class="progress-percent">50%</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: 50%;"></div>
            </div>
        </div>
        <label class="task-item">
            <div class="checkbox checked"><i class="fa-solid fa-check"></i></div>
            <span>Hoàn thành 10 Flashcard chủ đề Travel</span>
        </label>
        <label class="task-item">
            <div class="checkbox"></div>
            <span>Đạt 80 điểm Luyện phát âm (0/1)</span>
        </label>
    </div>
</div>
<div class="ai-banner">
    <div class="ai-banner-content">
        <div class="ai-banner-title">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Truyện tạo bằng AI: A Day at the Airport
        </div>
        <div class="ai-banner-desc">Ôn tập 5 từ vựng bạn hay quên nhất qua ngữ cảnh!</div>
        <button class="ai-banner-btn">Đọc và Nghe ngay</button>
    </div>
    <img src="https://cdn3d.iconscout.com/3d/premium/thumb/robot-4996924-4159599.png" class="ai-robot" alt="AI">
</div>
<div class="section">
    <div class="section-title">TRUNG TÂM LUYỆN TẬP</div>
    <div class="games-grid">
        <div class="game-card">
            <div class="game-icon bg-orange"><i class="fa-solid fa-puzzle-piece"></i></div>
            <div class="game-title">Game Ghép Từ</div>
        </div>
        <div class="game-card">
            <div class="game-icon bg-green"><i class="fa-solid fa-microphone"></i></div>
            <div class="game-title">Luyện Phát Âm</div>
        </div>
        <div class="game-card">
            <div class="game-icon bg-blue"><i class="fa-solid fa-headphones"></i></div>
            <div class="game-title">Nghe Chép Chính Tả</div>
        </div>
        <div class="game-card">
            <div class="game-icon bg-red"><i class="fa-solid fa-arrow-down-a-z"></i></div>
            <div class="game-title">Sắp Xếp Câu</div>
        </div>
    </div>
</div>
"""
screens.append(gen_screen(s1, nav_active="home"))

# Screen 2: Flashcard Topics
s2 = """
<div class="p-20">
    <div class="search-bar">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Tìm kiếm chủ đề...">
    </div>
    <div class="topic-list mt-20">
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-pink"><i class="fa-solid fa-paw"></i></div>
            <div class="topic-info">
                <div class="topic-name">Animals</div>
                <div class="topic-stats">learned: 45/50</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 90%; background: var(--pink)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-purple"><i class="fa-solid fa-graduation-cap"></i></div>
            <div class="topic-info">
                <div class="topic-name">Education</div>
                <div class="topic-stats">learned: 12/25</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 48%; background: var(--purple)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-blue"><i class="fa-solid fa-briefcase"></i></div>
            <div class="topic-info">
                <div class="topic-name">Business</div>
                <div class="topic-stats">learned: 47/50</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 94%; background: var(--blue)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-orange"><i class="fa-solid fa-plane"></i></div>
            <div class="topic-info">
                <div class="topic-name">Travel</div>
                <div class="topic-stats">learned: 8/20</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 40%; background: var(--orange)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
    </div>
</div>
"""
screens.append(gen_screen(s2, nav_active="flashcard", header="Flashcard"))

# Screen 3: Flashcard Detail - Front
s3 = """
<div class="p-20 flashcard-container">
    <div class="flashcard-header">
        <div class="fc-subtitle">BUSINESS</div>
        <div class="fc-counter">5 / 20</div>
    </div>
    <div class="flashcard card-front">
        <div class="fc-top-actions">
            <div class="fc-badge">Từ vựng mới</div>
            <i class="fa-regular fa-heart fc-like"></i>
        </div>
        <div class="fc-word-container">
            <div class="fc-word">Revenue <i class="fa-solid fa-volume-high text-blue" style="font-size: 24px; cursor: pointer;"></i></div>
            <div class="fc-ipa">/ˈrev.ə.nuː/</div>
        </div>
        <div class="fc-bottom-hint">Chạm để lật thẻ</div>
    </div>
    <div class="fc-actions mt-20" style="opacity: 0.5; pointer-events: none;">
        <button class="btn-outline">Trung bình</button>
        <button class="btn-outline">Khó</button>
    </div>
</div>
"""
screens.append(gen_screen(s3, show_bottom_nav=False, header="Flashcard"))


# Screen 4: Flashcard Detail - Back English
s4 = """
<div class="p-20 flashcard-container">
    <div class="flashcard-header">
        <div class="fc-subtitle">BUSINESS</div>
        <div class="fc-counter">5 / 20</div>
    </div>
    <div class="flashcard card-back">
        <div class="fc-top-actions">
            <div class="fc-badge">Từ vựng mới</div>
            <i class="fa-solid fa-heart fc-like" style="color: #ef4444;"></i>
        </div>
        <div class="fc-word-container">
            <div class="fc-word">Revenue <i class="fa-solid fa-volume-high text-blue" style="font-size: 24px; cursor: pointer;"></i></div>
            <div class="fc-ipa">/ˈrev.ə.nuː/</div>
            <div class="fc-divider"></div>
            <div class="fc-meaning">money that a business receives from selling goods or services</div>
        </div>
    </div>
    <div class="fc-actions mt-20">
        <button class="btn-outline">Trung bình</button>
        <button class="btn-outline">Khó</button>
    </div>
    <div class="fc-extra-actions">
        <button class="btn-text"><i class="fa-solid fa-pen"></i> Viết ví dụ của bạn</button>
    </div>
</div>
"""
screens.append(gen_screen(s4, show_bottom_nav=False, header="Flashcard"))

# Screen 5: Flashcard Detail - Back Vietnamese (doanh thu)
s5 = """
<div class="p-20 flashcard-container">
    <div class="flashcard-header">
        <div class="fc-subtitle">BUSINESS</div>
        <div class="fc-counter">5 / 20</div>
    </div>
    <div class="flashcard card-back">
        <div class="fc-top-actions">
            <div class="fc-badge">Từ vựng mới</div>
            <i class="fa-solid fa-heart fc-like" style="color: #ef4444;"></i>
        </div>
        <div class="fc-word-container">
            <div class="fc-word text-gradient">doanh thu <i class="fa-solid fa-volume-high text-blue" style="font-size: 24px; cursor: pointer;"></i></div>
            <div class="fc-divider"></div>
            <div class="fc-meaning">money that a business receives from selling goods or services</div>
        </div>
    </div>
    <div class="fc-actions mt-20">
        <button class="btn-outline">Trung bình</button>
        <button class="btn-outline">Khó</button>
    </div>
    <div class="fc-extra-actions">
        <button class="btn-text"><i class="fa-solid fa-pen"></i> Viết ví dụ của bạn</button>
    </div>
</div>
"""
screens.append(gen_screen(s5, show_bottom_nav=False, header="Flashcard"))


# Screen 6: Flashcard Detail - Check with AI
s6 = """
<div class="p-20 flashcard-container">
    <div class="flashcard-header">
        <div class="fc-subtitle">BUSINESS</div>
        <div class="fc-counter">5 / 20</div>
    </div>
    <div class="flashcard card-back">
        <div class="fc-top-actions">
            <div class="fc-badge">Từ vựng mới</div>
            <i class="fa-solid fa-heart fc-like" style="color: #ef4444;"></i>
        </div>
        <div class="fc-word-container">
            <div class="fc-word">Revenue <i class="fa-solid fa-volume-high text-blue" style="font-size: 24px; cursor: pointer;"></i></div>
            <div class="fc-ipa">/ˈrev.ə.nuː/</div>
            <div class="fc-divider"></div>
            <div class="fc-meaning">money that a business receives from selling goods or services</div>
        </div>
    </div>
    <div class="fc-actions mt-20">
        <button class="btn-outline">Trung bình</button>
        <button class="btn-outline">Khó</button>
    </div>
    <div class="ai-input-area mt-20">
        <div class="ai-input-wrapper">
            <input type="text" value="Company's revenue rise last year." class="ai-input">
            <button class="btn-primary btn-sm"><i class="fa-solid fa-wand-magic-sparkles"></i> Check with AI</button>
        </div>
    </div>
</div>
"""
screens.append(gen_screen(s6, show_bottom_nav=False, header="Flashcard"))

# Screen 7: Flashcard AI Error Check
s7 = """
<div class="p-20 flashcard-container">
    <div class="flashcard-header">
        <div class="fc-subtitle">BUSINESS</div>
        <div class="fc-counter">5 / 20</div>
    </div>
    <div class="flashcard">
        <div class="fc-word" style="font-size: 24px; margin-bottom: 16px;">Revenue</div>
        <div class="user-sentence mb-10">
            <div class="sentence-label">Câu của bạn:</div>
            <div class="sentence-text text-error">Company's revenue rise last year.</div>
        </div>
        <div class="ai-feedback error-box">
            <div class="feedback-status text-error"><i class="fa-solid fa-circle-xmark"></i> INCORRECT</div>
            
            <div class="feedback-item mt-10">
                <div class="fb-label">Suggested Correction:</div>
                <div class="fb-value text-success font-bold">Company's revenue rose last year.</div>
            </div>
            
            <div class="feedback-item mt-10">
                <div class="fb-label">Explanation:</div>
                <div class="fb-value">"yesterday" mô tả sự việc quá khứ, vì vậy động từ "rise" cần được đổi thành dạng quá khứ đơn "rose".</div>
            </div>

            <div class="feedback-item mt-10">
                <div class="fb-label">Error Type:</div>
                <div class="fb-badge">Grammar</div>
            </div>
        </div>
    </div>
    <div class="bottom-action-fixed">
        <button class="btn-primary w-full">Try Again</button>
    </div>
</div>
"""
screens.append(gen_screen(s7, show_bottom_nav=False, header="Flashcard"))

# Row 2

# Screen 8: AI Learning Story Form
s8 = """
<div class="p-20">
    <div class="story-form glass-card p-20">
        <div class="form-title mb-20 text-center text-primary"><i class="fa-solid fa-wand-magic-sparkles"></i> Create a Learning Story</div>
        
        <div class="form-group">
            <label>Chủ đề</label>
            <select class="form-control"><option>Animals</option></select>
        </div>
        
        <div class="form-group">
            <label>Level</label>
            <div class="level-selector">
                <div class="level-btn">A1</div>
                <div class="level-btn active">A2</div>
                <div class="level-btn">B1</div>
                <div class="level-btn">B2</div>
            </div>
        </div>

        <div class="form-group">
            <label>Story Style</label>
            <select class="form-control"><option>Hài hước</option></select>
        </div>
        
        <div class="form-group">
            <label>Độ dài câu truyện</label>
            <select class="form-control"><option>Ngắn (100 từ)</option></select>
        </div>

        <button class="btn-primary w-full mt-20 ai-glow-btn"><i class="fa-solid fa-pen-nib"></i> Tạo Câu Chuyện</button>
    </div>
</div>
"""
screens.append(gen_screen(s8, nav_active="listening", header="AI Learning Story"))

# Screen 9: AI Learning Story Loading
s9 = """
<div class="p-20 loading-container">
    <div class="ai-loader-wrapper">
        <div class="ai-spinner"></div>
        <i class="fa-solid fa-wand-magic-sparkles ai-icon-center text-primary"></i>
    </div>
    <div class="loading-title mt-20">Create your Story...</div>
    <div class="loading-subtitle">AI is preparing a funny Animals story for you.</div>
    <div class="loading-dots mt-10">
        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>
</div>
"""
screens.append(gen_screen(s9, show_bottom_nav=False, header="AI Learning Story"))

# Screen 10: AI Learning Story Result
s10 = """
<div class="p-20">
    <div class="story-result-card">
        <div class="story-meta mb-15">
            <div class="meta-tag"><i class="fa-solid fa-paw"></i> Animals</div>
            <div class="meta-tag"><i class="fa-solid fa-layer-group"></i> A2</div>
            <div class="meta-tag"><i class="fa-solid fa-face-laugh-squint"></i> Hài hước</div>
        </div>
        
        <h2 class="story-title text-center text-gradient mb-20">The Funny Parrot</h2>
        
        <div class="story-content">
            Tom has a funny <b>PARROT</b> named Max. Max likes to imitate people. Every morning, he says, "Good morning!" to Tom's dog. One day, Max flew into the kitchen. He saw a <b>BANANA</b> and tried to eat it. But the banana was too big! Tom laughed and said, "You are a very funny parrot!"
        </div>
        <div class="story-audio-player mt-20">
             <button class="btn-circle-play"><i class="fa-solid fa-play"></i></button>
             <div class="audio-wave">
                <div class="bar h-10"></div><div class="bar h-20"></div><div class="bar h-15"></div><div class="bar h-30"></div><div class="bar h-10"></div>
                <div class="bar h-25"></div><div class="bar h-15"></div><div class="bar h-10"></div><div class="bar h-20"></div><div class="bar h-10"></div>
             </div>
             <div class="audio-time">0:00 / 0:45</div>
        </div>
    </div>
    
    <div class="bottom-action-row mt-20">
        <button class="btn-outline flex-1">Regenerate</button>
        <button class="btn-primary flex-1">Finish</button>
    </div>
</div>
"""
screens.append(gen_screen(s10, show_bottom_nav=False, header="AI Learning Story"))


# Row 3: Dictation

# Screen 11: Dictation Topics
s11 = """
<div class="p-20">
    <div class="section-title mb-20">Choose a topic to practice</div>
    <div class="search-bar">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Tìm kiếm chủ đề...">
    </div>
    <div class="topic-list mt-20">
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-pink"><i class="fa-solid fa-paw"></i></div>
            <div class="topic-info">
                <div class="topic-name">Animals</div>
                <div class="topic-stats">10 words remaining</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 20%; background: var(--pink)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-purple"><i class="fa-solid fa-graduation-cap"></i></div>
            <div class="topic-info">
                <div class="topic-name">Education</div>
                <div class="topic-stats">13 words remaining</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 32%; background: var(--purple)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-blue"><i class="fa-solid fa-briefcase"></i></div>
            <div class="topic-info">
                <div class="topic-name">Business</div>
                <div class="topic-stats">2 words need review</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 95%; background: var(--blue)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
        <div class="topic-list-item">
            <div class="topic-icon-lg bg-orange"><i class="fa-solid fa-plane"></i></div>
            <div class="topic-info">
                <div class="topic-name">Travel</div>
                <div class="topic-stats">12 words remaining</div>
                <div class="progress-bar-bg mt-5"><div class="progress-bar-fill" style="width: 22%; background: var(--orange)"></div></div>
            </div>
            <i class="fa-solid fa-chevron-right text-muted"></i>
        </div>
    </div>
</div>
"""
screens.append(gen_screen(s11, nav_active="listening", header="Dictation"))

# Screen 12: Dictation Playing (Empty)
s12 = """
<div class="p-20 flex-col h-full">
    <div class="flex-between mb-20 text-muted font-bold text-sm">
        <span>ANIMAL</span>
        <span>5 / 20</span>
    </div>
    
    <div class="audio-player-lg mb-40">
        <button class="btn-play-lg"><i class="fa-solid fa-play"></i></button>
        <div class="audio-timer">0:05</div>
        <div class="audio-repeat"><i class="fa-solid fa-rotate-right"></i></div>
    </div>
    
    <div class="instruction text-center mb-20 font-medium">Listen and type the word you hear.</div>
    
    <input type="text" class="dictation-input" placeholder="Type the word...">
    <div class="dictation-hint mt-10 text-muted text-sm text-center">Hint: 2 âm tiết (nghĩa: con voi)</div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-row">
        <button class="btn-text text-muted flex-1 text-left">Bỏ qua (Skip)</button>
        <button class="btn-primary flex-1 opacity-50" disabled>Check Answer</button>
    </div>
</div>
"""
screens.append(gen_screen(s12, show_bottom_nav=False, header="Dictation"))


# Screen 13: Dictation Typing
s13 = s12.replace('placeholder="Type the word..."', 'value="e---ha--"').replace('opacity-50" disabled', '"')
screens.append(gen_screen(s13, show_bottom_nav=False, header="Dictation"))

# Screen 14: Dictation Correct
s14 = """
<div class="p-20 flex-col h-full">
    <div class="flex-between mb-20 text-muted font-bold text-sm">
        <span>ANIMAL</span>
        <span>5 / 20</span>
    </div>
    
    <div class="audio-player-lg mb-40">
        <button class="btn-play-lg"><i class="fa-solid fa-play"></i></button>
        <div class="audio-timer">0:05</div>
        <div class="audio-repeat"><i class="fa-solid fa-rotate-right"></i></div>
    </div>
    
    <div class="instruction text-center mb-20 font-medium">Listen and type the word you hear.</div>
    
    <input type="text" class="dictation-input input-success" value="elephant" readonly>
    
    <div class="feedback-card success-card mt-20">
        <div class="fc-title"><i class="fa-solid fa-circle-check"></i> CORRECT</div>
        <div class="fc-desc mt-10">
            <strong>Elephant</strong> /ˈel.ɪ.fənt/ <br>
            Nghĩa: Con voi <br>
            Ví dụ: The elephant is eating leaves.
        </div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-fixed">
        <button class="btn-primary w-full">Continue</button>
    </div>
</div>
"""
screens.append(gen_screen(s14, show_bottom_nav=False, header="Dictation"))

# Screen 15: Dictation Incorrect
s15 = """
<div class="p-20 flex-col h-full">
    <div class="flex-between mb-20 text-muted font-bold text-sm">
        <span>ANIMAL</span>
        <span>5 / 20</span>
    </div>
    
    <div class="audio-player-lg mb-40">
        <button class="btn-play-lg"><i class="fa-solid fa-play"></i></button>
        <div class="audio-timer">0:05</div>
        <div class="audio-repeat"><i class="fa-solid fa-rotate-right"></i></div>
    </div>
    
    <div class="instruction text-center mb-20 font-medium">Listen and type the word you hear.</div>
    
    <input type="text" class="dictation-input input-error" value="elefant">
    
    <div class="feedback-card error-card mt-20">
        <div class="fc-title"><i class="fa-solid fa-circle-xmark"></i> INCORRECT</div>
        <div class="fc-desc mt-10">
            Đáp án của bạn sai! (Sai chính tả)<br>
            Đáp án đúng: <strong>Elephant</strong> /ˈel.ɪ.fənt/
        </div>
        <div class="fc-tip mt-10">
            <i class="fa-solid fa-lightbulb text-orange"></i> Từ này đã được thêm vào danh sách cần ôn tập.
        </div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-row">
        <button class="btn-outline flex-1">Try again</button>
        <button class="btn-primary flex-1">Continue</button>
    </div>
</div>
"""
screens.append(gen_screen(s15, show_bottom_nav=False, header="Dictation"))


# Row 4: Sentence Ordering

# Screen 16: Practice
s16 = """
<div class="p-20 flex-col h-full">
    <div class="progress-bar-bg mb-20"><div class="progress-bar-fill" style="width: 30%;"></div></div>
    
    <div class="question-header mb-20">
        <div class="q-label">Question 3/10</div>
        <div class="q-instruction">Tap the words in the correct order to form a meaningful sentence.</div>
    </div>
    
    <div class="sentence-builder mb-40">
        <div class="word-slot filled">The</div>
        <div class="word-slot filled">elephant</div>
        <div class="word-slot filled">is</div>
        <div class="word-slot active"></div>
    </div>
    
    <div class="word-bank-container">
        <div class="word-bank-label">Word Bank</div>
        <div class="word-bank">
            <div class="word-btn">leaves</div>
            <div class="word-btn">eating</div>
            <div class="word-btn empty">The</div>
            <div class="word-btn empty">is</div>
            <div class="word-btn empty">elephant</div>
        </div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-row">
        <button class="btn-text text-muted flex-1 text-left"><i class="fa-solid fa-rotate-left"></i> Reset</button>
        <button class="btn-primary flex-1">Check Answer</button>
    </div>
</div>
"""
screens.append(gen_screen(s16, show_bottom_nav=False, header="Sentence Ordering"))

# Screen 17: Correct
s17 = """
<div class="p-20 flex-col h-full">
    <div class="progress-bar-bg mb-20"><div class="progress-bar-fill" style="width: 30%;"></div></div>
    
    <div class="question-header mb-20">
        <div class="q-label">Question 3/10</div>
        <div class="q-instruction">Tap the words in the correct order to form a meaningful sentence.</div>
    </div>
    
    <div class="sentence-builder mb-40">
        <div class="word-slot filled success">The</div>
        <div class="word-slot filled success">elephant</div>
        <div class="word-slot filled success">is</div>
        <div class="word-slot filled success">eating</div>
        <div class="word-slot filled success">leaves</div>
    </div>
    
    <div class="feedback-banner banner-success">
        <div class="banner-title"><i class="fa-solid fa-circle-check"></i> CORRECT</div>
        <div class="banner-desc">The elephant is eating leaves.</div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-fixed">
        <button class="btn-primary w-full">Next Question <i class="fa-solid fa-arrow-right ml-5"></i></button>
    </div>
</div>
"""
screens.append(gen_screen(s17, show_bottom_nav=False, header="Sentence Ordering"))

# Screen 18: Incorrect
s18 = """
<div class="p-20 flex-col h-full">
    <div class="progress-bar-bg mb-20"><div class="progress-bar-fill" style="width: 30%;"></div></div>
    
    <div class="question-header mb-20">
        <div class="q-label">Question 3/10</div>
        <div class="q-instruction">Tap the words in the correct order to form a meaningful sentence.</div>
    </div>
    
    <div class="sentence-builder mb-40">
        <div class="word-slot filled error">The</div>
        <div class="word-slot filled error">elephant</div>
        <div class="word-slot filled error">eating</div>
        <div class="word-slot filled error">is</div>
        <div class="word-slot filled error">leaves</div>
    </div>
    
    <div class="feedback-banner banner-error">
        <div class="banner-title"><i class="fa-solid fa-circle-xmark"></i> INCORRECT</div>
        <div class="banner-desc">Hãy kiểm tra lại trật tự động từ to be và động từ chính.</div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-row">
        <button class="btn-outline flex-1">Try Again</button>
        <button class="btn-primary flex-1">Next Question <i class="fa-solid fa-arrow-right ml-5"></i></button>
    </div>
</div>
"""
screens.append(gen_screen(s18, show_bottom_nav=False, header="Sentence Ordering"))


# Row 5: Matching Game

# Screen 19: Start
s19 = """
<div class="p-20 flex-col h-full bg-game">
    <div class="timer-banner mb-20">
        <i class="fa-regular fa-clock"></i> 00:00
    </div>
    
    <div class="match-grid">
        <div class="match-card">pollution</div>
        <div class="match-card">ô nhiễm</div>
        <div class="match-card">nâu</div>
        
        <div class="match-card">brown</div>
        <div class="match-card">hồng</div>
        <div class="match-card">pink</div>
        
        <div class="match-card">black</div>
        <div class="match-card">đen</div>
        <div class="match-card">tím</div>
        
        <div class="match-card">purple</div>
        <div class="match-card">color</div>
        <div class="match-card">màu sắc</div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <button class="btn-primary w-full opacity-50" disabled>Hoàn thành</button>
</div>
"""
screens.append(gen_screen(s19, show_bottom_nav=False, header="Ghép thẻ vui"))

# Screen 20: Selecting brown, hồng
s20 = s19.replace('<div class="match-card">brown</div>', '<div class="match-card selected">brown</div>').replace('<div class="match-card">hồng</div>', '<div class="match-card selected">hồng</div>')
screens.append(gen_screen(s20, show_bottom_nav=False, header="Ghép thẻ vui"))

# Screen 21: Matched some, selecting black, đen
s21 = s20.replace('<div class="match-card selected">brown</div>', '<div class="match-card matched">brown</div>').replace('<div class="match-card selected">hồng</div>', '<div class="match-card matched">hồng</div>').replace('<div class="match-card">black</div>', '<div class="match-card selected">black</div>').replace('<div class="match-card">đen</div>', '<div class="match-card selected">đen</div>')
screens.append(gen_screen(s21, show_bottom_nav=False, header="Ghép thẻ vui"))

# Screen 22: Almost done
s22 = s21.replace('<div class="match-card selected">black</div>', '<div class="match-card matched">black</div>').replace('<div class="match-card selected">đen</div>', '<div class="match-card matched">đen</div>').replace('<div class="match-card">purple</div>', '<div class="match-card selected">purple</div>').replace('<div class="match-card">tím</div>', '<div class="match-card selected">tím</div>')
screens.append(gen_screen(s22, show_bottom_nav=False, header="Ghép thẻ vui"))

# Screen 23: All done - Button active
s23 = s22.replace('<div class="match-card selected">purple</div>', '<div class="match-card matched">purple</div>').replace('<div class="match-card selected">tím</div>', '<div class="match-card matched">tím</div>').replace('opacity-50" disabled', '"').replace('00:00', '00:45')
screens.append(gen_screen(s23, show_bottom_nav=False, header="Ghép thẻ vui"))

# Screen 24: Game Over
s24 = """
<div class="flex-col h-full result-screen">
    <div class="result-content text-center">
        <div class="stars-container mb-20">
            <i class="fa-solid fa-star text-yellow animate-pop" style="font-size:40px"></i>
            <i class="fa-solid fa-star text-yellow animate-pop" style="font-size:55px; margin-top:-20px"></i>
            <i class="fa-solid fa-star text-yellow animate-pop" style="font-size:40px"></i>
        </div>
        <h1 class="result-title text-gradient mb-10">XUẤT SẮC!</h1>
        <p class="result-subtitle text-muted mb-30">Bạn đã hoàn thành bài ghép thẻ!</p>
        
        <div class="stats-box text-left">
            <div class="stat-item"><i class="fa-regular fa-clock text-blue"></i> Thời gian: 0:45</div>
            <div class="stat-item"><i class="fa-solid fa-bullseye text-green"></i> Độ chính xác: 4/4 cặp (100%)</div>
            <div class="stat-item"><i class="fa-solid fa-bolt text-orange"></i> Điểm thưởng: +40 XP</div>
        </div>
    </div>
    
    <div class="bottom-action-fixed mt-auto p-20">
        <button class="btn-primary w-full shadow-glow">Tiếp tục <i class="fa-solid fa-arrow-right ml-5"></i></button>
        <button class="btn-text w-full mt-10">Thử lại <i class="fa-solid fa-rotate-right ml-5"></i></button>
    </div>
</div>
"""
screens.append(gen_screen(s24, show_bottom_nav=True, nav_active="game"))

# Row 6: Pronunciation

# Screen 25: Start
s25 = """
<div class="p-20 flex-col h-full text-center">
    <div class="word-display mt-40">
        <h1 class="pronounce-word">Environment</h1>
        <div class="pronounce-ipa">/in'vairomənt/</div>
        <div class="pronounce-meaning text-muted">môi trường</div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="mic-container mb-40">
        <div class="mic-btn-outer">
            <button class="mic-btn"><i class="fa-solid fa-microphone"></i></button>
        </div>
        <div class="mic-hint mt-20 text-muted">Hãy ấn & nói để luyện phát âm</div>
    </div>
</div>
"""
screens.append(gen_screen(s25, show_bottom_nav=False, header="Luyện phát âm"))


# Screen 26: Recording
s26 = """
<div class="p-20 flex-col h-full text-center">
    <div class="word-display mt-40">
        <h1 class="pronounce-word">Environment</h1>
        <div class="pronounce-ipa">/in'vairomənt/</div>
        <div class="pronounce-meaning text-muted">môi trường</div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="recording-waves mb-40">
        <div class="wave"></div><div class="wave"></div><div class="wave"></div><div class="wave"></div><div class="wave"></div>
    </div>
    
    <div class="mic-container mb-40">
        <div class="mic-btn-outer recording">
            <button class="mic-btn mic-recording"><i class="fa-solid fa-stop"></i></button>
        </div>
        <div class="mic-hint mt-20 text-primary font-bold animate-pulse">Đang lắng nghe bạn nói...</div>
    </div>
</div>
"""
screens.append(gen_screen(s26, show_bottom_nav=False, header="Luyện phát âm"))


# Screen 27: Result
s27 = """
<div class="p-20 flex-col h-full text-center">
    <div class="word-display mt-20">
        <h1 class="pronounce-word">En<span class="text-error">vi</span>ron<span class="text-success">ment</span></h1>
        <div class="pronounce-ipa">/in'vairomənt/</div>
        <div class="pronounce-meaning text-muted">môi trường</div>
    </div>
    
    <div class="score-card mt-30">
        <div class="score-title">ĐIỂM SỐ: <span class="text-success text-2xl font-bold">85%</span></div>
        <div class="score-breakdown mt-15">
            <div class="sb-item text-success">Good</div>
            <div class="sb-item text-error">Bad</div>
            <div class="sb-item text-success">Good</div>
        </div>
        <div class="score-tip text-left mt-20 bg-orange-light p-15 rounded-xl text-sm">
            <i class="fa-solid fa-lightbulb text-orange"></i> <strong>Gợi ý sửa lỗi:</strong><br>Âm "vi" cần phát âm rõ hơn. Hãy kết hợp môi và răng khi phát âm chuẩn âm /v/.
        </div>
    </div>
    
    <div class="spacer" style="flex:1"></div>
    
    <div class="bottom-action-row mb-20">
        <button class="btn-outline flex-1 text-primary border-primary">Thử lại <i class="fa-solid fa-rotate-right"></i></button>
        <button class="btn-primary flex-1">Tiếp tục <i class="fa-solid fa-arrow-right"></i></button>
    </div>
</div>
"""
screens.append(gen_screen(s27, show_bottom_nav=True, nav_active="pronunciation", header="Luyện phát âm"))


html_template = f'''<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Mobile Screens</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {{
            --bg-color: #f8fafc;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --primary: #6366f1; /* Indigo 500 */
            --primary-light: #e0e7ff;
            --secondary: #ec4899; /* Pink 500 */
            --card-bg: #ffffff;
            --blue: #3b82f6;
            --green: #10b981;
            --red: #ef4444;
            --orange: #f97316;
            --yellow: #eab308;
            --pink: #ec4899;
            --purple: #a855f7;
            --glass-bg: rgba(255, 255, 255, 0.7);
            --glass-border: rgba(255, 255, 255, 0.4);
        }}

        * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }}
        body {{ background-color: #cbd5e1; padding: 40px; }}
        .gallery-title {{ text-align: center; font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 2px; }}
        .gallery {{ display: flex; flex-wrap: wrap; gap: 40px; justify-content: center; }}
        
        .mobile-container {{
            width: 375px; height: 812px;
            background-color: var(--bg-color);
            border-radius: 40px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            position: relative;
            border: 12px solid #1e293b;
            display: flex;
            flex-direction: column;
        }}
        
        .mobile-content {{
            flex: 1;
            overflow-y: auto;
            position: relative;
        }}
        
        .mobile-content::-webkit-scrollbar {{ display: none; }}
        
        /* Utils */
        .p-20 {{ padding: 20px; }}
        .pt-20 {{ padding-top: 20px; }}
        .pb-20 {{ padding-bottom: 20px; }}
        .mt-5 {{ margin-top: 5px; }}
        .mt-10 {{ margin-top: 10px; }}
        .mt-15 {{ margin-top: 15px; }}
        .mt-20 {{ margin-top: 20px; }}
        .mt-30 {{ margin-top: 30px; }}
        .mt-40 {{ margin-top: 40px; }}
        .mb-10 {{ margin-bottom: 10px; }}
        .mb-15 {{ margin-bottom: 15px; }}
        .mb-20 {{ margin-bottom: 20px; }}
        .mb-30 {{ margin-bottom: 30px; }}
        .mb-40 {{ margin-bottom: 40px; }}
        .ml-5 {{ margin-left: 5px; }}
        .flex-col {{ display: flex; flex-direction: column; }}
        .h-full {{ height: 100%; }}
        .flex-between {{ display: flex; justify-content: space-between; align-items: center; }}
        .text-center {{ text-align: center; }}
        .text-left {{ text-align: left; }}
        .text-primary {{ color: var(--primary); }}
        .text-error {{ color: var(--red); }}
        .text-success {{ color: var(--green); }}
        .text-muted {{ color: var(--text-muted); }}
        .text-blue {{ color: var(--blue); }}
        .text-yellow {{ color: var(--yellow); }}
        .text-orange {{ color: var(--orange); }}
        .font-bold {{ font-weight: 700; }}
        .font-medium {{ font-weight: 500; }}
        .text-sm {{ font-size: 13px; }}
        .text-2xl {{ font-size: 24px; }}
        .w-full {{ width: 100%; }}
        .flex-1 {{ flex: 1; }}
        .opacity-50 {{ opacity: 0.5; }}
        
        .bg-pink {{ background-color: var(--pink); color: white; }}
        .bg-purple {{ background-color: var(--purple); color: white; }}
        .bg-blue {{ background-color: var(--blue); color: white; }}
        .bg-orange {{ background-color: var(--orange); color: white; }}
        .bg-green {{ background-color: var(--green); color: white; }}
        .bg-red {{ background-color: var(--red); color: white; }}
        .bg-orange-light {{ background-color: #ffedd5; }}

        .glass-card {{
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }}
        
        .text-gradient {{
            background: linear-gradient(to right, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}

        /* Buttons */
        .btn-primary {{ background: var(--primary); color: white; border: none; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.2s; }}
        .btn-primary:active {{ transform: scale(0.98); }}
        .btn-outline {{ background: transparent; color: var(--text-main); border: 2px solid #e2e8f0; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; }}
        .btn-text {{ background: transparent; color: var(--primary); border: none; font-weight: 600; font-size: 15px; cursor: pointer; }}
        .btn-sm {{ padding: 8px 16px; font-size: 13px; border-radius: 8px; }}
        .shadow-glow {{ box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4); }}
        .ai-glow-btn {{ background: linear-gradient(135deg, #a855f7, #ec4899); box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.4); }}

        /* Status & Top bar */
        .status-bar {{ display: flex; justify-content: space-between; padding: 12px 20px 8px; font-size: 13px; font-weight: 600; color: #000; z-index: 10; }}
        .status-icons {{ display: flex; gap: 6px; }}
        .top-bar {{ display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: var(--bg-color); z-index: 9; }}
        .top-bar .title {{ font-weight: 700; font-size: 17px; }}
        .back-btn {{ font-size: 18px; cursor: pointer; color: var(--text-main); }}

        /* Bottom Nav */
        .bottom-nav {{ background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); display: flex; justify-content: space-around; padding: 16px 0; border-top: 1px solid #e2e8f0; z-index: 10; position: absolute; bottom: 0; width: 100%; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; }}
        .nav-item {{ display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--text-muted); text-decoration: none; font-size: 11px; font-weight: 600; transition: 0.2s; }}
        .nav-item.active {{ color: var(--primary); }}
        .nav-icon {{ font-size: 22px; margin-bottom: 2px; }}
        .nav-item.active .nav-icon {{ transform: translateY(-2px); }}

        /* Layout components */
        .bottom-action-row {{ display: flex; gap: 12px; width: 100%; }}
        .bottom-action-fixed {{ width: 100%; }}
        
        /* Home Screen Specifics */
        .home-header {{ display: flex; justify-content: space-between; align-items: center; padding: 24px 20px; background: white; border-bottom-left-radius: 30px; border-bottom-right-radius: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .user-info {{ display: flex; align-items: center; gap: 12px; }}
        .avatar {{ width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: #e2e8f0; border: 2px solid var(--primary); }}
        .avatar img {{ width: 100%; height: 100%; object-fit: cover; }}
        .greeting-sub {{ font-size: 12px; color: var(--text-muted); font-weight: 500; }}
        .greeting-name {{ font-size: 18px; font-weight: 700; color: var(--text-main); }}
        .header-actions {{ display: flex; gap: 12px; }}
        .action-btn {{ width: 36px; height: 36px; border-radius: 50%; background: var(--bg-color); display: flex; justify-content: center; align-items: center; font-size: 16px; color: var(--text-main); gap: 4px; }}
        .section {{ padding: 20px; }}
        .section-title {{ font-size: 13px; font-weight: 800; color: var(--text-muted); margin-bottom: 16px; letter-spacing: 0.5px; }}
        
        .progress-container {{ margin-bottom: 20px; }}
        .progress-info {{ display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 8px; }}
        .progress-bar-bg {{ height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; width: 100%; }}
        .progress-bar-fill {{ height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.5s; }}
        
        .task-item {{ display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 14px; font-weight: 600; color: var(--text-main); cursor: pointer; }}
        .task-item:last-child {{ margin-bottom: 0; }}
        .checkbox {{ width: 22px; height: 22px; border: 2px solid #cbd5e1; border-radius: 6px; display: flex; justify-content: center; align-items: center; color: transparent; transition: 0.2s; }}
        .checkbox.checked {{ background: var(--primary); border-color: var(--primary); color: white; }}
        
        .ai-banner {{ background: linear-gradient(135deg, #a855f7, #6366f1); border-radius: 20px; padding: 24px 20px; color: white; margin: 0 20px; display: flex; position: relative; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }}
        .ai-banner-content {{ position: relative; z-index: 2; width: 70%; }}
        .ai-banner-title {{ font-size: 16px; font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; line-height: 1.3; }}
        .ai-banner-desc {{ font-size: 13px; opacity: 0.9; margin-bottom: 16px; line-height: 1.4; }}
        .ai-banner-btn {{ background: white; color: #6366f1; border: none; padding: 10px 16px; border-radius: 20px; font-weight: 700; font-size: 12px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .ai-robot {{ position: absolute; right: -10px; bottom: -10px; width: 120px; z-index: 1; opacity: 0.9; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); }}
        
        .games-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }}
        .game-card {{ background: white; border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .game-icon {{ width: 50px; height: 50px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 24px; margin: 0 auto 12px; }}
        .game-title {{ font-size: 14px; font-weight: 700; color: var(--text-main); }}
        
        /* Search Bar */
        .search-bar {{ background: white; padding: 12px 16px; border-radius: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; }}
        .search-bar i {{ color: var(--text-muted); }}
        .search-bar input {{ border: none; outline: none; background: transparent; width: 100%; font-size: 15px; color: var(--text-main); }}
        
        /* Topic List */
        .topic-list-item {{ background: white; border-radius: 20px; padding: 16px; display: flex; align-items: center; gap: 16px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }}
        .topic-icon-lg {{ width: 48px; height: 48px; border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 20px; flex-shrink: 0; }}
        .topic-info {{ flex: 1; }}
        .topic-name {{ font-size: 16px; font-weight: 700; margin-bottom: 4px; color: var(--text-main); }}
        .topic-stats {{ font-size: 12px; color: var(--text-muted); font-weight: 500; }}
        
        /* Flashcards */
        .flashcard-container {{ display: flex; flex-direction: column; height: 100%; padding-bottom: 100px; }}
        .flashcard-header {{ display: flex; justify-content: space-between; font-weight: 700; color: var(--text-muted); font-size: 14px; margin-bottom: 20px; }}
        .flashcard {{ background: white; border-radius: 24px; flex: 1; padding: 24px; display: flex; flex-direction: column; position: relative; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; min-height: 400px; }}
        .fc-top-actions {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }}
        .fc-badge {{ background: var(--primary-light); color: var(--primary); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }}
        .fc-like {{ font-size: 24px; color: #cbd5e1; cursor: pointer; }}
        .fc-word-container {{ text-align: center; margin: auto 0; }}
        .fc-word {{ font-size: 32px; font-weight: 800; color: var(--text-main); display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 12px; }}
        .fc-ipa {{ font-size: 18px; color: var(--text-muted); }}
        .fc-bottom-hint {{ text-align: center; color: var(--text-muted); font-size: 14px; font-weight: 500; margin-top: auto; padding-top: 20px; }}
        .fc-actions {{ display: flex; gap: 12px; }}
        .fc-actions button {{ flex: 1; }}
        .fc-extra-actions {{ margin-top: 20px; text-align: center; }}
        
        .fc-divider {{ height: 1px; background: #e2e8f0; margin: 24px 0; width: 50px; margin-left: auto; margin-right: auto; }}
        .fc-meaning {{ font-size: 18px; line-height: 1.5; color: var(--text-main); font-weight: 500; }}
        
        .ai-input-wrapper {{ display: flex; gap: 8px; }}
        .ai-input {{ flex: 1; border: 2px solid var(--primary-light); border-radius: 12px; padding: 12px 16px; font-size: 14px; outline: none; }}
        .ai-input:focus {{ border-color: var(--primary); }}
        
        .user-sentence {{ background: #f8fafc; padding: 16px; border-radius: 16px; border: 1px solid #e2e8f0; }}
        .sentence-label {{ font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }}
        .sentence-text {{ font-size: 16px; font-weight: 500; text-decoration: line-through; }}
        .error-box {{ background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 16px; margin-top: 16px; }}
        .feedback-status {{ font-weight: 800; font-size: 16px; display: flex; align-items: center; gap: 8px; }}
        .fb-label {{ font-size: 12px; color: var(--text-muted); font-weight: 600; }}
        .fb-value {{ font-size: 15px; margin-top: 4px; line-height: 1.4; color: var(--text-main); }}
        .fb-badge {{ display: inline-block; background: #fee2e2; color: #ef4444; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-top: 4px; }}
        
        /* Forms & AI Story */
        .form-group {{ margin-bottom: 20px; }}
        .form-group label {{ display: block; font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; }}
        .form-control {{ width: 100%; padding: 14px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 15px; color: var(--text-main); font-weight: 500; outline: none; appearance: none; }}
        .level-selector {{ display: flex; gap: 10px; }}
        .level-btn {{ flex: 1; text-align: center; padding: 12px 0; background: white; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }}
        .level-btn.active {{ background: var(--primary); color: white; border-color: var(--primary); }}
        
        .ai-loader-wrapper {{ width: 120px; height: 120px; margin: 60px auto 0; position: relative; display: flex; justify-content: center; align-items: center; }}
        .ai-spinner {{ position: absolute; width: 100%; height: 100%; border: 4px solid var(--primary-light); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }}
        .ai-icon-center {{ font-size: 40px; }}
        @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
        .loading-title {{ text-align: center; font-size: 24px; font-weight: 800; color: var(--text-main); }}
        .loading-subtitle {{ text-align: center; font-size: 15px; color: var(--text-muted); margin-top: 8px; line-height: 1.4; }}
        .loading-dots {{ display: flex; justify-content: center; gap: 6px; }}
        .dot {{ width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }}
        .dot:nth-child(1) {{ animation-delay: -0.32s; }}
        .dot:nth-child(2) {{ animation-delay: -0.16s; }}
        @keyframes bounce {{ 0%, 80%, 100% {{ transform: scale(0); }} 40% {{ transform: scale(1); }} }}
        
        .story-result-card {{ background: white; border-radius: 24px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }}
        .story-meta {{ display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }}
        .meta-tag {{ background: #f1f5f9; color: var(--text-muted); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; }}
        .story-title {{ font-size: 24px; font-weight: 800; }}
        .story-content {{ font-size: 16px; line-height: 1.6; color: #334155; }}
        .story-audio-player {{ display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 16px; border: 1px solid #e2e8f0; }}
        .btn-circle-play {{ width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; border: none; display: flex; justify-content: center; align-items: center; cursor: pointer; }}
        .audio-wave {{ flex: 1; display: flex; align-items: center; gap: 4px; height: 30px; }}
        .bar {{ width: 4px; background: var(--primary); border-radius: 2px; opacity: 0.5; }}
        .h-10 {{ height: 10px; }} .h-15 {{ height: 15px; }} .h-20 {{ height: 20px; }} .h-25 {{ height: 25px; }} .h-30 {{ height: 30px; }}
        .audio-time {{ font-size: 12px; font-weight: 600; color: var(--text-muted); }}

        /* Dictation */
        .audio-player-lg {{ display: flex; flex-direction: column; align-items: center; gap: 16px; }}
        .btn-play-lg {{ width: 72px; height: 72px; border-radius: 50%; background: var(--primary-light); color: var(--primary); border: none; font-size: 28px; display: flex; justify-content: center; align-items: center; cursor: pointer; padding-left: 6px; }}
        .audio-timer {{ font-size: 14px; font-weight: 700; color: var(--text-main); }}
        .audio-repeat {{ width: 36px; height: 36px; border-radius: 50%; background: white; color: var(--text-muted); border: 1px solid #e2e8f0; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .dictation-input {{ width: 100%; border: none; border-bottom: 2px solid #cbd5e1; padding: 16px 0; font-size: 24px; text-align: center; font-weight: 700; color: var(--text-main); outline: none; background: transparent; }}
        .dictation-input:focus {{ border-color: var(--primary); }}
        .input-success {{ border-color: var(--green) !important; color: var(--green); }}
        .input-error {{ border-color: var(--red) !important; color: var(--red); }}
        
        .feedback-card {{ padding: 20px; border-radius: 16px; border-width: 2px; border-style: solid; }}
        .success-card {{ background: #f0fdf4; border-color: #bbf7d0; }}
        .error-card {{ background: #fef2f2; border-color: #fecaca; }}
        .fc-title {{ font-weight: 800; font-size: 16px; }}
        .success-card .fc-title {{ color: var(--green); }}
        .error-card .fc-title {{ color: var(--red); }}
        .fc-desc {{ font-size: 15px; line-height: 1.5; color: var(--text-main); }}
        
        /* Sentence Ordering */
        .q-label {{ font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }}
        .q-instruction {{ font-size: 14px; color: var(--text-muted); line-height: 1.4; }}
        .sentence-builder {{ display: flex; flex-wrap: wrap; gap: 8px; min-height: 60px; padding-bottom: 20px; border-bottom: 1px dashed #cbd5e1; }}
        .word-slot {{ height: 44px; min-width: 60px; border-radius: 12px; display: flex; justify-content: center; align-items: center; padding: 0 16px; font-size: 16px; font-weight: 600; }}
        .word-slot.active {{ background: #e2e8f0; border: 2px dashed #94a3b8; }}
        .word-slot.filled {{ background: white; border: 1px solid #cbd5e1; color: var(--text-main); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .word-slot.filled.success {{ background: var(--green); color: white; border-color: var(--green); box-shadow: none; }}
        .word-slot.filled.error {{ background: var(--red); color: white; border-color: var(--red); box-shadow: none; }}
        
        .word-bank-container {{ margin-top: 20px; }}
        .word-bank-label {{ font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 12px; }}
        .word-bank {{ display: flex; flex-wrap: wrap; gap: 12px; }}
        .word-btn {{ background: white; border: 1px solid #cbd5e1; color: var(--text-main); height: 44px; padding: 0 16px; border-radius: 12px; font-size: 16px; font-weight: 600; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; }}
        .word-btn.empty {{ background: #f1f5f9; color: transparent; border: 1px dashed #cbd5e1; box-shadow: none; pointer-events: none; }}
        
        .feedback-banner {{ margin-top: 20px; padding: 16px; border-radius: 16px; }}
        .banner-success {{ background: var(--green); color: white; }}
        .banner-error {{ background: var(--red); color: white; }}
        .banner-title {{ font-weight: 800; font-size: 16px; margin-bottom: 4px; }}
        .banner-desc {{ font-size: 15px; font-weight: 500; opacity: 0.9; }}

        /* Matching Game */
        .bg-game {{ background-color: #fef08a; }}
        .timer-banner {{ background: white; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 18px; color: var(--orange); display: inline-flex; align-items: center; gap: 8px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }}
        .match-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }}
        .match-card {{ background: white; border-radius: 16px; height: 80px; display: flex; justify-content: center; align-items: center; font-size: 16px; font-weight: 700; color: var(--text-main); box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 3px solid transparent; cursor: pointer; transition: 0.2s; }}
        .match-card:active {{ transform: scale(0.95); }}
        .match-card.selected {{ border-color: var(--orange); background: #fff7ed; color: var(--orange); }}
        .match-card.matched {{ border-color: var(--green); background: #f0fdf4; color: var(--green); opacity: 0.6; pointer-events: none; }}
        
        .result-screen {{ background: white; padding-top: 60px; }}
        .stars-container {{ display: flex; justify-content: center; gap: 10px; align-items: center; }}
        .animate-pop {{ animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }}
        .animate-pop:nth-child(2) {{ animation-delay: 0.1s; }}
        .animate-pop:nth-child(3) {{ animation-delay: 0.2s; }}
        @keyframes popIn {{ 0% {{ transform: scale(0); opacity: 0; }} 100% {{ transform: scale(1); opacity: 1; }} }}
        .result-title {{ font-size: 36px; font-weight: 800; }}
        .result-subtitle {{ font-size: 16px; font-weight: 500; }}
        .stats-box {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px; width: 80%; margin: 0 auto; }}
        .stat-item {{ font-size: 15px; font-weight: 600; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }}
        .stat-item:last-child {{ margin-bottom: 0; }}
        .stat-item i {{ font-size: 18px; width: 24px; text-align: center; }}

        /* Pronunciation */
        .pronounce-word {{ font-size: 36px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }}
        .pronounce-ipa {{ font-size: 18px; color: var(--text-muted); font-weight: 500; margin-bottom: 8px; }}
        .pronounce-meaning {{ font-size: 18px; }}
        
        .mic-container {{ display: flex; flex-direction: column; align-items: center; }}
        .mic-btn-outer {{ width: 100px; height: 100px; border-radius: 50%; background: var(--primary-light); display: flex; justify-content: center; align-items: center; position: relative; }}
        .mic-btn {{ width: 70px; height: 70px; border-radius: 50%; background: var(--primary); color: white; border: none; font-size: 28px; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4); z-index: 2; transition: 0.2s; }}
        .mic-btn-outer.recording::before, .mic-btn-outer.recording::after {{ content: ''; position: absolute; width: 100%; height: 100%; border-radius: 50%; background: var(--primary-light); animation: ripple 1.5s infinite ease-out; z-index: 1; }}
        .mic-btn-outer.recording::after {{ animation-delay: 0.75s; }}
        @keyframes ripple {{ 0% {{ transform: scale(1); opacity: 1; }} 100% {{ transform: scale(1.5); opacity: 0; }} }}
        .mic-recording {{ background: var(--red); box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4); }}
        
        .recording-waves {{ display: flex; justify-content: center; align-items: center; gap: 8px; height: 60px; }}
        .recording-waves .wave {{ width: 8px; background: var(--primary); border-radius: 4px; animation: wave-anim 1.2s infinite ease-in-out; }}
        .recording-waves .wave:nth-child(1) {{ height: 20px; animation-delay: 0s; }}
        .recording-waves .wave:nth-child(2) {{ height: 40px; animation-delay: 0.1s; }}
        .recording-waves .wave:nth-child(3) {{ height: 60px; animation-delay: 0.2s; }}
        .recording-waves .wave:nth-child(4) {{ height: 30px; animation-delay: 0.3s; }}
        .recording-waves .wave:nth-child(5) {{ height: 50px; animation-delay: 0.4s; }}
        @keyframes wave-anim {{ 0%, 100% {{ transform: scaleY(0.5); opacity: 0.5; }} 50% {{ transform: scaleY(1); opacity: 1; }} }}
        
        .animate-pulse {{ animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }}
        @keyframes pulse {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: .5; }} }}
        
        .score-card {{ background: white; border: 2px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }}
        .score-title {{ font-size: 18px; font-weight: 800; color: var(--text-main); }}
        .score-breakdown {{ display: flex; justify-content: space-around; padding: 12px; background: #f8fafc; border-radius: 12px; }}
        .sb-item {{ font-weight: 700; font-size: 14px; text-transform: uppercase; }}

    </style>
</head>
<body>
    <div class="gallery-title">Language Learning App UI Mockups</div>
    <div class="gallery">
'''

html_end = '''
    </div>
</body>
</html>
'''

with open('d:\\Emm iuu khóa luận\\admin\\mobile_app.html', 'w', encoding='utf-8') as f:
    f.write(html_template)
    for s in screens:
        f.write(s)
    f.write(html_end)

print("Done generating mobile_app.html")
