---
description: Generate Nano Banana Pro prompts for LINE Rich Menu designs
allowed-tools: AskUserQuestion
---

# Rich Menu Prompt Generator

Generate optimized Nano Banana Pro (Google Gemini 3 Pro Image) prompts for LINE Official Account Rich Menu (圖文選單) designs through an interactive questionnaire.

## Instructions

**Tool Requirement**: Use `AskUserQuestion` tool for interactive questionnaire to collect all design requirements.

### LINE Rich Menu Specifications

- **Supported Sizes** (6 official formats):
  - Large: 2500x1686 (1.48:1), 1200x810, 800x540 → supports 1-6 buttons
  - Small: 2500x843 (2.97:1), 1200x405, 800x270 → supports 1-3 buttons

- **Large Templates (7 types)**:
  | 版型名稱 | 按鈕數 | 排列方式 | 描述 |
  |---------|-------|---------|------|
  | 6格標準 | 6 | 2x3 grid | 上下兩排，每排3格 |
  | 4格標準 | 4 | 2x2 grid | 上下兩排，每排2格 |
  | 4格變體 | 4 | 1-top + 3-bottom | 上方1大橫幅 + 下方3格 |
  | 3格A | 3 | 1-left + 2-right | 左側1大格 + 右側上下2格 |
  | 3格B | 3 | 2-left + 1-right | 左側上下2格 + 右側1大格 |
  | 2格 | 2 | 1x2 horizontal | 左右兩等分 |
  | 1格 | 1 | full | 單一大按鈕 |

- **Brand Zone Templates (品牌分區版型)** - For menus with prominent brand/logo area:
  | 版型名稱 | 結構 | 品牌區比例 | 按鈕區 | 適用場景 |
  |---------|------|-----------|--------|----------|
  | 品牌區+1按鈕 | Brand + 1 Button | 上60% | 下40%單按鈕 | 未註冊/引導頁 |
  | 品牌區+2按鈕 | Brand + 2 Buttons | 上50% | 下50%雙按鈕橫向 | 簡單功能選單 |
  | 品牌區+3按鈕 | Brand + 3 Buttons | 上50% | 下50%三按鈕橫向 | 標準功能選單 |
  | 1品牌格+5按鈕 | 1 Brand + 5 Buttons | 2x3格左上格 | 其餘5格按鈕 | 組長/管理選單 |

- **Compact Templates (5 types)**:
  | 版型名稱 | 按鈕數 | 排列方式 | 描述 |
  |---------|-------|---------|------|
  | 3格 | 3 | 1x3 horizontal | 橫向三等分 |
  | 2格A | 2 | 1x2 equal | 左右兩等分 |
  | 2格B | 2 | 2:1 ratio | 左大右小 |
  | 2格C | 2 | 1:2 ratio | 左小右大 |
  | 1格 | 1 | full-width | 單一橫幅按鈕 |

- **File Requirements**: PNG/JPEG format, max 1MB file size
- **Design Constraints**:
  - Full-bleed edge-to-edge design (no margins/borders/background environment)
  - Exact button count only (no additional blocks or panels)
  - Landscape orientation mode only
  - Aspect ratio must be precisely maintained

### Nano Banana Pro Prompting Best Practices (2026)

- **Creative Director approach**: Use narrative descriptions, NOT comma-separated tag lists
- **Thinking model**: Describe design intent, composition, and spatial relationships
- **Traditional Chinese handling**: Explicitly specify "Traditional Chinese (繁體中文)" with quotation marks
- **Commercial quality keywords**: Include "commercial UI/UX design, high fidelity, 8K resolution, vector-style clarity"
- **Avoid tag soup**: Replace keyword lists like "button, gold, 4k, realistic" with narrative descriptions like "elegant golden button with soft shadow and refined typography"

### Design Dimensions to Collect

1. **產業定位** (Industry): Medical aesthetics, F&B, retail, education, finance, tech, etc.
2. **設計風格** (Style): Glassmorphism, flat minimalist, watercolor, cyberpunk, luxury business, cute illustration
3. **材質質感** (Material): Frosted glass, velvet, 3D clay, metallic, paper texture, matte plastic
4. **光影設定** (Lighting): Soft studio, natural window light, tech rim light, golden hour, cool blue tone
5. **品牌配色** (Color Palette): Primary brand color (hex code or color name), secondary colors
6. **版型結構** (Layout): Size selection + button count configuration
7. **文字內容** (Button Text): Required Chinese text + optional icon descriptions + optional button colors

## Workflow

### Step 1: Collect Core Design Settings

Use AskUserQuestion with 4 questions:

1. **版型類型** (Layout Type)
   - Header: "版型類型"
   - Question: "請選擇版型類型"
   - Options:
     - 標準格子版型 (Standard Grid - 純按鈕格子排列)
     - 品牌分區版型 (Brand Zone - 上方品牌區 + 下方按鈕區)
   - MultiSelect: false

2. **產業類型** (Industry Type)
   - Header: "產業類型"
   - Question: "請選擇您的產業類型"
   - Options:
     - 醫美診所 (Medical aesthetics clinic)
     - 餐飲美食 (Food & beverage)
     - 零售電商 (E-commerce retail)
     - 教育培訓 (Education & training)
     - 金融服務 (Financial services)
     - 科技產品 (Tech product)
   - MultiSelect: false

3. **設計風格** (Design Style)
   - Header: "設計風格"
   - Question: "請選擇您想要的設計風格"
   - Options:
     - 3D玻璃擬態 (Glassmorphism - frosted glass, transparency)
     - 扁平化極簡 (Flat minimalist - clean, bold colors)
     - 溫暖手繪水彩 (Warm watercolor - organic, soft)
     - 賽博龐克霓虹 (Cyberpunk neon - vibrant glows, dark)
     - 高級商務 (Luxury business - sophisticated, elegant)
     - 可愛插畫 (Cute illustration - playful, pastel)
   - MultiSelect: false

4. **圖文選單尺寸** (Rich Menu Size)
   - Header: "選單尺寸"
   - Question: "請選擇圖文選單尺寸（建議使用 2500x1686 獲得最佳品質）"
   - Options:
     - 2500x1686 (大版型高解析, 最多6按鈕) - Recommended
     - 2500x843 (小版型高解析, 最多3按鈕)
     - 1200x810 (大版型中解析, 最多6按鈕)
     - 1200x405 (小版型中解析, 最多3按鈕)
     - 800x540 (大版型小解析, 最多6按鈕)
     - 800x270 (小版型小解析, 最多3按鈕)
   - MultiSelect: false

### Step 2: Collect Visual Details

Use AskUserQuestion with 3 questions:

1. **材質質感** (Material/Texture)
   - Header: "材質質感"
   - Question: "請選擇畫面的材質質感"
   - Options:
     - 磨砂玻璃 (Frosted glass - subtle transparency)
     - 絲絨柔滑 (Velvet - rich tactile depth)
     - 3D黏土 (3D clay - matte, playful)
     - 金屬光澤 (Metallic - reflective, premium)
     - 紙質紋理 (Paper texture - organic, warm)
     - 霧面塑膠 (Matte plastic - clean, modern)
   - MultiSelect: false

2. **光影設定** (Lighting Setup)
   - Header: "光影設定"
   - Question: "請選擇光影氛圍"
   - Options:
     - 柔和攝影棚打光 (Soft studio - even, gentle shadows)
     - 自然窗邊光 (Natural window - warm highlights)
     - 科技邊緣光 (Tech rim light - cool glow, edges)
     - 溫暖黃金時刻 (Golden hour - amber tones)
     - 冷調藍色調 (Cool blue - modern, crisp)
   - MultiSelect: false

3. **主要品牌色** (Primary Brand Color)
   - Header: "品牌色"
   - Question: "請輸入主要品牌色（可使用色碼如 #FFD700 或顏色名稱如「深藍色」）"
   - Free text input (no options array)

### Step 2.5: Collect Brand Zone Content (Only for Brand Zone Layouts)

**Skip this step if user selected "標準格子版型" in Step 1.**

If user selected "品牌分區版型", use AskUserQuestion with 2 questions:

1. **品牌分區版型選擇** (Brand Zone Layout Selection)
   - Header: "分區版型"
   - Question: "請選擇品牌分區版型"
   - Options:
     - 品牌區+1按鈕 (上60%品牌區 + 下40%單按鈕) - 適合引導頁
     - 品牌區+2按鈕 (上50%品牌區 + 下50%雙按鈕) - 簡單選單
     - 品牌區+3按鈕 (上50%品牌區 + 下50%三按鈕) - 標準選單
     - 1品牌格+5按鈕 (2x3格式，左上品牌格+5功能按鈕) - 管理選單
   - MultiSelect: false

2. **品牌區內容** (Brand Zone Content)
   - Header: "品牌區"
   - Question: "請描述品牌區內容（品牌名稱/Logo文字 + 標語/說明文字）"
   - Format: "品牌名稱|標語或說明文字"
   - Example: "BNI 引薦回報系統|每週引薦，共創成長"
   - Free text input

### Step 3: Collect Button Content

Based on the selected layout type, determine button count:

**For Standard Grid Layouts (標準格子版型):**
- 2500x1686, 1200x810, 800x540 → Ask for up to 6 buttons
- 2500x843, 1200x405, 800x270 → Ask for up to 3 buttons

**For Brand Zone Layouts (品牌分區版型):**
- 品牌區+1按鈕 → Ask for exactly 1 button
- 品牌區+2按鈕 → Ask for exactly 2 buttons
- 品牌區+3按鈕 → Ask for exactly 3 buttons
- 1品牌格+5按鈕 → Ask for exactly 5 buttons

Prompt user with text input instructions:
- Format: "1. 按鈕文字|圖示描述(選填)|顏色(選填)  2. 按鈕文字|圖示(選填)|顏色(選填)  ..."
- Example: "1. 最新活動|星星圖示|金色背景  2. 會員專區|皇冠圖示  3. 聯絡客服"
- Required: Traditional Chinese button text
- Optional: Icon description, individual button background color

### Step 4: Generate Nano Banana Pro Prompt

1. Map all collected Chinese inputs to detailed English descriptions using the Variable Mapping Reference
2. Parse button input string and extract text/icon/color for each button
3. Determine grid layout based on size and button count
4. Build complete prompt using the Report format template
5. Output formatted result with design summary, prompt, and usage instructions

## Report

Generate and output in this exact format:

```
🎨 LINE Rich Menu 設計配置
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
產業: [user's industry choice in Chinese]
風格: [user's style choice in Chinese]
尺寸: [WIDTH]x[HEIGHT] ([aspect ratio])
版型: [layout description] - [button count]個按鈕
主色: [user's color input]
材質: [user's material choice in Chinese]
光影: [user's lighting choice in Chinese]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Nano Banana Pro Prompt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a [WIDTH]x[HEIGHT] pixel LINE Rich Menu image for [INDUSTRY_EN], [STYLE_EN] aesthetic with [MATERIAL_EN] textures and [LIGHTING_EN].

Visual Composition:
- Full-bleed edge-to-edge design (no margins, no borders, no background environment)
- Overall color palette: [PRIMARY_COLOR] as dominant brand color with [complementary/analogous] harmony creating cohesive visual identity
- Background: [clean/textured based on style] [color-related description] with [lighting atmosphere description]
- Material quality: [detailed material characteristics from mapping - e.g., "smooth frosted glass with subtle transparency and soft light diffusion" / "luxurious velvet material with rich tactile depth and soft sheen" / "rendered 3D clay with matte finish and playful dimensional quality"]
- Lighting: [detailed lighting setup from mapping - e.g., "soft diffused studio lighting creating gentle shadows and even illumination" / "natural window light from the side with warm highlights and soft shadows"]
- Typography: Modern sans-serif typeface, bold weight (700-900) for Traditional Chinese text, ensuring mobile legibility and clear readability

Layout Structure - [LAYOUT_NAME] ([WIDTHxHEIGHT], aspect ratio [RATIO]):
[Dynamic grid description based on button count and size:]
- Grid arrangement: [e.g., "2x3 six-button grid with two rows" / "2x2 four-button grid" / "horizontal three-button strip" / etc.]
- Each button zone clearly separated with [subtle borders / soft drop shadows / generous negative space / fine dividing lines]
- Balanced composition with strong visual hierarchy guiding user attention
- Professional spacing ensuring touch-friendly interaction zones (minimum 44x44pt tap targets)

Button Content:
[For each button, generate rich narrative description with position awareness:]
1. [Position description: "Top-left" / "First" / etc.] button: Displays Traditional Chinese text "[BUTTON_TEXT_1]" in [estimated size]px bold [color coordinating with palette] font[if icon provided: ", accompanied by [ICON_DESCRIPTION] icon elegantly positioned [above/to the left of/integrated with] the text"][if button color provided: ", set against [BUTTON_COLOR] background creating [describe visual effect like 'warm emphasis' or 'subtle contrast']"]
2. [Position] button: Traditional Chinese text "[BUTTON_TEXT_2]"...
[Continue for all buttons with similar rich descriptions]

Design Requirements:
- Strict layout constraint: EXACTLY [button count] buttons in the composition, NO additional decorative blocks, panels, or UI elements
- Text rendering: Pixel-perfect Traditional Chinese (繁體中文) characters with zero encoding errors, garbled symbols, or simplified Chinese substitutions
- Commercial design quality: Professional brand marketing standard suitable for official LINE Official Account deployment
- Visual hierarchy: Clear primary/secondary button differentiation achieved through strategic use of size, color weight, or visual emphasis
- Responsive considerations: All text must remain readable at mobile scale with minimum 14px equivalent sizing at actual display dimensions
- Composition principles: Balanced negative space distribution, precise alignment on invisible grid, cohesive color story throughout
- Aspect ratio precision: [exact ratio like 1.48:1 or 2.97:1] aspect ratio locked and maintained exactly

Quality Specifications:
High fidelity rendering, 8K resolution output, vector-style clarity and sharpness, commercial UI/UX design excellence, trending on Behance and Dribbble, masterpiece quality execution, sharp focus throughout, professional brand identity design standards, mobile-optimized interface perfection.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 使用說明
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 複製上方完整 Prompt
2. 前往 Nano Banana Pro (Google Gemini 圖片生成)
   - 網址: https://gemini.google.com/ 或使用 Google AI Studio
3. 將 Prompt 貼上並點擊生成
4. 下載生成的圖片並進行檢查:
   ✓ 尺寸正確: [WIDTH]x[HEIGHT] pixels
   ✓ 檔案格式: PNG 或 JPEG
   ✓ 檔案大小: 小於 1 MB (如超過請使用壓縮工具或降低品質)
   ✓ 文字清晰度: 所有繁體中文字清楚可讀，無亂碼或錯字
   ✓ 按鈕數量: 剛好 [button count] 個按鈕，沒有多餘區塊
5. **圖片尺寸調整** (重要！AI 生成的圖片可能尺寸不精確)
   ```bash
   # macOS 使用 sips 調整尺寸並轉 JPEG 壓縮
   # 大版型 2500x1686 (60% 品質可確保 < 1MB)
   sips -s format jpeg -s formatOptions 60 "generated_image.png" \
       --out "richmenu.jpg" --resampleHeightWidth 1686 2500

   # 小版型 2500x843
   sips -s format jpeg -s formatOptions 60 "generated_image.png" \
       --out "richmenu.jpg" --resampleHeightWidth 843 2500
   ```
   ⚠️ LINE API 要求圖片尺寸必須與 JSON 設定完全一致，否則無法上傳
6. 上傳至 LINE Official Account Manager
   - 登入 LINE Official Account Manager
   - 進入「圖文選單」功能
   - 上傳圖片並設定按鈕動作連結

💡 提示:
- 如果生成的圖片文字有誤，可以在 Prompt 中加強「Traditional Chinese (繁體中文)」的描述
- 如果按鈕數量不對，重新生成並強調「EXACTLY [N] buttons」
- 建議生成 2-3 個版本，選擇最符合需求的設計

📐 LINE 圖文選單技術規格:
- 標準尺寸: 2500x1686, 2500x843, 1200x810, 1200x405, 800x540, 800x270
- 檔案格式: JPEG, JPG, PNG
- 檔案大小上限: 1 MB
- 色彩模式: RGB
- 建議尺寸: 2500x1686 (提供最高品質與最大彈性)
```

### Variable Mapping Reference

Use these mappings to convert Chinese user inputs to detailed English descriptions:

**產業 (Industry) → English Context:**
- 醫美診所 → "Korean-style medical aesthetics clinic" or "premium beauty med-spa"
- 餐飲美食 → "gourmet restaurant" or "artisan cafe & bakery" or "culinary dining establishment"
- 零售電商 → "e-commerce retail boutique" or "online fashion marketplace"
- 教育培訓 → "education & training institution" or "online learning platform"
- 金融服務 → "financial services provider" or "modern fintech company"
- 科技產品 → "innovative tech product" or "SaaS platform" or "digital technology solution"

**風格 (Style) → English Aesthetic Description:**
- 3D玻璃擬態 → "glassmorphism with layered frosted glass elements, subtle transparency effects, and soft dimensional depth"
- 扁平化極簡 → "flat minimalist design featuring clean geometric lines, bold saturated colors, and simple uncluttered shapes"
- 溫暖手繪水彩 → "warm hand-drawn watercolor style with organic brushstrokes, soft color bleeding, and artistic texture"
- 賽博龐克霓虹 → "cyberpunk neon aesthetic with vibrant electric glows, dark moody backgrounds, and futuristic sci-fi elements"
- 高級商務 → "luxury business premium style emphasizing sophisticated elegance, refined subtle details, and professional polish"
- 可愛插畫 → "cute kawaii illustration style with playful friendly characters, soft pastel color palette, and charming appeal"

**材質 (Material) → English Texture Characteristics:**
- 磨砂玻璃 → "smooth frosted glass texture with subtle transparency, gentle light diffusion, and refined surface quality"
- 絲絨柔滑 → "luxurious velvet material exhibiting rich tactile depth, soft dimensional sheen, and premium fabric quality"
- 3D黏土 → "rendered 3D clay with uniform matte finish, smooth organic surfaces, and playful dimensional quality"
- 金屬光澤 → "polished metallic surface with crisp reflective highlights, brushed finish treatment, and premium industrial feel"
- 紙質紋理 → "natural paper texture featuring organic visible grain, subtle surface roughness, and warm authentic quality"
- 霧面塑膠 → "modern matte plastic with clean smooth surfaces, contemporary minimalist appeal, and refined non-reflective finish"

**光影 (Lighting) → English Lighting Setup:**
- 柔和攝影棚打光 → "soft diffused studio lighting creating gentle graduated shadows, even balanced illumination across surfaces, and professional photographic quality"
- 自然窗邊光 → "natural window light streaming from the side creating warm golden highlights, soft organic shadows, and authentic atmospheric quality"
- 科技邊緣光 → "futuristic rim lighting precisely emphasizing object edges with cool technological glow, modern precision, and digital aesthetic"
- 溫暖黃金時刻 → "warm golden hour lighting with rich amber tones, long soft shadows stretching naturally, and inviting sunset warmth"
- 冷調藍色調 → "cool blue tone lighting creating modern tech atmosphere, crisp clean highlights, and digital minimalist aesthetic"

**Layout Names Based on Size & Button Count:**

**Large (2500x1686) - Standard Grid:**
- 6 buttons → "Standard 2x3 Six-Button Grid" (上下兩排，每排3格)
- 5 buttons → "Asymmetric Five-Button Layout" (上排3格 + 下排2格)
- 4 buttons (2x2) → "Standard 2x2 Four-Button Grid" (上下兩排，每排2格)
- 4 buttons (1+3) → "Banner-Top Four-Button Layout" (上方橫幅 + 下方3格)
- 3 buttons (1+2) → "Left-Heavy Three-Button Layout" (左大 + 右上下)
- 3 buttons (2+1) → "Right-Heavy Three-Button Layout" (左上下 + 右大)
- 3 buttons (horizontal) → "Horizontal Three-Button Strip" (橫向3格)
- 2 buttons → "Split Two-Button Layout" (左右兩等分)
- 1 button → "Full-Canvas Single Button" (單一大按鈕)

**Large (2500x1686) - Brand Zone:**
- Brand + 1 button → "Brand Banner with Single CTA Button" (上60%品牌區 + 下40%單按鈕)
- Brand + 2 buttons → "Brand Banner with Dual Action Buttons" (上50%品牌區 + 下50%雙按鈕橫向)
- Brand + 3 buttons → "Brand Banner with Triple Action Strip" (上50%品牌區 + 下50%三按鈕橫向)
- 1 Brand grid + 5 buttons → "Brand Grid with Five-Button Panel" (2x3格式，左上品牌格+5功能按鈕)

**Compact (2500x843):**
- 3 buttons → "Compact Three-Button Strip" (橫向三等分)
- 2 buttons (equal) → "Compact Two-Button Strip" (左右兩等分)
- 2 buttons (2:1) → "Compact Two-Button Weighted Left" (左大右小)
- 2 buttons (1:2) → "Compact Two-Button Weighted Right" (左小右大)
- 1 button → "Compact Full-Width Button" (單一橫幅)

### Button Coordinate Reference (for API implementation)

**Large 2500x1686 - 6 Buttons (2x3):**
| Position | Grid | X | Y | Width | Height |
|----------|------|-----|-----|-------|--------|
| Top-Left | Row 1, Col 1 | 0 | 0 | 833 | 843 |
| Top-Center | Row 1, Col 2 | 833 | 0 | 834 | 843 |
| Top-Right | Row 1, Col 3 | 1667 | 0 | 833 | 843 |
| Bottom-Left | Row 2, Col 1 | 0 | 843 | 833 | 843 |
| Bottom-Center | Row 2, Col 2 | 833 | 843 | 834 | 843 |
| Bottom-Right | Row 2, Col 3 | 1667 | 843 | 833 | 843 |

**Large 2500x1686 - 4 Buttons (2x2):**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Top-Left | 0 | 0 | 1250 | 843 |
| Top-Right | 1250 | 0 | 1250 | 843 |
| Bottom-Left | 0 | 843 | 1250 | 843 |
| Bottom-Right | 1250 | 843 | 1250 | 843 |

**Large 2500x1686 - 4 Buttons (1+3 Banner):**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Top Banner | 0 | 0 | 2500 | 843 |
| Bottom-Left | 0 | 843 | 833 | 843 |
| Bottom-Center | 833 | 843 | 834 | 843 |
| Bottom-Right | 1667 | 843 | 833 | 843 |

**Large 2500x1686 - 3 Buttons (1+2 Left-Heavy):**
| Position | X | Y | Width | Height |
|----------|------|-----|-------|--------|
| Left (Large) | 0 | 0 | 1666 | 1686 |
| Right-Top | 1667 | 0 | 833 | 843 |
| Right-Bottom | 1667 | 843 | 833 | 843 |

**Large 2500x1686 - 3 Buttons (2+1 Right-Heavy):**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Left-Top | 0 | 0 | 833 | 843 |
| Left-Bottom | 0 | 843 | 833 | 843 |
| Right (Large) | 833 | 0 | 1667 | 1686 |

**Large 2500x1686 - 2 Buttons:**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Left | 0 | 0 | 1250 | 1686 |
| Right | 1250 | 0 | 1250 | 1686 |

**Large 2500x1686 - 1 Button:**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Full | 0 | 0 | 2500 | 1686 |

**Compact 2500x843 - 3 Buttons:**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Left | 0 | 0 | 833 | 843 |
| Center | 833 | 0 | 834 | 843 |
| Right | 1667 | 0 | 833 | 843 |

**Compact 2500x843 - 2 Buttons (Equal):**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Left | 0 | 0 | 1250 | 843 |
| Right | 1250 | 0 | 1250 | 843 |

**Compact 2500x843 - 2 Buttons (2:1 Weighted Left):**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Left (Large) | 0 | 0 | 1666 | 843 |
| Right (Small) | 1667 | 0 | 833 | 843 |

**Compact 2500x843 - 2 Buttons (1:2 Weighted Right):**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Left (Small) | 0 | 0 | 833 | 843 |
| Right (Large) | 833 | 0 | 1667 | 843 |

**Compact 2500x843 - 1 Button:**
| Position | X | Y | Width | Height |
|----------|-----|-----|-------|--------|
| Full | 0 | 0 | 2500 | 843 |

### Brand Zone Layout Coordinates (品牌分區版型座標)

**Brand Zone + 1 Button (品牌區+1按鈕) - 2500x1686:**
| Zone | Position | X | Y | Width | Height | Ratio |
|------|----------|-----|-----|-------|--------|-------|
| Brand Zone | Top | 0 | 0 | 2500 | 1012 | 60% |
| Button | Bottom | 0 | 1012 | 2500 | 674 | 40% |

**Brand Zone + 2 Buttons (品牌區+2按鈕) - 2500x1686:**
| Zone | Position | X | Y | Width | Height | Ratio |
|------|----------|-----|-----|-------|--------|-------|
| Brand Zone | Top | 0 | 0 | 2500 | 843 | 50% |
| Button 1 | Bottom-Left | 0 | 843 | 1250 | 843 | 50% |
| Button 2 | Bottom-Right | 1250 | 843 | 1250 | 843 | 50% |

**Brand Zone + 3 Buttons (品牌區+3按鈕) - 2500x1686:**
| Zone | Position | X | Y | Width | Height | Ratio |
|------|----------|-----|-----|-------|--------|-------|
| Brand Zone | Top | 0 | 0 | 2500 | 843 | 50% |
| Button 1 | Bottom-Left | 0 | 843 | 833 | 843 | 33% |
| Button 2 | Bottom-Center | 833 | 843 | 834 | 843 | 33% |
| Button 3 | Bottom-Right | 1667 | 843 | 833 | 843 | 33% |

**1 Brand Grid + 5 Buttons (1品牌格+5按鈕) - 2500x1686 (2x3 Grid):**
| Zone | Position | X | Y | Width | Height |
|------|----------|-----|-----|-------|--------|
| Brand Zone | Top-Left | 0 | 0 | 833 | 843 |
| Button 1 | Top-Center | 833 | 0 | 834 | 843 |
| Button 2 | Top-Right | 1667 | 0 | 833 | 843 |
| Button 3 | Bottom-Left | 0 | 843 | 833 | 843 |
| Button 4 | Bottom-Center | 833 | 843 | 834 | 843 |
| Button 5 | Bottom-Right | 1667 | 843 | 833 | 843 |
