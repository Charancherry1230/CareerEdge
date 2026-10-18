with open('index1.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS rules in head for perfect alignment of Eligibility section
custom_styles = '''  <link rel="stylesheet" href="styles1.css">
  
  <style>
    /* Eligibility Section Perfect Visual Balance & Vertical Alignment */
    .eligibility-layout {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 36px;
      align-items: stretch;
    }
    .elig-rule-cards {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      height: 100%;
    }
    .elig-rule {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 22px 24px;
      background: var(--white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      transition: all var(--trans-fast);
    }
    .elig-rule:hover {
      border-color: var(--blue-400);
      transform: translateX(4px);
      box-shadow: var(--shadow-xs);
    }
    .elig-rule__content {
      flex: 1;
    }
    .elig-rule__content strong {
      display: block;
      font-size: 16px;
      font-weight: 800;
      color: var(--blue-900);
      margin-bottom: 4px;
    }
    .elig-rule__content p {
      font-size: 14px;
      color: var(--ink-secondary);
      line-height: 1.5;
      margin: 0;
    }
    .elig-profiler {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px 28px;
    }
    @media (max-width: 1024px) {
      .eligibility-layout {
        grid-template-columns: 1fr;
      }
      .elig-rule {
        padding: 18px 20px;
      }
    }
  </style>'''

if '<link rel="stylesheet" href="styles1.css">' in content and '/* Eligibility Section Perfect Visual Balance' not in content:
    content = content.replace('  <link rel="stylesheet" href="styles1.css">', custom_styles, 1)

# 2. Re-arrange Eligibility section in index1.html
old_eligibility_section = '''  <!-- ============ ELIGIBILITY SECTION & INTERACTIVE CHECKER ============ -->
  <section class="section" id="eligibility" aria-labelledby="eligibility-title">
    <div class="container">
      <div class="eligibility-layout">
        <div class="elig-left">
          <span class="badge">Eligibility</span>
          <h2 id="eligibility-title" class="section-title">Who Can Apply</h2>
          <p class="section-subtitle" style="margin-bottom:28px;">Requirements are transparent and structured to ensure students are prepared for intensive deep skilling.</p>

          <div class="elig-rule-cards">
            <div class="elig-rule">
              <span class="elig-rule__icon"><svg class="icon"><use href="#icon-grad"/></svg></span>
              <div>
                <strong>1. Engineering Degree</strong>
                <p>Must be an engineering graduate, preferably from the <strong>2026, 2025 &amp; 2024</strong> batches (CSE, ECE, EEE, and allied disciplines).</p>
              </div>
            </div>

            <div class="elig-rule">
              <span class="elig-rule__icon"><svg class="icon"><use href="#icon-award"/></svg></span>
              <div>
                <strong>2. Academic Performance</strong>
                <p><strong>Minimum CGPA of 6.0</strong> with <strong>no standing arrears</strong> at cohort commencement.</p>
              </div>
            </div>

            <div class="elig-rule">
              <span class="elig-rule__icon"><svg class="icon"><use href="#icon-shield"/></svg></span>
              <div>
                <strong>3. Foundation Consistency</strong>
                <p><strong>Minimum 60%</strong> aggregate in 10th standard, 12th standard, or Diploma (if applicable).</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Eligibility Profiler Tool -->
        <div class="elig-profiler">
          <div class="elig-profiler-head">
            <span class="badge badge--orange">Instant Profiler</span>
            <h4>Verify Your Eligibility</h4>
            <p>Slide your scores to check profile qualification in real time.</p>
          </div>

          <form class="profiler-form" id="eligibility-profiler-form" novalidate>
            <div class="form-row">
              <div class="form-field">
                <label for="calc-grad-year">Graduation Year</label>
                <select id="calc-grad-year">
                  <option value="2026" selected>2026 (Final Year)</option>
                  <option value="2025">2025 (Graduate)</option>
                  <option value="2024">2024 (Graduate)</option>
                  <option value="other">2023 or Earlier</option>
                </select>
              </div>
              <div class="form-field">
                <label for="calc-arrears">Standing Arrears?</label>
                <select id="calc-arrears">
                  <option value="no" selected>No (0 Backlogs)</option>
                  <option value="yes">Yes (Have Arrears)</option>
                </select>
              </div>
            </div>

            <div class="form-field">
              <label for="slider-cgpa">B.Tech / B.E CGPA: <span id="val-cgpa">7.2</span></label>
              <div class="range-slider-wrap">
                <input type="range" id="slider-cgpa" min="4.0" max="10.0" step="0.1" value="7.2">
              </div>
            </div>

            <div class="form-field">
              <label for="slider-percent">10th / 12th / Diploma %: <span id="val-percent">75%</span></label>
              <div class="range-slider-wrap">
                <input type="range" id="slider-percent" min="40" max="100" step="1" value="75">
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
              Verify Profile Eligibility →
            </button>

            <div class="eligibility-output" id="profiler-output" role="status" aria-live="polite"></div>
          </form>
        </div>
      </div>
    </div>
  </section>'''

new_eligibility_section = '''  <!-- ============ ELIGIBILITY SECTION & INTERACTIVE CHECKER ============ -->
  <section class="section" id="eligibility" aria-labelledby="eligibility-title">
    <div class="container">
      <div class="section-head section-head--center">
        <span class="badge">Eligibility</span>
        <h2 id="eligibility-title" class="section-title">Who Can Apply</h2>
        <p class="section-subtitle">Requirements are transparent and structured to ensure students are prepared for intensive deep skilling.</p>
      </div>

      <div class="eligibility-layout">
        <!-- Left: 3 Criteria Cards aligned with Profiler -->
        <div class="elig-rule-cards">
          <div class="elig-rule">
            <span class="elig-rule__icon"><svg class="icon"><use href="#icon-grad"/></svg></span>
            <div class="elig-rule__content">
              <strong>1. Engineering Degree</strong>
              <p>Must be an engineering graduate, preferably from the <strong>2026, 2025 &amp; 2024</strong> batches (CSE, ECE, EEE, and allied disciplines).</p>
            </div>
          </div>

          <div class="elig-rule">
            <span class="elig-rule__icon"><svg class="icon"><use href="#icon-award"/></svg></span>
            <div class="elig-rule__content">
              <strong>2. Academic Performance</strong>
              <p><strong>Minimum CGPA of 6.0</strong> with <strong>no standing arrears</strong> at cohort commencement.</p>
            </div>
          </div>

          <div class="elig-rule">
            <span class="elig-rule__icon"><svg class="icon"><use href="#icon-shield"/></svg></span>
            <div class="elig-rule__content">
              <strong>3. Foundation Consistency</strong>
              <p><strong>Minimum 60%</strong> aggregate in 10th standard, 12th standard, or Diploma (if applicable).</p>
            </div>
          </div>
        </div>

        <!-- Right: Interactive Eligibility Profiler Tool -->
        <div class="elig-profiler">
          <div class="elig-profiler-head">
            <span class="badge badge--orange">Instant Profiler</span>
            <h4>Verify Your Eligibility</h4>
            <p>Slide your scores to check profile qualification in real time.</p>
          </div>

          <form class="profiler-form" id="eligibility-profiler-form" novalidate>
            <div class="form-row">
              <div class="form-field">
                <label for="calc-grad-year">Graduation Year</label>
                <select id="calc-grad-year">
                  <option value="2026" selected>2026 (Final Year)</option>
                  <option value="2025">2025 (Graduate)</option>
                  <option value="2024">2024 (Graduate)</option>
                  <option value="other">2023 or Earlier</option>
                </select>
              </div>
              <div class="form-field">
                <label for="calc-arrears">Standing Arrears?</label>
                <select id="calc-arrears">
                  <option value="no" selected>No (0 Backlogs)</option>
                  <option value="yes">Yes (Have Arrears)</option>
                </select>
              </div>
            </div>

            <div class="form-field">
              <label for="slider-cgpa">B.Tech / B.E CGPA: <span id="val-cgpa">7.2</span></label>
              <div class="range-slider-wrap">
                <input type="range" id="slider-cgpa" min="4.0" max="10.0" step="0.1" value="7.2">
              </div>
            </div>

            <div class="form-field">
              <label for="slider-percent">10th / 12th / Diploma %: <span id="val-percent">75%</span></label>
              <div class="range-slider-wrap">
                <input type="range" id="slider-percent" min="40" max="100" step="1" value="75">
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:8px;">
              Verify Profile Eligibility →
            </button>

            <div class="eligibility-output" id="profiler-output" role="status" aria-live="polite"></div>
          </form>
        </div>
      </div>
    </div>
  </section>'''

if old_eligibility_section in content:
    content = content.replace(old_eligibility_section, new_eligibility_section, 1)

# 3. Remove text under helpdesk@igenuinelearning.com
old_email_card = '''            <!-- Email Card -->
            <a class="contact-card-link" href="mailto:helpdesk@igenuinelearning.com" aria-label="Email helpdesk@igenuinelearning.com">
              <div class="contact-card-link__icon">
                <svg class="icon"><use href="#icon-mail"/></svg>
              </div>
              <div>
                <strong>Official Email Desk</strong>
                <p style="color:var(--blue-900); font-weight:700;">helpdesk@igenuinelearning.com</p>
                <span style="font-size:12.5px; color:var(--ink-muted); display:inline-block; margin-top:4px;">Admissions, Institutional Tie-ups &amp; Corporate Inquiries</span>
              </div>
            </a>'''

new_email_card = '''            <!-- Email Card -->
            <a class="contact-card-link" href="mailto:helpdesk@igenuinelearning.com" aria-label="Email helpdesk@igenuinelearning.com">
              <div class="contact-card-link__icon">
                <svg class="icon"><use href="#icon-mail"/></svg>
              </div>
              <div>
                <strong>Official Email Desk</strong>
                <p style="color:var(--blue-900); font-weight:700;">helpdesk@igenuinelearning.com</p>
              </div>
            </a>'''

if old_email_card in content:
    content = content.replace(old_email_card, new_email_card, 1)

# 4. Make sure contact form in index1.html has clean inputs with no prefilled values and clear feedback
content = content.replace('placeholder="e.g. John Doe"', 'placeholder="Your full name"')
content = content.replace('placeholder="e.g. +91 98765 43210"', 'placeholder="Your phone number"')
content = content.replace('placeholder="e.g. john@example.com"', 'placeholder="Your email address"')
content = content.replace('placeholder="e.g. Engineering College"', 'placeholder="Institution / Company (optional)"')
content = content.replace('placeholder="Tell us how we can help you with CareerEdge..."', 'placeholder="How can we help you?"')

with open('index1.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated index1.html successfully')
