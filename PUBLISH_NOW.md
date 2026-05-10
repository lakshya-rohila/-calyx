# Publishing to npm - Quick Steps

## ✅ What's Ready

1. ✅ Tests fixed and passing (103 tests)
2. ✅ Build working perfectly
3. ✅ Logo added (`.github/assets/logo.png`)
4. ✅ Demo GIF created (`.github/assets/demo.gif`)
5. ✅ README updated with correct paths
6. ✅ Package metadata configured

## 🚀 Steps to Publish

### 1. Push Assets to GitHub

```bash
git push
```

Enter your SSH passphrase when prompted.

### 2. Verify Assets on GitHub

Visit: https://github.com/lakshya-rohila/-calyx/tree/main/.github/assets

Make sure you can see:
- `logo.png`
- `demo.gif`

### 3. Publish to npm

```bash
npm publish --otp=YOUR_6_DIGIT_CODE
```

Get your OTP code from your authenticator app (Google Authenticator, Authy, etc.)

Example:
```bash
npm publish --otp=123456
```

### 4. Verify Publication

After successful publication:

1. **Visit your npm package**: https://www.npmjs.com/package/calyx-rn
2. **Check the demo GIF displays** in the README
3. **Check the logo displays** at the top

## 📊 Package Info

- **Name**: `calyx-rn`
- **Version**: 0.3.0
- **Size**: ~113 KB
- **Files**: 57 files
- **License**: MIT

## 🎉 After Publication

1. **Create GitHub Release**
   - Go to: https://github.com/lakshya-rohila/-calyx/releases/new
   - Tag: `v0.3.0`
   - Title: `v0.3.0 - Timeline & Agenda Views`
   - Copy release notes from `NPM_PUBLICATION.md`

2. **Test Installation**
   ```bash
   npx react-native init TestApp
   cd TestApp
   npm install calyx-rn date-fns
   ```

3. **Share on Social Media**
   - Twitter/X
   - Reddit (r/reactnative)
   - Dev.to
   - LinkedIn

## 🐛 Troubleshooting

### Assets Not Showing on npm
- Wait 5-10 minutes after pushing to GitHub
- GitHub CDN needs time to propagate
- Check the raw GitHub URL works first

### OTP Issues
- Code expired? Get a fresh code from your authenticator
- Typo? Try again with a new code
- Format: 6 digits only, no spaces

### Version Already Published
```bash
npm version patch  # Bump to 0.3.1
npm publish --otp=YOUR_CODE
```

## ✨ You're Almost There!

Just need to:
1. ✅ Push to GitHub (so assets are accessible)
2. ✅ Run `npm publish --otp=YOUR_CODE`
3. ✅ Celebrate! 🎉
