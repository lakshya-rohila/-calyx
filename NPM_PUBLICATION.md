# NPM Publication Checklist

## Pre-Publication Steps

### 1. Build the Library
```bash
npm run build
```
This creates the `dist/` folder with compiled output.

### 2. Run Tests
```bash
npm test
npm run typecheck
```
Ensure all tests pass and there are no TypeScript errors.

### 3. Update Version (if needed)
Current version: **0.2.0**

To bump version:
```bash
npm version patch  # 0.2.0 → 0.2.1
npm version minor  # 0.2.0 → 0.3.0
npm version major  # 0.2.0 → 1.0.0
```

### 4. Create GitHub Assets Folder
```bash
mkdir -p .github/assets
```

Then add:
- `logo.png` - Your logo image
- `demo.gif` - Animated demo (convert from demo.mov)

### 5. Convert Demo Video to GIF
```bash
# Using ffmpeg (install with: brew install ffmpeg)
ffmpeg -i demo.mov -vf "fps=10,scale=300:-1:flags=lanczos" -c:v gif .github/assets/demo.gif
```

### 6. Login to NPM
```bash
npm login
```

Enter your npm credentials.

### 7. Dry Run (Test Package)
```bash
npm pack
```

This creates a `.tgz` file showing exactly what will be published.
Check the contents:
```bash
tar -tzf calyx-rn-0.2.0.tgz
```

### 8. Test the Package Locally
```bash
npm pack
cd /path/to/test-project
npm install /path/to/calyx-rn-0.2.0.tgz
```

## Publication

### Publish to NPM
```bash
npm publish
```

Or publish as beta:
```bash
npm publish --tag beta
```

## Post-Publication Steps

### 1. Create GitHub Release
1. Go to: https://github.com/lakshya-rohila/-calyx/releases
2. Click "Create a new release"
3. Tag: `v0.2.0`
4. Title: `v0.2.0 - Timeline & Agenda Views`
5. Description: Copy from release notes below
6. Publish release

### 2. Verify NPM Package
Visit: https://www.npmjs.com/package/calyx-rn

Check that:
- README displays correctly
- Version is correct
- Files are included properly

### 3. Test Installation
```bash
npx react-native init TestApp
cd TestApp
npm install calyx-rn date-fns
```

### 4. Update GitHub README
Push all changes to GitHub:
```bash
git add .
git commit -m "chore: prepare for npm publication v0.2.0"
git push origin main
```

## Release Notes Template

```markdown
## v0.2.0 - Timeline & Agenda Views

### 🎉 New Features

- **Timeline View** - Hourly grid with conflict detection and side-by-side events
- **Agenda View** - Chronological event list with day/week/month grouping
- **Event Management** - Full CRUD operations for calendar events
- **6 Built-in Themes** - Light, dark, ocean, forest, sunset, minimal

### 📦 Installation

\`\`\`bash
npm install calyx-rn date-fns
\`\`\`

### 🚀 Quick Start

\`\`\`tsx
import { Calendar } from 'calyx-rn';

<Calendar mode="timeline" events={events} />
\`\`\`

See [README](https://github.com/lakshya-rohila/-calyx#readme) for full documentation.
```

## Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- Check package name isn't taken: `npm view calyx-rn`

### "prepublishOnly script failed"
- Fix failing tests or build errors
- Or temporarily disable: Remove `prepublishOnly` from package.json

### "Missing README"
- Ensure README.md is in the root directory
- Check it's not in `.npmignore`

## Important Notes

- ✅ Package name: `calyx-rn` (no scoped package)
- ✅ Version: 0.2.0
- ✅ License: MIT
- ✅ Repository: https://github.com/lakshya-rohila/-calyx
- ✅ Main entry: `dist/index.js`
- ✅ Types: `dist/index.d.ts`
- ✅ Peer dependencies: react, react-native, date-fns

## Next Steps After Publication

1. Announce on Twitter/X
2. Post on Reddit (r/reactnative)
3. Submit to React Native Directory
4. Create documentation site (optional)
5. Add examples to documentation
6. Monitor GitHub issues

Good luck with your publication! 🚀
