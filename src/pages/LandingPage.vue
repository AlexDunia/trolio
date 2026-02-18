<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { nextTick } from 'vue'

// Toggle a body class so the landing page can use a different font
onMounted(() => document.body.classList.add('landing-font'))
onUnmounted(() => document.body.classList.remove('landing-font'))

const faqs = ref([
  {
    q: 'What exactly does Trolio track?',
    a: 'Trolio tracks your time on chart, consistency (streaks), and behavior patterns so you can understand where your focus goes and how it connects to results.',
  },
  {
    q: 'Do I have to share my P&L publicly?',
    a: 'No. You control visibility. You can keep sensitive details private while still sharing proof of consistency and dedication.',
  },
  {
    q: 'Does Trolio work with MT5 and prop firms?',
    a: 'Yes. You can connect or upload your MT5 trade history, and categorize results by broker/prop firm to keep your profile clean and credible.',
  },
  {
    q: 'Is this just a journal?',
    a: 'No. Trolio is a credibility layer: proof, accountability, and a clean public/private trader profile—without the noise.',
  },
  {
    q: 'Can I use it for forex, crypto, or synthetics?',
    a: 'Yes. You can track time spent and performance across markets—forex, crypto, synthetics, and more—so you see what’s really improving.',
  },
])

/* single-open accordion */
const openIndex = ref(0)

/* smooth height animation */
const heights = ref([])
const answerEls = ref([])

const measure = async () => {
  await nextTick()
  heights.value = answerEls.value.map((el) => (el ? el.scrollHeight : 0))
}

const toggle = async (idx) => {
  openIndex.value = openIndex.value === idx ? -1 : idx
  await measure()
}

onMounted(async () => {
  await nextTick()
  answerEls.value = Array.from(document.querySelectorAll('.faq-item__a'))
  await measure()
  window.addEventListener('resize', measure, { passive: true })
})

/* ===== Nav scroll ===== */
const navRef = ref(null)

const handleScroll = () => {
  const navEl = navRef.value
  if (!navEl) return

  if (window.pageYOffset > 50) navEl.classList.add('scrolled')
  else navEl.classList.remove('scrolled')
}

/* ===== Smooth scroll ===== */
const setupSmoothScroll = () => {
  const clickHandler = (e) => {
    const anchor = e.target.closest('a[href^="#"]')
    if (!anchor) return

    const href = anchor.getAttribute('href')
    if (!href) return

    const target = document.querySelector(href)
    if (!target) return

    e.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  document.addEventListener('click', clickHandler)
  return () => document.removeEventListener('click', clickHandler)
}

/* ===== Fade-in observer ===== */
const setupFadeInObserver = () => {
  const els = document.querySelectorAll('.fade-in')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -90px 0px' },
  )

  els.forEach((el) => observer.observe(el))
  return () => observer.disconnect()
}

/* ===== Wrapped carousel ===== */
const wrappedCards = ref([
  {
    id: 'scalper',
    title: 'The Scalper',
    img: 'https://res.cloudinary.com/dnuhjsckk/image/upload/v1770934354/Trolio-Scalper_ntqygg.jpg',
  },
  {
    id: 'specialist',
    title: 'The Specialist',
    img: 'https://res.cloudinary.com/dnuhjsckk/image/upload/v1770934354/Trolio-Specialist_nfhfni.jpg',
  },
  {
    id: 'chaos',
    title: 'Chaos Day',
    img: 'https://res.cloudinary.com/dnuhjsckk/image/upload/v1770934355/Trolio-ChaosDay_1_e3finn.jpg',
  },
])

const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    handle: '@sarahj',
    avatar: 'https://i.pravatar.cc/96?img=32',
    text: 'Since integrating this solution into our workflow, we’ve experienced a significant improvement in efficiency and collaboration.',
  },
  {
    name: 'David Patel',
    role: 'Project Manager',
    handle: '@davidp',
    avatar: 'https://i.pravatar.cc/96?img=12',
    text: 'I’ve found the interface simple and intuitive. Our team now ships faster while staying organized and comprehensive.',
  },
  {
    name: 'Emily Carter',
    role: 'Operations Manager',
    handle: '@emilyc',
    avatar: 'https://i.pravatar.cc/96?img=45',
    text: 'The tool is both powerful and approachable. It’s improved our reporting, reduced friction, and helped our team stay focused.',
  },
]

const activeIndex = ref(1)
const prev = () => {
  activeIndex.value =
    (activeIndex.value - 1 + wrappedCards.value.length) % wrappedCards.value.length
}
const next = () => {
  activeIndex.value = (activeIndex.value + 1) % wrappedCards.value.length
}
const goTo = (idx) => {
  activeIndex.value = idx
}

const leftIndex = computed(
  () => (activeIndex.value - 1 + wrappedCards.value.length) % wrappedCards.value.length,
)
const rightIndex = computed(() => (activeIndex.value + 1) % wrappedCards.value.length)

const onKey = (e) => {
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

const year = new Date().getFullYear()

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  const cleanupScroll = setupSmoothScroll()
  const cleanupObserver = setupFadeInObserver()
  window.addEventListener('keydown', onKey)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    cleanupScroll()
    cleanupObserver()
    window.removeEventListener('keydown', onKey)
  })
})
</script>

<template>
  <div class="page">
    <!-- Navigation -->
    <nav id="nav" ref="navRef">
      <div class="nav-container">
        <a href="#" class="logo">
          <div class="logo-icon">T</div>
          <span>trolio</span>
        </a>

        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#problems">The Problem</a></li>
          <li><a href="#how-to-use">How to use</a></li>
          <li><a href="#social-proof">Social Proof</a></li>
          <li><a href="#why-trolio">Why Trolio</a></li>
        </ul>

        <div class="nav-cta">
          <a href="#" class="btn btn-ghost">Log In</a>
          <a href="#" class="btn btn-primary">Sign Up</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="hero-content">
        <h1>
          <span class="highlight">Wrapped</span>
          <span class="script">For Traders</span>
        </h1>

        <p>
          Track how much time you spend on the chart, and find out more about yourself.
          Understanding yourself is part of becoming a better trader.
        </p>

        <div class="hero-cta">
          <div class="extension-buttons">
            <button class="extension-btn primary" type="button">
              <svg
                class="extension-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              Chrome extension
            </button>

            <button class="extension-btn" type="button">
              <svg
                class="extension-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              Safari extension
            </button>

            <button class="extension-btn" type="button">
              <svg
                class="extension-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              Edge extension
            </button>
          </div>
        </div>
      </div>

      <div class="stats-preview">
        <div class="stats-card">
          <div class="stats-grid">
            <div class="stat-item yellow">
              <div class="stat-icon">🏆</div>
              <div class="stat-label">Universal Rank</div>
              <div class="stat-value">Top 2%</div>
            </div>

            <div class="stat-item mint">
              <div class="stat-icon">⚡</div>
              <div class="stat-label">Uptime Streak</div>
              <div class="stat-value">366 days</div>
            </div>

            <div class="stat-item blue">
              <div class="stat-icon">🏆</div>
              <div class="stat-label">Total Completion</div>
              <div class="stat-value">1,747</div>
            </div>

            <div class="stat-item peach">
              <div class="stat-icon">📅</div>
              <div class="stat-label">Most Active Month</div>
              <div class="stat-value">December</div>
            </div>

            <div class="stat-item lavender">
              <div class="stat-icon">📊</div>
              <div class="stat-label">Most Active Day</div>
              <div class="stat-value">Saturday</div>
            </div>

            <div class="stat-item yellow">
              <div class="stat-icon">⭐</div>
              <div class="stat-label">Rare Badges</div>
              <div class="stat-value">1,298</div>
            </div>
          </div>

          <div class="share-badge fade-in">Share as Image</div>
        </div>
      </div>
    </section>

    <!-- The Problem Traders Face -->
    <section id="problems" class="problem-section">
      <div class="problem-container">
        <div class="problem-header">
          <h2>The Problem Traders Face</h2>
          <p>Download extension, track progress and uptime. Find out more about yourself.</p>
        </div>

        <div class="problem-steps">
          <div class="problem-step">
            <div class="problem-step-number">1</div>
            <h3>No Real Credibility</h3>
            <p>
              Traders are often seen as “scammers” or “marketers.” Even with wins shared online,
              real credibility is still hard to build. Too much noise, exaggeration, and proof
              that’s easy to fake.
            </p>
          </div>

          <div class="problem-step">
            <div class="problem-step-number">2</div>
            <h3>Unclear Progress</h3>
            <p>
              You spend time on crypto, derivatives, or forex — analyzing charts, backtesting, and
              trading. You make some cash, and it feels like progress, but it’s unclear which assets
              or markets are improving, or how your performance has changed over time.
            </p>
          </div>

          <div class="problem-step">
            <div class="problem-step-number">3</div>
            <h3>No Recognition for Consistency</h3>
            <p>
              You're grinding daily but have no way to show growth. No recognition for the
              consistency that separates pros from gamblers.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How to use (Dark Section) -->
    <section id="how-to-use" class="howto-section">
      <div class="howto-container">
        <div class="howto-header fade-in">
          <h2 class="howto-gradient-title">How to use</h2>
          <p>Four simple steps to prove your dedication</p>
        </div>

        <div class="howto-grid">
          <article class="howto-card fade-in">
            <div class="howto-visual howto-visual--float">
              <img
                class="howto-img howto-img--layer howto-img--layer-a"
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770933262/Group_1000002875_hql98k.png"
                alt="Auto-Track Chart Time preview"
                loading="lazy"
              />
              <img
                class="howto-img howto-img--layer howto-img--layer-b"
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770933262/Group_1000002902_zs0sti.png"
                alt="Chart time card preview"
                loading="lazy"
              />
            </div>

            <h3>Auto-Track Chart Time</h3>
            <p>
              Download Browser extension (Chrome, Safari, and Edge) and log every minute spent on
              chart. See exactly where your focus goes—forex, crypto, synthetics—and how it connects
              to results.
            </p>
          </article>

          <article class="howto-card fade-in">
            <div class="howto-visual howto-visual--float">
              <img
                class="howto-img howto-img--single"
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770933262/Trolio-NightOwl_1_brkdvp.png"
                alt="Night Owl card preview"
                loading="lazy"
              />
            </div>

            <h3>Connect your MT5 or Broker</h3>
            <p>
              Connect your MT5 account or upload trade history. It takes 2 minutes. No complexity.
            </p>
          </article>

          <article class="howto-card fade-in">
            <div class="howto-visual howto-visual--float">
              <img
                class="howto-img howto-img--single"
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770933263/Group_1000002903_b1cnj8.png"
                alt="Build social proof preview"
                loading="lazy"
              />
            </div>

            <h3>Build Social Proof</h3>
            <p>
              Control what's public. Share wins. Keep sensitive data private. Be the trader your
              peers recommend.
            </p>
          </article>

          <article class="howto-card fade-in">
            <div class="howto-visual howto-visual--float howto-visual--ghost">
              <img
                class="howto-img howto-img--single howto-img--ghost"
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770933262/Group_1000002875_hql98k.png"
                alt="Share wrapped preview"
                loading="lazy"
              />
            </div>

            <h3>Save & Share Your Wrapped</h3>
            <p>
              Export your wrapped cards and share proof of consistency—without exposing anything you
              don’t want public.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Show social proof everywhere -->
    <section id="social-proof" class="social-section">
      <div class="social-container">
        <header class="social-header fade-in">
          <h2>Show social proof everywhere</h2>
          <p>
            Turn your trading dedication into shareable, beautiful cards to show your credibility
          </p>
        </header>

        <div class="social-stage fade-in" aria-label="Wrapped cards preview">
          <img
            class="wrapped wrapped--left"
            :src="wrappedCards[leftIndex].img"
            :alt="wrappedCards[leftIndex].title"
            loading="lazy"
            draggable="false"
          />
          <img
            class="wrapped wrapped--center"
            :src="wrappedCards[activeIndex].img"
            :alt="wrappedCards[activeIndex].title"
            loading="lazy"
            draggable="false"
          />
          <img
            class="wrapped wrapped--right"
            :src="wrappedCards[rightIndex].img"
            :alt="wrappedCards[rightIndex].title"
            loading="lazy"
            draggable="false"
          />
        </div>

        <div class="social-panel fade-in">
          <div class="social-controls">
            <button class="nav-btn" type="button" aria-label="Previous card" @click="prev">
              <span aria-hidden="true">←</span>
            </button>

            <button
              class="nav-btn nav-btn--primary"
              type="button"
              aria-label="Next card"
              @click="next"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div class="social-dots" role="tablist" aria-label="Select wrapped card">
            <button
              v-for="(c, i) in wrappedCards"
              :key="c.id"
              class="dot"
              :class="{ active: i === activeIndex }"
              type="button"
              :aria-label="`Show ${c.title}`"
              @click="goTo(i)"
            />
          </div>

          <div class="social-cta-wrap">
            <button class="social-cta" type="button">Start Creating Your Wrapped</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Traders chose Trolio -->
    <section id="why-trolio" class="why-section">
      <div class="why-container">
        <header class="why-title fade-in">
          <h2>Why Traders chose Trolio</h2>
        </header>

        <div class="why-row fade-in">
          <div class="why-text">
            <h3>See Yourself Clearly</h3>
            <p>
              Most traders fail because they don't know themselves. Are you a EUR/USD specialist or
              scattered across 20 pairs? Trolio tracks your patterns automatically. Finally see
              what's working and what's draining your account.
            </p>
          </div>

          <div class="why-visual">
            <div class="why-panel">
              <img
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770938115/Group_1000002907_yppcx3.png"
                alt="See yourself clearly preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div class="why-row why-row--reverse fade-in">
          <div class="why-text">
            <h3>Your Control, Your Credibility</h3>
            <p>
              Share your streak publicly. Keep your preferred data public or private. If you're
              consistently profitable, Trolio makes it obvious.
            </p>
          </div>

          <div class="why-visual">
            <div class="why-panel">
              <img
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770938114/Group_1000002908_nr8v2y.png"
                alt="Control and credibility preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div class="why-row fade-in">
          <div class="why-text">
            <h3>Time Tracked = Progress Proven</h3>
            <p>
              Every successful trader knows: No presence, no results. Trolio connects chart time to
              results. Spent 80 hours on Gold? See if it paid off. Study hard, trade easy, your
              focus (or lack of it) becomes undeniable.
            </p>
          </div>

          <div class="why-visual">
            <div class="why-panel">
              <img
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770938114/Group_1000002905_poluot.png"
                alt="Time tracked preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div class="why-row why-row--reverse fade-in">
          <div class="why-text">
            <h3>Stop Guessing, Start Knowing</h3>
            <p>
              You keep guessing, What top strategies work best for you? How much have you made from
              each? How many hours do top traders spend on charts that made them become? Where do
              you rank? What are your most profitable assets? Which have you faced the most losses?
              . Trolio gives you a data-backed edge.
            </p>
          </div>

          <div class="why-visual">
            <div class="why-panel">
              <img
                src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770938114/Group_1000002906_z1bstj.png"
                alt="Stop guessing preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews Section (UPDATED: light bg + calm text) -->
    <section class="reviews" id="reviews">
      <div class="reviews__container">
        <div class="reviews__header">
          <h2 class="reviews__title">What traders are saying</h2>
          <p class="reviews__subtitle">
            Real feedback from traders using Trolio to build credibility.
          </p>
        </div>

        <div class="reviews__cards">
          <div v-for="(review, index) in reviews" :key="index" class="review-card">
            <div class="review-card__top">
              <img :src="review.avatar" class="review-card__avatar" alt="Reviewer avatar" />
              <div class="review-card__meta">
                <div class="review-card__name">{{ review.name }}</div>
                <div class="review-card__role">
                  {{ review.role }} <span class="review-card__handle">{{ review.handle }}</span>
                </div>
              </div>
            </div>

            <p class="review-card__text">"{{ review.text }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ (UPDATED: softer strokes + faster open) -->
    <section id="faq" class="faq">
      <div class="container">
        <header class="faq__header">
          <h2 class="faq__title">FAQ</h2>
          <p class="faq__subtitle">Quick answers to the most common questions about Trolio.</p>
        </header>

        <div class="faq__list">
          <article
            v-for="(item, idx) in faqs"
            :key="item.q"
            class="faq-item"
            :class="{ 'is-open': openIndex === idx }"
          >
            <button
              class="faq-item__trigger"
              type="button"
              :aria-expanded="openIndex === idx"
              @click="toggle(idx)"
            >
              <span class="faq-item__q">{{ item.q }}</span>

              <span class="faq-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.5 9.5L12 15l5.5-5.5"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>

            <div
              class="faq-item__panel"
              :style="{ '--h': openIndex === idx ? `${heights[idx]}px` : '0px' }"
            >
              <div class="faq-item__a">
                {{ item.a }}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <!-- floating shape (no overlay background, just the image) -->
      <img
        class="footer__bg-shape"
        src="https://res.cloudinary.com/dnuhjsckk/image/upload/v1770983142/ChatGPT_Image_Feb_13_2026_12_44_27_PM_vrcfyp.png"
        alt=""
        aria-hidden="true"
      />

      <div class="footer__container">
        <!-- CTA -->
        <div class="footer__cta">
          <h2>Start proving your trading consistency.</h2>
          <p>
            Download the extension, track your chart time, and turn discipline into credibility —
            without exposing what you don’t want public.
          </p>

          <div class="footer__cta-buttons">
            <a href="#" class="footer__btn primary">Get Chrome Extension</a>
            <a href="#" class="footer__btn ghost">Create Free Account</a>
          </div>
        </div>

        <!-- Downloads -->
        <div class="footer__downloads">
          <div class="footer__downloads-title">Downloads</div>

          <div class="footer__downloads-grid">
            <a class="dl-chip" href="#"><span class="dl-ico"></span> App Store</a>
            <a class="dl-chip" href="#"><span class="dl-ico">▶</span> Google Play</a>
            <a class="dl-chip" href="#"><span class="dl-ico">🌐</span> Chrome extension</a>
            <a class="dl-chip" href="#"><span class="dl-ico">🌀</span> Edge extension</a>
            <a class="dl-chip" href="#"><span class="dl-ico">🦊</span> Firefox extension</a>
            <a class="dl-chip" href="#"><span class="dl-ico">🧭</span> Safari extension</a>
            <a class="dl-chip" href="#"><span class="dl-ico">📧</span> Outlook add-in</a>
          </div>
        </div>

        <!-- Links -->
        <div class="footer__links">
          <div>
            <div class="footer__col-title">Product</div>
            <a href="#">How it works</a>
            <a href="#">Wrapped</a>
            <a href="#">Profiles</a>
            <a href="#">Leaderboards</a>
          </div>

          <div>
            <div class="footer__col-title">Resources</div>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Press</a>
          </div>

          <div>
            <div class="footer__col-title">Legal</div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Data Agreement</a>
          </div>
        </div>

        <!-- Bottom -->
        <div class="footer__bottom">
          © {{ new Date().getFullYear() }} Trolio. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

:global(:root) {
  --primary-blue: #0066ff;
  --secondary-blue: #e8f1ff;
  --light-blue: #f5f9ff;
  --dark: #0a0e1a;
  --gray-900: #1a1f2e;
  --gray-700: #3d4455;
  --gray-500: #6b7280;
  --gray-300: #d1d5db;
  --gray-200: #e5e7eb;
  --gray-100: #f3f4f6;
  --white: #ffffff;
  --accent-yellow: #ffd93d;
  --accent-mint: #6effc4;
  --accent-lavender: #e5deff;
  --accent-peach: #ffe4d6;

  --ink-900: #0b1020;
  --ink-850: #11172a;
  --ink-700: rgba(255, 255, 255, 0.76);
  --ink-520: rgba(255, 255, 255, 0.56);

  --title-blue: #96c4ee;
}

:global(body) {
  font-family:
    'Poppins',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  background: var(--white);
  color: var(--dark);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  margin: 0;
}

/* When landing page is active we add a class to body to restore Outfit */
:global(body.landing-font) {
  font-family:
    'Outfit',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.page {
  width: 100%;
}

/* 88% container rule */
.nav-container,
.hero,
.problem-container,
.howto-container,
.social-container,
.why-container,
.reviews__container {
  width: min(88vw, 1280px);
  margin-left: auto;
  margin-right: auto;
}

/* Nav */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  border-bottom: 1px solid var(--gray-100);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

nav.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.nav-container {
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--dark);
  text-decoration: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-blue), #0052cc);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--primary-blue);
}

.nav-cta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.2);
}

.btn-primary:hover {
  background: #0052cc;
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.3);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--gray-700);
}

.btn-ghost:hover {
  color: var(--primary-blue);
}

/* Hero */
.hero {
  margin-top: 80px;
  padding: 5rem 0 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  color: var(--dark);
}

.hero-content h1 .highlight {
  color: var(--primary-blue);
}

.hero-content h1 .script {
  font-style: italic;
  font-weight: 500;
  color: var(--gray-700);
  display: block;
  margin-top: 0.5rem;
  font-size: 3.25rem;
}

.hero-content p {
  font-size: 1.15rem;
  color: var(--gray-700);
  margin-bottom: 2.5rem;
  line-height: 1.7;
  max-width: 42rem;
}

.extension-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.extension-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  font-weight: 600;
  color: var(--gray-900);
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.extension-btn:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.12);
  transform: translateY(-2px);
}

.extension-btn.primary {
  background: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
}

.extension-icon {
  width: 24px;
  height: 24px;
}

/* Stats */
.stats-preview {
  position: relative;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

.stats-card {
  background: var(--white);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--gray-100);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  padding: 1.25rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.6;
  z-index: 0;
}

.stat-item.yellow::before {
  background: var(--accent-yellow);
}
.stat-item.mint::before {
  background: var(--accent-mint);
}
.stat-item.blue::before {
  background: var(--secondary-blue);
}
.stat-item.peach::before {
  background: var(--accent-peach);
}
.stat-item.lavender::before {
  background: var(--accent-lavender);
}

.stat-icon,
.stat-label,
.stat-value {
  position: relative;
  z-index: 1;
}

.share-badge {
  background: var(--primary-blue);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Fade in */
.fade-in {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Problem */
.problem-section {
  background: rgba(245, 249, 255, 0.45);
  padding: 6rem 0;
}
.problem-header {
  text-align: center;
  margin-bottom: 4rem;
}
.problem-header h2 {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--dark);
}
.problem-header p {
  font-size: 1.25rem;
  color: var(--gray-700);
  max-width: 600px;
  margin: 0 auto;
}
.problem-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.problem-step {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-100);
  transition: all 0.3s;
}
.problem-step:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
.problem-step-number {
  width: 48px;
  height: 48px;
  background: var(--primary-blue);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}
.problem-step h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--dark);
}
.problem-step p {
  color: var(--gray-700);
  line-height: 1.7;
}

/* How-to (dark) */
.howto-section {
  background:
    radial-gradient(1200px 500px at 20% -10%, rgba(150, 196, 238, 0.1), transparent 60%),
    radial-gradient(900px 450px at 85% 10%, rgba(150, 196, 238, 0.08), transparent 60%),
    linear-gradient(180deg, var(--ink-900) 0%, var(--ink-850) 100%);
  padding: 5.75rem 0 6.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.howto-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.howto-gradient-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 0.6rem;
  background: linear-gradient(
    90deg,
    rgba(150, 196, 238, 1) 0%,
    rgba(168, 214, 255, 1) 45%,
    rgba(113, 168, 255, 0.95) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.howto-header p {
  color: var(--ink-520);
  font-size: 1.05rem;
  margin: 0;
}
.howto-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.25rem;
}
.howto-card {
  background:
    radial-gradient(900px 260px at 10% 10%, rgba(150, 196, 238, 0.14), transparent 60%),
    radial-gradient(700px 240px at 90% 10%, rgba(150, 196, 238, 0.08), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 18px;
  padding: 2.5rem 2.25rem 2.25rem;
  min-height: 26.5rem;
  box-shadow:
    0 22px 70px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  transition:
    transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 280ms ease;
}
.howto-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(150, 196, 238, 0.28);
  box-shadow:
    0 28px 90px rgba(0, 0, 0, 0.44),
    0 0 0 1px rgba(150, 196, 238, 0.1) inset;
}
.howto-visual {
  height: 13.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.6rem;
  position: relative;
}
.howto-visual--float {
  animation: howtoFloat 8s ease-in-out infinite;
}
@keyframes howtoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.howto-img {
  max-width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.35));
  transition:
    transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 320ms ease;
}
.howto-img--single {
  width: min(22rem, 92%);
}
.howto-img--layer {
  position: absolute;
  width: min(23rem, 92%);
}
.howto-img--layer-a {
  transform: translateX(-32px) rotate(-8deg) scale(0.95);
  opacity: 0.95;
}
.howto-img--layer-b {
  transform: translateX(40px) rotate(7deg) scale(0.98);
  opacity: 0.98;
}
.howto-card:hover .howto-img--layer-a {
  transform: translateX(-44px) rotate(-10deg) scale(0.965);
}
.howto-card:hover .howto-img--layer-b {
  transform: translateX(52px) rotate(9deg) scale(1.01);
}
.howto-card h3 {
  color: rgba(255, 255, 255, 0.93);
  font-size: 1.35rem;
  font-weight: 750;
  margin: 0 0 0.85rem;
}
.howto-card p {
  color: var(--ink-700);
  margin: 0;
  line-height: 1.75;
  font-size: 1.01rem;
}

/* Social Proof */
.social-section {
  background: #ffffff;
  padding: 6.25rem 0 6.5rem;
}
.social-header {
  text-align: center;
  margin-bottom: 3.6rem;
}
.social-header h2 {
  font-size: 3.1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgba(10, 14, 26, 0.58);
  margin: 0 0 0.9rem;
}
.social-header p {
  font-size: 1.15rem;
  color: rgba(61, 68, 85, 0.62);
  margin: 0;
}
.social-stage {
  position: relative;
  height: 360px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 24px;
  margin: 0 auto;
  user-select: none;
}
.wrapped {
  position: absolute;
  width: 360px;
  max-width: 64%;
  height: auto;
  border-radius: 14px;
  box-shadow: 0 26px 55px rgba(0, 0, 0, 0.18);
  transform-origin: center;
  transition:
    transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 420ms ease;
  will-change: transform;
}
.wrapped--center {
  z-index: 3;
  transform: translateY(18px) rotate(0deg) scale(1);
}
.wrapped--left {
  z-index: 2;
  transform: translateX(-210px) translateY(34px) rotate(-18deg) scale(0.93);
}
.wrapped--right {
  z-index: 1;
  transform: translateX(210px) translateY(34px) rotate(18deg) scale(0.93);
}
.social-stage:hover .wrapped--center {
  transform: translateY(12px) rotate(0deg) scale(1.01);
}
.social-panel {
  margin-top: 3.2rem;
  padding: 2.3rem 0 0;
  background: linear-gradient(180deg, rgba(245, 249, 255, 0.55), #ffffff);
  border-radius: 18px;
}
.social-controls {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 0.9rem;
}
.nav-btn {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 2px solid rgba(0, 102, 255, 0.25);
  background: rgba(0, 102, 255, 0.06);
  color: rgba(0, 102, 255, 0.55);
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}
.nav-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 102, 255, 0.35);
  box-shadow: 0 10px 22px rgba(0, 102, 255, 0.12);
}
.nav-btn--primary {
  border-color: rgba(0, 102, 255, 0.9);
  background: rgba(0, 102, 255, 0.1);
  color: rgba(0, 102, 255, 0.9);
  box-shadow: 0 10px 26px rgba(0, 102, 255, 0.14);
}
.social-dots {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  margin-bottom: 2.25rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  background: rgba(61, 68, 85, 0.22);
  cursor: pointer;
  transition:
    width 200ms ease,
    background 200ms ease,
    transform 200ms ease;
}
.dot.active {
  width: 34px;
  background: rgba(0, 102, 255, 0.95);
}
.dot:hover {
  transform: translateY(-1px);
}
.social-cta-wrap {
  display: flex;
  justify-content: center;
  padding-bottom: 2.75rem;
}
.social-cta {
  padding: 1.1rem 2.4rem;
  min-width: 360px;
  border-radius: 10px;
  border: none;
  background: #0066ff;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(0, 102, 255, 0.22);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}
.social-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 54px rgba(0, 102, 255, 0.26);
  background: #0052cc;
}

/* WHY */
.why-section {
  background: #ffffff;
  padding: 6.5rem 0 7rem;
}
.why-title {
  text-align: center;
  margin-bottom: 5.25rem;
}
.why-title h2 {
  margin: 0;
  font-size: 3.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgba(10, 14, 26, 0.58);
}
.why-row {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 4.25rem;
  align-items: center;
  padding: 4.1rem 0;
}
.why-row--reverse {
  grid-template-columns: 0.95fr 1.05fr;
}
.why-row--reverse .why-text {
  order: 2;
}
.why-row--reverse .why-visual {
  order: 1;
}
.why-text h3 {
  margin: 0 0 1.15rem;
  font-size: 2.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(10, 14, 26, 0.58);
}
.why-text p {
  margin: 0;
  font-size: 1.06rem;
  line-height: 2.05;
  color: rgba(61, 68, 85, 0.65);
  max-width: 46rem;
}
.why-visual {
  display: flex;
  justify-content: flex-end;
}
.why-row--reverse .why-visual {
  justify-content: flex-start;
}
.why-panel {
  width: min(520px, 100%);
  background: rgba(245, 245, 245, 0.85);
  border-radius: 10px;
  padding: 2.1rem;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
}
.why-panel img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

/* Reviews (UPDATED: light + clean) */
.reviews {
  padding: 110px 0;
  background: linear-gradient(180deg, rgba(245, 249, 255, 0.85) 0%, #ffffff 65%);
  border-top: 1px solid rgba(11, 18, 34, 0.06);
}
.reviews__header {
  text-align: center;
  margin-bottom: 52px;
}
.reviews__title {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  color: rgba(11, 18, 34, 0.78);
}
.reviews__subtitle {
  margin: 0;
  font-size: 18px;
  color: rgba(61, 68, 85, 0.62);
}
.reviews__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.review-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(11, 18, 34, 0.08);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.06);
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}
.review-card:hover {
  transform: translateY(-4px);
  border-color: rgba(150, 196, 238, 0.55);
  box-shadow:
    0 18px 52px rgba(15, 23, 42, 0.08),
    0 0 0 5px rgba(150, 196, 238, 0.12);
}
.review-card__top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.review-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(150, 196, 238, 0.35);
}
.review-card__meta {
  display: grid;
  gap: 2px;
}
.review-card__name {
  font-weight: 700;
  color: rgba(11, 18, 34, 0.82);
}
.review-card__role {
  font-size: 13.5px;
  color: rgba(61, 68, 85, 0.62);
}
.review-card__handle {
  color: rgba(0, 102, 255, 0.75);
  margin-left: 6px;
  font-weight: 600;
}
.review-card__text {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(61, 68, 85, 0.72);
  margin: 0;
}

/* FAQ */
.container {
  width: min(88%, 1200px);
  margin: 0 auto;
}
.faq {
  padding: 110px 0;
  background: #ffffff;
}
.faq__header {
  text-align: center;
  margin-bottom: 40px;
}
.faq__title {
  margin: 0 0 10px;
  font-size: 44px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgba(11, 18, 34, 0.78);
}
.faq__subtitle {
  margin: 0 auto;
  max-width: 680px;
  font-size: 18px;
  line-height: 1.7;
  color: rgba(11, 18, 34, 0.56);
}
.faq__list {
  display: grid;
  gap: 14px;
  max-width: 980px;
  margin: 0 auto;
}

/* softer strokes/shadows + faster open */
.faq-item {
  border-radius: 16px;
  background: rgba(250, 251, 255, 1);
  border: 1px solid rgba(11, 18, 34, 0.06);
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}
.faq-item:hover {
  border-color: rgba(150, 196, 238, 0.45);
  box-shadow:
    0 14px 38px rgba(15, 23, 42, 0.06),
    0 0 0 4px rgba(150, 196, 238, 0.1);
  transform: translateY(-1px);
}
.faq-item.is-open {
  border-color: rgba(150, 196, 238, 0.55);
  box-shadow:
    0 16px 44px rgba(15, 23, 42, 0.07),
    0 0 0 5px rgba(150, 196, 238, 0.12);
}
.faq-item__trigger {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
}
.faq-item__q {
  font-size: 16.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgba(11, 18, 34, 0.82);
}
.faq-item__icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(150, 196, 238, 0.12);
  color: rgba(11, 18, 34, 0.62);
  transition:
    transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1),
    background 180ms ease,
    color 180ms ease;
}
.faq-item__icon svg {
  width: 22px;
  height: 22px;
}
.faq-item.is-open .faq-item__icon {
  background: rgba(0, 102, 255, 0.1);
  color: rgba(0, 102, 255, 0.85);
  transform: rotate(180deg);
}
.faq-item__panel {
  height: var(--h);
  transition: height 200ms cubic-bezier(0.2, 0.9, 0.2, 1);
  overflow: hidden;
}
.faq-item__a {
  padding: 0 20px 18px 20px;
  color: rgba(61, 68, 85, 0.72);
  font-size: 15.5px;
  line-height: 1.75;
  border-top: 1px solid rgba(11, 18, 34, 0.05);
}
.faq-item.is-open .faq-item__a {
  padding-top: 14px;
}

/* ===== FOOTER ===== */
.footer {
  position: relative;
  background: #dde2ee;
  padding: 120px 0 60px;
  overflow: hidden;
}

.footer__bg-shape {
  position: absolute;
  right: 10%;
  top: 40px;
  width: 260px;
  opacity: 0.35;
  pointer-events: none;
}

.footer__container {
  width: min(88%, 1200px);
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* ===== CTA ===== */
.footer__cta {
  max-width: 720px;
  margin-bottom: 60px;
}

.footer__cta h2 {
  font-size: 42px;
  font-weight: 700;
  color: #0b1222;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.footer__cta p {
  font-size: 18px;
  color: rgba(11, 18, 34, 0.65);
  margin-bottom: 28px;
}

.footer__cta-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.footer__btn {
  padding: 14px 26px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer__btn.primary {
  background: #0066ff;
  color: #fff;
  box-shadow: 0 14px 30px rgba(0, 102, 255, 0.25);
}

.footer__btn.primary:hover {
  transform: translateY(-2px);
}

.footer__btn.ghost {
  border: 1px solid rgba(11, 18, 34, 0.2);
  color: #0b1222;
  background: transparent;
}

.footer__btn.ghost:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* ===== Downloads ===== */
.footer__downloads {
  margin-bottom: 60px;
}

.footer__downloads-title {
  font-weight: 600;
  font-size: 14px;
  color: rgba(11, 18, 34, 0.6);
  margin-bottom: 14px;
}

.footer__downloads-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.dl-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(11, 18, 34, 0.08);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  color: #0b1222;
  transition: all 0.15s ease;
}

.dl-chip:hover {
  transform: translateY(-2px);
}

.dl-ico {
  font-size: 16px;
}

.footer {
  position: relative;
  background: #dde2ee;
  padding: 110px 0 60px;
  overflow: hidden;
}

/* your floating square */
.footer__bg-shape {
  position: absolute;
  right: 8%;
  top: 40px;
  width: 300px;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

.footer__container {
  width: min(88%, 1200px);
  margin: 0 auto;
  position: relative;
  z-index: 1; /* IMPORTANT: makes text sit above the image */
}

/* CTA */
.footer__cta {
  max-width: 760px;
  margin-bottom: 55px;
}

.footer__cta h2 {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0b1222;
  margin: 0 0 14px;
}

.footer__cta p {
  font-size: 18px;
  line-height: 1.8;
  color: rgba(11, 18, 34, 0.62);
  margin: 0 0 24px;
}

.footer__cta-buttons {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.footer__btn {
  padding: 14px 22px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: transform 0.15s ease;
}

.footer__btn.primary {
  background: #0066ff;
  color: #fff;
  box-shadow: 0 18px 40px rgba(0, 102, 255, 0.22);
}
.footer__btn.primary:hover {
  transform: translateY(-2px);
}

.footer__btn.ghost {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(11, 18, 34, 0.12);
  color: #0b1222;
}
.footer__btn.ghost:hover {
  transform: translateY(-2px);
}

/* Downloads */
.footer__downloads {
  margin-bottom: 52px;
}

.footer__downloads-title {
  font-weight: 700;
  font-size: 14px;
  color: rgba(11, 18, 34, 0.65);
  margin-bottom: 14px;
}

.footer__downloads-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.dl-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(11, 18, 34, 0.08);
  text-decoration: none;
  font-weight: 700;
  font-size: 13.5px;
  color: rgba(11, 18, 34, 0.92);
  transition: transform 0.15s ease;
}

.dl-chip:hover {
  transform: translateY(-2px);
}

.dl-ico {
  font-size: 15px;
}

/* Links */
.footer__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 56px;
  margin-bottom: 40px;
}

.footer__col-title {
  font-weight: 800;
  margin-bottom: 14px;
  color: rgba(11, 18, 34, 0.92);
}

.footer__links a {
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 14px;
  color: rgba(11, 18, 34, 0.62);
}

.footer__links a:hover {
  color: #0066ff;
}

/* Bottom */
.footer__bottom {
  border-top: 1px solid rgba(11, 18, 34, 0.12);
  padding-top: 18px;
  font-size: 13px;
  color: rgba(11, 18, 34, 0.6);
}

/* Responsive */
@media (max-width: 900px) {
  .footer__links {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer__cta h2 {
    font-size: 32px;
  }

  .footer__bg-shape {
    right: -10%;
    width: 260px;
    opacity: 0.25;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .stats-preview {
    order: -1;
  }
  .problem-steps {
    grid-template-columns: 1fr;
  }
  .howto-grid {
    grid-template-columns: 1fr;
  }
  .reviews__cards {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .hero-content h1 {
    font-size: 2.5rem;
  }
  .hero-content h1 .script {
    font-size: 2.35rem;
  }
  .extension-buttons {
    flex-direction: column;
  }
  .extension-btn {
    width: 100%;
    justify-content: center;
  }
  .social-header h2 {
    font-size: 2.2rem;
  }
  .social-stage {
    height: 290px;
  }
  .wrapped {
    width: 92%;
    max-width: 92%;
  }
  .wrapped--left,
  .wrapped--right {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
    pointer-events: none;
  }
  .social-cta {
    min-width: 0;
    width: 100%;
  }
  .why-row,
  .why-row--reverse {
    grid-template-columns: 1fr;
    gap: 2.25rem;
    padding: 3.25rem 0;
  }
  .why-row--reverse .why-text,
  .why-row--reverse .why-visual {
    order: initial;
  }
  .why-visual,
  .why-row--reverse .why-visual {
    justify-content: center;
  }
  .why-title {
    margin-bottom: 3.5rem;
  }
}
</style>
