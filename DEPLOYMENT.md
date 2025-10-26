# Deployment Guide: NVR Application with Dual Modes

## Overview
This application has two modes:
1. **Student Mode** (default): Students can generate AI questions or browse the library with public reviews
2. **Reviewer Mode**: Your team can load questions from the library and add/edit reviews

Reviews are stored in **Vercel KV** (cloud storage) and are automatically visible to all users in real-time.

---

## 🚀 Deploying to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add dual-mode functionality with Vercel KV reviews"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Add `VITE_API_KEY` with your Gemini API key

### Step 3: Create Vercel KV Database
1. After deployment, go to your project dashboard
2. Click on the "Storage" tab
3. Click "Create Database"
4. Select "KV" (Key-Value storage)
5. Give it a name (e.g., "nvr-reviews")
6. Click "Create"
7. **Done!** Vercel automatically connects the KV database to your project

### Step 4: Redeploy
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment
3. This ensures the KV environment variables are available

---

## 📖 How to Use

### For Reviewers (Your Team)

1. **Access Reviewer Mode**:
   - Visit: `https://your-app.vercel.app/?mode=reviewer`
   - Or use the toggle switch in the header

2. **Review Questions**:
   - Select a topic and difficulty
   - Click "Load Questions from Library"
   - Navigate through questions
   - Click "Review Question" button
   - Add star rating (1-5) and comments
   - Click "Save Review" → **Instantly saved to cloud!** ✅

3. **Reviews are automatic**:
   - No need to export or commit anything
   - Reviews are immediately visible to all users
   - You can edit reviews anytime

### For Students (End Users)

1. **Access Student Mode**:
   - Visit: `https://your-app.vercel.app` (default mode)
   - Or use the toggle switch

2. **Two Options**:
   - **Generate with AI**: Create new questions using Gemini AI
   - **Browse Library**: View pre-created questions with team reviews

3. **See Reviews**:
   - Reviews are shown below each question
   - Star ratings visible
   - Team comments visible
   - Read-only (students can't edit reviews)

---

## 📁 Question Library Structure

Your questions are in `/questions` folder:
```
questions/
├── anologies/
│   ├── NVR_Analogies_Questions_easy.json
│   ├── NVR_Analogies_Questions_medium.json
│   └── NVR_Analogies_Questions_hard.json
├── odd_one_out/
├── rotations/
├── reflections/
├── ...
└── (8 topics total, 3 difficulties each = 24 files)
```

These files are **static** - they don't change. Reviews are stored separately in Vercel KV.

---

## 🔑 Vercel KV Limits (Free Tier)

- **Storage**: 256 MB
- **Requests**: 100,000 per month
- **More than enough** for your use case!

---

## 🔧 Troubleshooting

### Reviews not saving?
- Check Vercel KV is created in Storage tab
- Redeploy after creating KV database
- Check browser console for errors

### Questions not loading?
- Verify JSON files are in the correct folders
- Check topic names match exactly (case-sensitive)
- Open browser console to see error messages

### Mode toggle not working?
- Clear browser cache
- Check URL parameter: `?mode=reviewer` or `?mode=user`

---

## 💡 Tips

1. **Share Reviewer Link**: Send `https://your-app.vercel.app/?mode=reviewer` to your team
2. **Bookmark It**: Reviewers can bookmark the reviewer mode URL
3. **Mobile Friendly**: Works on phones/tablets for reviewing on the go
4. **No Database Setup**: Vercel KV is automatic - no complex configuration!

---

## 🎯 Next Steps

1. Deploy to Vercel
2. Create KV database
3. Share reviewer link with your team
4. Start reviewing questions!
5. Reviews are instantly visible to students

---

## 📊 Data Flow

```
Reviewer adds review
    ↓
Saved to Vercel KV (cloud)
    ↓
Instantly available globally
    ↓
All users see updated reviews
    ↓
No manual work needed! ✅
```

Happy reviewing! 🎉
